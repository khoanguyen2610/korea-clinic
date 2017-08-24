<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */


namespace Api_v1;
use \Controller\Exception;
    
class Controller_GroupRole extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'vsvn_group_role';
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of vsvn_group_role
     * Method GET
     * Table vsvn_group_role
     * Field filter ['group_id', 'role_id']
     * Single data | array
     * Where condition "= $1" 
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_index(){
        $param          = \Input::param();
        $field_filters  = ['group_id', 'role_id'];
        $condition      = [];
        $limit          = 5000;
        $offset         = 0;

        $select         = ['*'];
        /*==================================================
         * Filter Data
         *==================================================*/
        foreach ($field_filters as $field) {
            if(isset($param[$field]) || !empty($param[$field])){
                if(is_array($param[$field])){
                    $condition = array_merge($condition, [[$field, 'IN', $param[$field]]]);
                }else{
                    $condition = array_merge($condition, [[$field, '=', $param[$field]]]);
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
        $query = \Model_VsvnGroupRole::query()->select($select);
        !empty($condition) && $query->where($condition);
        $total_data = $query->count();
        $data = $query->limit($limit)->offset($offset)->get();
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
     * Table vsvn_group_role
     * Field contain data ['group_id', 'role_id']
     * group_id|role_id have to require
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('group_id',__('Group ID', [], 'Group ID'),'required');
        $validation->add_field('role_id', __('Role ID', [], 'Role ID'),'required');
        if($validation->run()){
            $searchValue = \Model_VsvnGroupRole::find([$param['group_id'], $param['role_id']]);
            if(!empty($searchValue)){
                $response = ['status' => 'error',
                            'code' => Exception::E_VALIDATE_ERR,
                            'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                            'error' => [Exception::getMessage(Exception::E_EXISTED_ERR)]];
            }else{
                $arrData = [];
                foreach ($param as $key => $value) {
                    $value = !empty($value)?$value:null;
                    $arrData[$key] = $value;
                }
                //======================== Default Data =================
                $obj = \Model_VsvnGroupRole::forge()->set($arrData);
                $obj->save();
                
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => Exception::E_CREATE_SUCCESS,
                            'message' => Exception::getMessage(Exception::E_CREATE_SUCCESS),
                            'record_id' => ['group_id' => $obj->group_id, 'role_id' => $obj->role_id]];
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
     * Drop record
     * Method DELETE
     * Table vsvn_group_role
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($group_id = null, $role_id = null){
        $param = \Input::param();
        $group_id = isset($param['group_id'])?$param['group_id']:$group_id;
        $role_id = isset($param['role_id'])?$param['role_id']:$role_id;
        if(!empty($group_id) && !empty($role_id)){
            $result = \Model_VsvnGroupRole::find([$group_id, $role_id]);
            if($result){
                $result->delete();
                $status = 'success';
                $response_code = Exception::E_DELETE_SUCCESS;
                $response_message = Exception::getMessage(Exception::E_DELETE_SUCCESS);
            }else{
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
                    'record_id' => ['group_id' => $group_id, 'role' => $role_id]];
        return $this->response($response);
    }
}