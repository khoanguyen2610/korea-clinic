<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 10:40:56
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-07-20 13:01:10
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MUser extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_user';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_user
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

            if(isset($param['has_user_department']) && $param['has_user_department']){
                $queryUserDepartment = \DB::select('MUD.id', 'MUD.staff_no', 'MUD.fullname', 'MUD.fullname_kana', 'MUD.concurrent_post_flag', 'MUD.enable_start_date', 'MUD.enable_end_date',
                                        'MUD.m_position_id', \DB::expr('MP.name AS position_name'),
                                        'MUD.m_department_id', \DB::expr('DEP.name AS department_name'), \DB::expr('CONCAT(DEP.sub_code, " - ", DEP.name) AS department_name_code'),
                                        \DB::expr('DIV.id AS division_id'), \DB::expr('DIV.name AS division_name'), \DB::expr('CONCAT(DIV.code, " - ", DIV.name) AS division_name_code'),
                                        \DB::expr('BUS.id AS business_id'), \DB::expr('BUS.name AS business_name'), \DB::expr('CONCAT(BUS.code, " - ", BUS.name) AS business_name_code'),
                                        'BUS.m_company_id', \DB::expr('MC.name AS company_name'))
                                        ->from(['m_user_department', 'MUD'])
                                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                                        ->join(['m_company', 'MC'], 'left')->on('MC.id', '=', 'BUS.m_company_id')
                                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                                        ->where('MUD.m_user_id', '=', $pk)
                                        ->and_where('MUD.item_status', '!=', 'delete')
                                        ->order_by('MUD.concurrent_post_flag', 'ASC')
                                        ->order_by('MUD.enable_start_date', 'ASC');
                $dataUserDepartment = $queryUserDepartment->execute()->as_array();
                $data['user_department'] = $dataUserDepartment;
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
     * Table m_user
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('user_id',__('User ID', [], 'User ID'),'required');
        $validation->add_field('staff_no',__('Staff No', [], 'Staff No'),'required');
        $validation->add_field('fullname',__('Full Name', [], 'Full Name'),'required');


        //Validate Unique Data
        if(!empty($pk)){
            $validation->field('user_id',__('User ID', [], 'User ID'))->add_rule('unique', $this->main_table . '.id.user_id.'.$pk);
            $validation->field('staff_no',__('Staff No', [], 'Staff No'))->add_rule('unique', $this->main_table . '.id.staff_no.'.$pk);
            if(!empty($param['email']))
                $validation->add_field('email',__('Email', [], 'Email'), 'required')->add_rule('unique', $this->main_table . '.id.email.'.$pk);
        }else{
            $validation->field('user_id',__('User ID', [], 'User ID'))->add_rule('unique', $this->main_table . '.id.user_id');
            $validation->field('staff_no',__('Staff No', [], 'Staff No'))->add_rule('unique', $this->main_table . '.id.staff_no');
        }


        if($validation->run() && !empty($param['user_department'])){
            $arrData = [];
            foreach ($param as $key => $value) {
                if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;

                switch ($key) {
                    case 'entry_date':
                    case 'retirement_date':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d', strtotime($value)):null;
                        break;
                }

                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $Item = empty($pk)?\Model_MUser::forge():\Model_MUser::find($pk);
            if(!empty($pk) && empty($Item)){
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_NO_RECORD,
                            'message' => Exception::getMessage(Exception::E_NO_RECORD),
                            'record_id' => $pk];
            }else{
                if(empty($pk)){
                    $arrData['password'] = \Auth::hash_password(DEFAULT_USER_PASSWORD);
                }
                !empty($pk) && $arrData['id'] = $pk;
                $Item->set($arrData)->save();

                /*==================================================
                 * Stored data user_department
                 * Table: m_user_department
                 *==================================================*/
                if(!empty($param['user_department'])){
                    $user_department = json_decode($param['user_department']);
                    $arrKeepIds = [];
                    if(!empty($user_department)){
                        //=================== Update All Input Delete Before Save ================
                        \DB::update('m_user_department')->set(['item_status' => 'delete',
                                                            'deleted_date' => date('Y-m-d H:i:s'),
                                                            'deleted_user_id' => \Auth::get('id')])
                                                        ->where('m_user_id', '=', $Item->id)
                                                        ->execute();
                        foreach ($user_department as $value) {
                            $enable_start_date = (!is_null($value->enable_start_date) && $value->enable_start_date != '')?date('Y-m-d', strtotime($value->enable_start_date)):null;
                            $enable_end_date = (!is_null($value->enable_end_date) && $value->enable_end_date != '')?date('Y-m-d', strtotime($value->enable_end_date)):null;

                            $concurrent_post_flag = $value->concurrent_post_flag;
                            if($concurrent_post_flag == null){
                                $concurrent_post_flag = 0;
                            }
                            $udData = ['m_user_id' => $Item->id,
                                        'fullname' => $value->fullname,
                                        'fullname_kana' => $value->fullname_kana,
                                        'staff_no' => $value->staff_no,
                                        'm_department_id' => $value->m_department_id,
                                        'm_position_id' => $value->m_position_id,
                                        'concurrent_post_flag' => $concurrent_post_flag,
                                        'enable_start_date' => $enable_start_date,
                                        'enable_end_date' => $enable_end_date,
                                        'item_status' => 'active'
                                        ];
                            $ObjUD = !isset($value->id)?\Model_MUserDepartment::forge():\Model_MUserDepartment::find($value->id);
                            if(!empty($ObjUD)){
                                $ObjUD->set($udData)->save();
                                $arrKeepIds[] = $ObjUD->id;
                            }
                        }
                    }
                }

                /*==================================================
                 * Update user info base on user department
                 *==================================================*/
                $arrParam = [];
                $arrParam['arr_user_id'] = [$Item->id];
                \Model_MUser::updateInfoUserBaseUserDepartment($arrParam);

                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => !empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS,
                            'message' => Exception::getMessage(!empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS),
                            'record_id' => $Item->id];
            }
        }else{
            $error = $validation->error_message();
            if(empty($param['user_department'])){
                $error = ['user_department' => 'User department required and must contain a value.'];
            }
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                        'error' => $error];


        }
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table m_user
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MUser::softDelete($pk, array('item_status' => 'delete'));
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
     * Table m_user
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $param = \Input::param();
        if(isset($param['has_invisible_data']) && $param['has_invisible_data']){
            $result['total'] = 0;
            $items = [];
        }else{
            $result     = \Model_MUser::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
            $items      = $result['data'];
            foreach($items as $k => $v){

            }
        }
        $response = ["sEcho" => intval(@$this->_arrParam['sEcho']),
                    "iTotalRecords" => $result['total'],
                    "iTotalDisplayRecords" => $result['total'],
                    "aaData" => $items
                    ];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function process user department
     * Method POST
     * Table m_user, m_user_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function post_process_user_department(){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $request_body   = file_get_contents('php://input');
        $obj            = json_decode($request_body);
        $data           = \Model_MUserDepartment::processUserDepartment($obj);

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
     * Author: Nguyen Anh Khoa
     * Function export list user
     * Method get
     * Table m_user, m_user_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_export_list_user(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/export/list_user?' . $build_query);
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
}
