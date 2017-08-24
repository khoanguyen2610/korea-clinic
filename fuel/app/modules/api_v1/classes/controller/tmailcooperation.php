<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:13
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_TMailCooperation extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_mail_cooperation';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table t_mail_cooperation
     * Single data | array
     * Where condition "LIKE %$1%" 
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_index($pk = null){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $limit          = 5000;
        $offset         = 0;
        $enable_date    = isset($param['enable_date']) && !empty($param['enable_date'])?$param['enable_date']:date('Y-m-d');

        $select         = ['SM.*', 'MU.staff_no', 'MU.fullname', \DB::expr('MC.id AS company_id'), \DB::expr('MC.name AS company_name'), 
                            \DB::expr('BUS.id AS business_id'), \DB::expr('BUS.name AS business_name'), 
                            \DB::expr('DIV.id AS division_id'), \DB::expr('DIV.name AS division_name'), 
                            \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), 
                            \DB::expr('MP.id AS position_id'), \DB::expr('MP.name AS position_name'), 
                            \DB::expr('MAS.name AS approval_status_name'), 
                            \DB::expr('MM.name AS menu_name'), \DB::expr('MRM.name AS menu_request_name')];
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


        $query->where('SM.item_status', '!=', 'delete')
                ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('0'))
                ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                ->join(['m_company', 'MC'], 'left')->on('MC.id', '=', 'BUS.m_company_id')
                ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                ->join(['m_approval_status', 'MAS'], 'left')->on('MAS.id', '=', 'SM.m_approval_status_id')
                ->join(['m_menu', 'MM'], 'left')->on('MM.id', '=', 'SM.m_menu_id')->on('SM.petition_type', '=', \DB::expr('1'))
                ->join(['m_request_menu', 'MRM'], 'left')->on('MRM.id', '=', 'SM.m_menu_id')->on('SM.petition_type', '=', \DB::expr('2'))
                ->where('SM.item_status', '!=', 'delete')
                ->and_where('MUD.item_status', '=', 'active')
                ->and_where_open()
                    ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                    ->or_where_open()
                        ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                        ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                    ->or_where_close()
                ->and_where_close()
                ->group_by('SM.id');

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
            if(!empty($data)){
                if($data['petition_type'] == 1){
                    $data['menu_petition_id'] = 'menu_' . $data['m_menu_id'];
                }elseif($data['petition_type'] == 2){
                    $data['menu_petition_id'] = 'payment_' . $data['m_menu_id'];
                }
            }
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
     * Table t_mail_cooperation
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('m_menu_id',__('Menu ID', [], 'Menu ID'),'required');
        $validation->add_field('m_user_id',__('User ID', [], 'User ID'),'required');
        $validation->add_field('m_approval_status_id',__('Approval Status ID', [], 'Approval Status ID'),'required');
        
        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;
                $arrData[$key] = $value;
            }
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
            $arrData['petition_type'] = $petition_type;

            //======================== Default Data =================
            $Item = empty($pk)?\Model_TMailCooperation::forge():\Model_TMailCooperation::find($pk);
            if(!empty($pk) && empty($Item)){
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_NO_RECORD,
                            'message' => Exception::getMessage(Exception::E_NO_RECORD),
                            'record_id' => $pk];
            }else{
                !empty($pk) && $arrData['id'] = $pk;
                $Item->set($arrData)->save();
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => !empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS,
                            'message' => Exception::getMessage(!empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS),
                            'record_id' => $Item->id];
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
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table t_mail_cooperation
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_TMailCooperation::softDelete($pk, array('item_status' => 'delete'));
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
     * Function get data for datatable
     * Method GET
     * Table t_mail_cooperation
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_TMailCooperation::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            // $items[$k]['staff_no'] = 'staffno';
            // $items[$k]['fullname'] = 'fullname';
            // $items[$k]['company_name'] = 'company_name';
            // $items[$k]['business_name'] = 'business_name';
            // $items[$k]['division_name'] = 'division_name';
            // $items[$k]['department_name'] = 'department_name';
            // $items[$k]['position_name'] = 'position_name';
            // $items[$k]['menu_name'] = 'menu_name';
            // $items[$k]['approval_status_name'] = 'approval_status_name';
            // $items[$k]['to_mail'] = 'to_mail';
        }
        $response = ["sEcho" => intval(@$this->_arrParam['sEcho']),
                    "iTotalRecords" => $result['total'],
                    "iTotalDisplayRecords" => $result['total'],
                    "aaData" => $items
                    ];
        return $this->response($response);
    }
}