<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:17:31
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-07-20 13:02:00
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MApprovalMenu extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_approval_menu';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_approval_menu
     * Single data | array
     * Where condition "LIKE %$1%"
     * Response data: status[success|error], total[total_record], data[single|array]
     *=============================================================*/
    public function get_index($pk = null){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $limit          = 5000;
        $offset         = 0;

        $select         = ['SM.*'];
        $query = \DB::select_array($select)
                         ->from([$this->main_table, 'SM']);
        /*==================================================
         * Filter Data
         *==================================================*/
        foreach ($field_filters as $field) {
            if(isset($param[$field]) || !empty($param[$field])){
                if(is_array($param[$field])){
                    $query->and_where('SM.' . $field, 'IN', $param[$field]);
                }else{
                    switch ($field) {
                        case 'item_status':
                            $query->and_where('SM.' . $field, '=', $param[$field]);
                            break;
                        default:
                            $query->and_where('SM.' . $field, 'LIKE', '%' . $param[$field] . '%');
                            break;
                    }
                }
            }
        }

        /*==================================================
         * Limit & Offset
         *==================================================*/
        $limit = (isset($param['limit']) || !empty($param['limit']))?$param['limit']:$limit;
        $offset = (isset($param['offset']) || !empty($param['offset']))?$param['offset']:$offset;
        $query->order_by('SM.order', 'ASC');


        /*==================================================
         * Process Query
         *==================================================*/
        if(isset($pk)){
            $query->and_where('SM.id', '=', $pk);
            $data = $query->execute()->current();
        }else{
            $query->limit($limit)->offset($offset);
            $data = $query->execute()->as_array();
        }
        $total_data = count($data);

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => $total_data,
                    'data' => $data];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function insert record into table
     * Method POST
     * Table m_approval_menu
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('m_menu_id',__('Menu ID', [], 'Menu ID'),'required');

        if($validation->run()){
            //Detect type of menu
            $petition_type = 1;
            switch ($param['menu_type']) {
                case 'menu':
                    $petition_type = 1;
                    break;
                case 'payment':
                    $petition_type = 2;
                    break;
            }
            $current_enable_start_date = date('Y-m-d', strtotime($param['current_enable_start_date']));
            $enable_start_date = date('Y-m-d', strtotime($param['enable_start_date']));
            $m_menu_id = $param['m_menu_id'];
            $approval_data = json_decode($param['approval_data']);
            //=================== Update All Input Delete Before Save ================
            \DB::update('m_approval_menu')->set(['item_status' => 'delete',
                                                        'deleted_date' => date('Y-m-d H:i:s'),
                                                        'deleted_user_id' => \Auth::get('id')])
                                                    ->where('m_menu_id', '=', $m_menu_id)
                                                    ->and_where('petition_type', '=', $petition_type)
                                                    ->and_where('enable_start_date', '=', $current_enable_start_date)
                                                    ->execute();
            if(!empty($approval_data)){
                $order = 0;
                foreach ($approval_data as $value) {
                    $order++;
                    $udData = ['m_menu_id' => $m_menu_id,
                                'petition_type' => $petition_type,
                                'm_user_id' => $value->m_user_id,
                                'm_authority_id' => $value->m_authority_id,
                                'order' => $order,
                                'enable_start_date' => $enable_start_date,
                                'item_status' => 'active'
                                ];

                    $obj = !isset($value->id)?\Model_MApprovalMenu::forge():\Model_MApprovalMenu::find($value->id);
                    if(!empty($obj)){
                        $obj->set($udData)->save();
                    }
                }
            }

            /*==================================================
             * Update enable_end_date all route
             *==================================================*/
            $resultUpdate = \DB::select('id', 'm_menu_id', 'enable_start_date', 'enable_end_date')
                                ->from(['m_approval_menu', 'MAM'])
                                ->where('MAM.m_menu_id', '=', $m_menu_id)
                                ->and_where('MAM.item_status', '=', 'active')
                                ->order_by('MAM.enable_start_date', 'ASC')
                                ->group_by('MAM.enable_start_date')
                                ->execute()->as_array();

            if(!empty($resultUpdate)){
                foreach ($resultUpdate as $key => $val) {
                    $next_enable_start_date = isset($resultUpdate[$key+1])?$resultUpdate[$key+1]['enable_start_date']:null;

                    $enable_end_date = empty($next_enable_start_date)?null:date('Y-m-d', strtotime('-1 day', strtotime($next_enable_start_date)));
                    //=============== Update Record ===============
                    \DB::update('m_approval_menu')->set(['enable_end_date' => $enable_end_date])
                                                        ->and_where('m_menu_id', '=', $val['m_menu_id'])
                                                        ->and_where('enable_start_date', '=', $val['enable_start_date'])
                                                        ->execute();
                }
            }

            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => Exception::E_CREATE_SUCCESS,
                        'message' => Exception::getMessage(Exception::E_CREATE_SUCCESS),
                        'record_id' => 1];
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                        'error' => $validation->error_message()];
        }
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table m_approval_menu
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MApprovalMenu::softDelete($pk, array('item_status' => 'delete'));
            $status = 'success';
            $response_code = Exception::E_DELETE_SUCCESS;
            $response_message = Exception::getMessage(Exception::E_DELETE_SUCCESS);
            if(!$result){
                $status = 'error';
                $response_code = Exception::E_NO_RECORD;
                $response_message = Exception::getMessage(Exception::E_NO_RECORD);
            }
        }else{
            $status = 'error';
            $response_code = Exception::E_PK_MISS;
            $response_message = Exception::getMessage(Exception::E_PK_MISS);
        }
        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => $status,
                    'code' => $response_code,
                    'message' => $response_message,
                    'record_id' => $pk];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get routes of menu master
     * Method GET
     * Table m_approval_menu
     *=============================================================*/
    public function get_list_user_route(){
        $param          = \Input::param();
        $data = [];
        $petition_type = 1;

        if(isset($param['menu_type'])){
            switch ($param['menu_type']) {
                case 'menu':
                    $petition_type = 1;
                    break;
                case 'payment':
                    $petition_type = 2;
                    break;
            }
        }

        if(isset($param['m_menu_id']) && !empty($param['m_menu_id']) && isset($param['enable_start_date']) && !empty($param['enable_start_date'])){
            $enable_date = date('Y-m-d');
            $enable_start_date = date('Y-m-d', strtotime($param['enable_start_date']));
            $m_menu_id = $param['m_menu_id'];
            $query = \DB::select('MAM.id', 'MAM.m_user_id', 'MAM.enable_start_date', 'MAM.m_menu_id', 'MAM.petition_type', 'MAM.m_authority_id',
                                'MUD.m_position_id', \DB::expr('MP.name AS position_name'), 'MUD.m_department_id',
                                'MU.fullname', \DB::expr('DEP.name AS department_name'), \DB::expr('MUD.m_department_id AS department_id'),
                                \DB::expr('DIV.name AS division_name'), \DB::expr('BUS.name AS business_name'))
                            ->from(['m_approval_menu', 'MAM'])
                            ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'MAM.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('"0"'))
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'MUD.m_user_id')
                            ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                            ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')->on('DEP.level', '=', \DB::expr('"3"'))
                            ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')->on('DIV.level', '=', \DB::expr('"2"'))
                            ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr('"1"'))
                            ->where('MAM.m_menu_id', '=', $m_menu_id)->and_where('MAM.petition_type', '=', $petition_type)
                            ->and_where('MAM.item_status', '=', 'active')
                            ->and_where('MUD.item_status', '=', 'active')
                            ->and_where('MAM.enable_start_date', '=', $enable_start_date)
                            // ->and_where_open()
                            //     ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            //     ->or_where_open()
                            //         ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                            //         ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            //     ->or_where_close()
                            // ->and_where_close()
                            ->and_where('MU.item_status', '=', 'active')
                            ->and_where_open()
                                ->and_where('MU.retirement_date', '>=', $enable_date)
                                ->or_where('MU.retirement_date', 'IS', \DB::expr('NULL'))
                            ->and_where_close()
                            ->and_where_open()
                                ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                                ->or_where_open()
                                    ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                    ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                                ->or_where_close()
                            ->and_where_close()
                            ->group_by('MAM.id')
                            ->order_by('MAM.order', 'ASC');


            $data = $query->execute()->as_array();
        }
        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => count($data),
                    'data' => $data];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function export list approval department
     * Method get
     * Table m_approval_deparment, m_user
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_export_list_approval_menu(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/export/list_approval_menu?' . $build_query);
        $data['url'] = $url_download;

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Phan Ngoc Minh Luan
     * Function get list enable start date of route deparment
     * Method GET
     * Table m_approval_menu
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_route_enable_start_date(){
        $param          = \Input::param();
        $data         = [];

        /*=======================================
         * Get enable_start_date of route based on m_menu_id
         *=======================================*/
        if(isset($param['m_menu_id'])){
			switch (@$param['menu_type']) {
                case 'menu':
                    $petition_type = 1;
                    break;
                case 'payment':
                    $petition_type = 2;
                    break;
				default:
					$petition_type = 1;
					break;
            }

            $query = \DB::select('id', 'enable_start_date', 'enable_end_date')
                        ->from(['m_approval_menu', 'SM'])
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('SM.m_menu_id', '=', $param['m_menu_id'])
                        ->and_where('SM.petition_type', '=', $petition_type)
                        ->order_by('SM.enable_start_date', 'ASC')
                        ->group_by('SM.enable_start_date');
            $result = $query->execute()->as_array();

            if(!empty($result)){
                foreach ($result as $val) {
                    $enable_start_date = $val['enable_start_date'];
                    $enable_end_date = $val['enable_end_date'];
                    if(!empty($enable_end_date)){
                        $label = date(DISPLAY_DATE_FORMAT, strtotime($enable_start_date)) . ' - ' . date(DISPLAY_DATE_FORMAT, strtotime($enable_end_date));
                    }else{
                        $label = date(DISPLAY_DATE_FORMAT, strtotime($enable_start_date));
                    }
                    $data[$enable_start_date] = $label;
                }
            }
        }

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];
        return $this->response($response);
    }
}
