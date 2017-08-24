<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:57:41
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:32
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MApprovalDepartment extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_approval_department';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_approval_department
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
     * Table m_approval_department
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('m_department_id',__('Department ID', [], 'Department ID'),'required');

        if($validation->run()){
            $approval_data = json_decode($param['approval_data']);
            $m_department_id = $param['m_department_id'];
            $current_enable_start_date = date('Y-m-d', strtotime($param['current_enable_start_date']));
            $enable_start_date = date('Y-m-d', strtotime($param['enable_start_date']));
            
            //=================== Update All Input Delete Before Save ================
            \DB::update('m_approval_department')->set(['item_status' => 'delete',
                                                        'deleted_date' => date('Y-m-d H:i:s'),
                                                        'deleted_user_id' => \Auth::get('id')])
                                                    ->where('m_department_id', '=', $m_department_id)
                                                    ->and_where('enable_start_date', '=', $current_enable_start_date)
                                                    ->execute();

            if(!empty($approval_data)){
                $order = 0;
                foreach ($approval_data as $value) {
                    $order++;
                    $udData = ['m_department_id' => $m_department_id,
                                'm_user_id' => $value->m_user_id,
                                'order' => $order,
                                'enable_start_date' => $enable_start_date,
                                'item_status' => 'active'
                                ]; 
                    $ObjUD = !isset($value->id)?\Model_MApprovalDepartment::forge():\Model_MApprovalDepartment::find($value->id);
                    if(!empty($ObjUD)){ 
                        $ObjUD->set($udData)->save();
                        $arrKeepIds[] = $ObjUD->id;
                    }             
                }
            }

            /*==================================================
             * Update enable_end_date all route
             *==================================================*/
            $resultUpdate = \DB::select('id', 'm_department_id', 'enable_start_date', 'enable_end_date')
                                ->from(['m_approval_department', 'MAD'])
                                ->where('MAD.m_department_id', '=', $m_department_id)
                                ->and_where('MAD.item_status', '=', 'active')
                                ->order_by('MAD.enable_start_date', 'ASC')
                                ->group_by('MAD.enable_start_date')
                                ->execute()->as_array();
     
            if(!empty($resultUpdate)){
                foreach ($resultUpdate as $key => $val) {
                    $next_enable_start_date = isset($resultUpdate[$key+1])?$resultUpdate[$key+1]['enable_start_date']:null;

                    $enable_end_date = empty($next_enable_start_date)?null:date('Y-m-d', strtotime('-1 day', strtotime($next_enable_start_date)));
                    //=============== Update Record ===============
                    \DB::update('m_approval_department')->set(['enable_end_date' => $enable_end_date])
                                                        ->where('m_department_id', '=', $val['m_department_id'])
                                                        ->and_where('enable_start_date', '=', $val['enable_start_date'])
                                                        ->execute();
                }
            }
            
            $response = ['status' => 'success',
                            'code' => Exception::E_UPDATE_SUCCESS,
                            'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS)];
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
     * Table m_approval_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MApprovalDepartment::softDelete($pk, array('item_status' => 'delete'));
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
     * Function get list enable start date of route deparment
     * Method GET
     * Table m_approval_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_route_enable_start_date(){
        $param          = \Input::param();
        $data         = [];
        
        /*=======================================
         * Get enable_start_date of route based on m_department_id
         *=======================================*/
        if(isset($param['m_department_id'])){
            $query = \DB::select('id', 'enable_start_date', 'enable_end_date')
                        ->from(['m_approval_department', 'SM'])
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('SM.m_department_id', '=', $param['m_department_id'])
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


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get list enable start date of route deparment
     * Method GET
     * Table m_approval_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_user_route(){
        $param          = \Input::param();
        $result         = [];
        
        /*=======================================
         * Get enable_start_date of route based on m_department_id
         *=======================================*/
        if(isset($param['m_department_id']) && isset($param['enable_start_date']) && !empty($param['enable_start_date'])){
            $enable_start_date = date('Y-m-d', strtotime($param['enable_start_date']));
            $query = \DB::select('SM.id', 'SM.m_department_id', 'SM.m_user_id', 'SM.enable_start_date', 'SM.enable_end_date', 'MU.fullname', 'SM.order')
                            ->from(['m_approval_department', 'SM'])
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                            ->where('SM.item_status', '=', 'active')
                            ->and_where('SM.m_department_id', '=', $param['m_department_id'])
                            ->and_where('SM.enable_start_date', '=', $enable_start_date)
                            ->order_by('order', 'ASC');
            $result = $query->execute()->as_array();
            if(!empty($result)){
                foreach ($result as $key => $value) {
                    $mainDepartment = \Model_MUserDepartment::getCurrentDepartment($value['m_user_id']);
                    $result[$key]['m_position_id'] = $mainDepartment['m_position_id'];
                    $result[$key]['position_name'] = $mainDepartment['position_name'];
                    $result[$key]['department_id'] = $mainDepartment['department_id'];
                    $result[$key]['department_name'] = $mainDepartment['department_name'];
                    $result[$key]['division_id'] = $mainDepartment['division_id'];
                    $result[$key]['division_name'] = $mainDepartment['division_name'];
                    $result[$key]['business_id'] = $mainDepartment['business_id'];
                    $result[$key]['business_name'] = $mainDepartment['business_name'];
                }
            }
        }

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $result];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function export list approval department
     * Method get
     * Table m_approval_deparment, m_user
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_export_list_approval_department(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/export/list_approval_department?' . $build_query);
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

