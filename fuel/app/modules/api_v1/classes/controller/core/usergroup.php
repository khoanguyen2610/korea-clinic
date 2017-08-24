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
    
class Controller_UserGroup extends \Controller_API {
    public function before() {
        parent::before();
        $this->main_table = 'vsvn_user_group';
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of vsvn_user_group
     * Method GET
     * Table vsvn_user_group
     * Field filter ['user_id', 'group_id']
     * Single data | array
     * Where condition "= $1" 
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_index($pk = null){
        $param          = \Input::param();
        $field_filters  = ['id', 'user_id', 'group_id'];
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
        $query = \Model_VsvnUserGroup::query()->select($select);
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
     * Table vsvn_user_group
     * Field contain data ['user_id', 'group_id']
     * user_id|group_id have to require
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('user_id', __('User ID', [], 'User ID'),'required'); 
        $validation->add_field('group_id',__('Group ID', [], 'Group ID'),'required');
        if($validation->run()){
            $searchValue = \Model_VsvnUserGroup::find([$param['user_id'], $param['group_id']]);
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
                $obj = \Model_VsvnUserGroup::forge()->set($arrData);
                $obj->save();
                
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => Exception::E_CREATE_SUCCESS,
                            'message' => Exception::getMessage(Exception::E_CREATE_SUCCESS),
                            'record_id' => ['user_id' => $obj->user_id, 'group_id' => $obj->group_id]];
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
     * Table vsvn_user_group
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($user_id = null, $group_id = null){
        $param = \Input::param();
        $user_id = isset($param['user_id'])?$param['user_id']:$user_id;
        $group_id = isset($param['group_id'])?$param['group_id']:$group_id;
        if(!empty($user_id) && !empty($group_id)){
            $result = \Model_VsvnUserGroup::find([$user_id, $group_id]);
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
                    'record_id' => ['user_id' => $user_id, 'group_id' => $group_id]];
        return $this->response($response);
    }

}