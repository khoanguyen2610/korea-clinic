<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:59:15
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-07-20 13:02:54
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MApprovalDepartmentMenu extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_approval_department_menu';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_approval_department_menu
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
     * Table m_approval_department_menu
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('business_id',__('Business ID', [], 'Business ID'),'required');
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
            $m_menu_id = $param['m_menu_id'];
            $approval_data = json_decode($param['approval_data']);
            $current_enable_start_date = date('Y-m-d', strtotime($param['current_enable_start_date']));
            $enable_start_date = date('Y-m-d', strtotime($param['enable_start_date']));

            $business_id = (isset($param['business_id']) && !empty($param['business_id']))?$param['business_id']:null;
            $division_id = (isset($param['division_id']) && !empty($param['division_id']))?$param['division_id']:null;
            $department_id = (isset($param['department_id']) && !empty($param['department_id']))?$param['department_id']:null;

            if($business_id && !$division_id && !$department_id){
                $m_department_id = $business_id;
            }else if($business_id && $division_id && !$department_id){
                $m_department_id = $division_id;
            }else if($business_id && $division_id && $department_id){
                $m_department_id = $department_id;
            }

            //=================== Update All Input Delete Before Save ================
            \DB::update('m_approval_department_menu')->set(['item_status' => 'delete',
                                                        'deleted_date' => date('Y-m-d H:i:s'),
                                                        'deleted_user_id' => \Auth::get('id')])
                                                    ->where('m_department_id', '=', $m_department_id)
                                                    ->and_where('m_menu_id', '=', $m_menu_id)
                                                    ->and_where('petition_type', '=', $petition_type)
                                                    ->and_where('enable_start_date', '=', $current_enable_start_date)
                                                    ->execute();
            if(!empty($approval_data)){
                $order = 0;
                foreach ($approval_data as $value) {
                    $order++;
                    $udData = ['m_department_id' => $m_department_id,
                                'm_menu_id' => $m_menu_id,
                                'petition_type' => $petition_type,
                                'm_user_id' => $value->m_user_id,
                                'm_authority_id' => $value->m_authority_id,
                                'order' => $order,
                                'enable_start_date' => $enable_start_date,
                                'item_status' => 'active'
                                ];

                    $obj = !isset($value->id)?\Model_MApprovalDepartmentMenu::forge():\Model_MApprovalDepartmentMenu::find($value->id);
                    if(!empty($obj)){
                        $obj->set($udData)->save();
                    }
                }
            }

            /*==================================================
             * Update enable_end_date all route
             *==================================================*/
            $resultUpdate = \DB::select('id', 'm_department_id', 'm_menu_id', 'enable_start_date', 'enable_end_date')
                                ->from(['m_approval_department_menu', 'MADM'])
                                ->where('MADM.m_department_id', '=', $m_department_id)
                                ->where('MADM.m_menu_id', '=', $m_menu_id)
                                ->and_where('MADM.item_status', '=', 'active')
                                ->order_by('MADM.enable_start_date', 'ASC')
                                ->group_by('MADM.enable_start_date')
                                ->execute()->as_array();

            if(!empty($resultUpdate)){
                foreach ($resultUpdate as $key => $val) {
                    $next_enable_start_date = isset($resultUpdate[$key+1])?$resultUpdate[$key+1]['enable_start_date']:null;

                    $enable_end_date = empty($next_enable_start_date)?null:date('Y-m-d', strtotime('-1 day', strtotime($next_enable_start_date)));
                    //=============== Update Record ===============
                    \DB::update('m_approval_department_menu')->set(['enable_end_date' => $enable_end_date])
                                                        ->where('m_department_id', '=', $val['m_department_id'])
                                                        ->and_where('m_menu_id', '=', $val['m_menu_id'])
                                                        ->and_where('enable_start_date', '=', $val['enable_start_date'])
                                                        ->execute();
                }
            }

            if(isset($obj) && !empty($obj)) {
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => Exception::E_CREATE_SUCCESS,
                            'message' => Exception::getMessage(Exception::E_CREATE_SUCCESS),
                            'record_id' => $obj->id];
            } else {
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_NO_RECORD,
                            'message' => Exception::getMessage(Exception::E_NO_RECORD),
                            'error' => $validation->error_message()];
            }

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
     * Function update record into table
     * Method PUT
     * Table m_approval_department_menu
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function put_index($pk = null){
        if(!empty($pk)){
            $param = \Input::param();
            $validation = \Validation::forge();
            $validation->add_callable('MyRules');
            $validation->add_field('m_department_id',__('Department ID', [], 'Department ID'),'required');
            $validation->add_field('m_menu_id',__('Menu ID', [], 'Menu ID'),'required');
            $validation->add_field('m_user_id',__('User ID', [], 'User ID'),'required');

            if($validation->run($param)){
                $arrData = [];
                foreach ($param as $key => $value) {
                	if(!in_array($key, $this->table_field)) continue;
                    $value = !empty($value)?$value:null;
                    $arrData[$key] = $value;
                }
                $arrData['id'] = $pk;
                //======================== Default Data =================
                $Item = \Model_MApprovalDepartmentMenu::find($pk);
                if($Item){
                    $Item->set($arrData)->save();
                    /*==================================================
                     * Response Data
                     *==================================================*/
                    $response = ['status' => 'success',
                                'code' => Exception::E_UPDATE_SUCCESS,
                                'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS),
                                'record_id' => $pk];
                }else{
                    /*==================================================
                     * Response Data
                     *==================================================*/
                    $response = ['status' => 'error',
                                'code' => Exception::E_NO_RECORD,
                                'message' => Exception::getMessage(Exception::E_NO_RECORD),
                                'record_id' => $pk];
                }
            }else{
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_VALIDATE_ERR,
                            'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                            'error' => $validation->error_message()];
            }
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_PK_MISS,
                        'message' => Exception::getMessage(Exception::E_PK_MISS)];
        }
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table m_approval_department_menu
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MApprovalDepartmentMenu::softDelete($pk, array('item_status' => 'delete'));
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
     * Table m_approval_department_menu
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

        $business_id = (isset($param['business_id']) && !empty($param['business_id']))?$param['business_id']:null;
        $division_id = (isset($param['division_id']) && !empty($param['division_id']))?$param['division_id']:null;
        $department_id = (isset($param['department_id']) && !empty($param['department_id']))?$param['department_id']:null;

        if(isset($param['m_menu_id']) && !empty($param['m_menu_id']) && !empty($business_id) && isset($param['enable_start_date']) && !empty($param['enable_start_date'])){
            $enable_start_date = date('Y-m-d', strtotime($param['enable_start_date']));
            $enable_date = date('Y-m-d');
            $m_menu_id = $param['m_menu_id'];
            $query = \DB::select('MADM.id', 'MADM.m_user_id', 'MADM.enable_start_date', 'MADM.m_menu_id', 'MADM.petition_type', 'MADM.m_authority_id',
                                'MUD.m_position_id', \DB::expr('MP.name AS position_name'), 'MUD.m_department_id',
                                'MU.fullname', \DB::expr('DEP.name AS department_name'),
                                \DB::expr('DIV.name AS division_name'), \DB::expr('BUS.name AS business_name'))
                            ->from(['m_approval_department_menu', 'MADM'])
                            ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'MADM.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('"0"'))
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'MUD.m_user_id')
                            ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                            ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')->on('DEP.level', '=', \DB::expr('"3"'))
                            ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')->on('DIV.level', '=', \DB::expr('"2"'))
                            ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr('"1"'))
                            ->where('MADM.m_menu_id', '=', $m_menu_id)->and_where('MADM.petition_type', '=', $petition_type)
                            ->and_where('MADM.item_status', '=', 'active')
                            ->and_where('MUD.item_status', '=', 'active')
                            ->and_where('MADM.enable_start_date', '=', $enable_start_date)
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
                            ->group_by('MADM.id')
                            ->order_by('MADM.order', 'ASC');

            if($business_id && !$division_id && !$department_id){
                $query->and_where('MADM.m_department_id', '=', $business_id);
            }else if($business_id && $division_id && !$department_id){
                $query->and_where('MADM.m_department_id', '=', $division_id);
            }else if($business_id && $division_id && $department_id){
                $query->and_where('MADM.m_department_id', '=', $department_id);
            }


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
    public function get_export_list_approval_department_menu(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/export/list_approval_department_menu?' . $build_query);
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
     * Table m_approval_department_menu
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_route_enable_start_date(){
        $param          = \Input::param();
        $data         = [];

        /*=======================================
         * Get enable_start_date of route based on m_department_id
         *=======================================*/
        if(isset($param['m_department_id']) && isset($param['m_menu_id'])){

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
                        ->from(['m_approval_department_menu', 'SM'])
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('SM.m_department_id', '=', $param['m_department_id'])
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
