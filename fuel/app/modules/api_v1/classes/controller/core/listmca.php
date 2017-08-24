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
    
class Controller_ListMCA extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'vsvn_list_mca';
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of vsvn_list_mca
     * Method GET
     * Table vsvn_list_mca
     * Field filter ['id', 'name', 'type', 'parent']
     * Single data | array
     * Where condition "LIKE %$1%" 
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_index($pk = null){
        $param          = \Input::param();
        $field_filters  = ['id', 'name', 'type', 'parent'];
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
                    $condition = array_merge($condition, [[$field, 'LIKE', '%' . $param[$field] . '%']]);
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
            $condition = array_merge($condition, ['id' => $pk]);
            $data = \Model_VsvnListMca::find('first', ['select' => $select, 'where' => $condition]);
            $total_data = count($data);
        }else{
            $query = \Model_VsvnListMca::query()->select($select);
            !empty($condition) && $query->where($condition);
            $total_data = $query->count();
            $data = $query->limit($limit)->offset($offset)->group_by('id')->get();
        }

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
     * Table vsvn_list_mca
     * Field contain data ['name', 'type', 'parent']
     * name|type|parent have to require
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('name',__('Name', [], 'Name'),'required');
        $validation->add_field('type', __('Type', [], 'Type'),'required'); 
        $validation->add_field('parent', __('Parent', [], 'Parent'),'required'); 
        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
                $value = !empty($value)?$value:null;
                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $obj = \Model_VsvnListMca::forge()->set($arrData);
            $obj->save();
            
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => Exception::E_CREATE_SUCCESS,
                        'message' => Exception::getMessage(Exception::E_CREATE_SUCCESS),
                        'record_id' => $obj->id];
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
     * Table vsvn_list_mca
     * Field contain data ['name', 'type', 'parent']
     * name|type|parent have to require
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function put_index($pk = null){
        if(!empty($pk)){
            $param = \Input::param();
            $validation = \Validation::forge();
            $validation->add_callable('MyRules');
            $validation->add_field('name',__('Name', [], 'Name'),'required');
            $validation->add_field('type', __('Type', [], 'Type'),'required'); 
            $validation->add_field('parent', __('Parent', [], 'Parent'),'required'); 
            if($validation->run($param)){
                $arrData = [];
                foreach ($param as $key => $value) {
                    $value = !empty($value)?$value:null;
                    $arrData[$key] = $value;
                }
                $arrData['id'] = $pk;
                //======================== Default Data =================
                $Item = \Model_VsvnListMca::find($pk);
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
     * Drop record
     * Method DELETE
     * Table vsvn_list_mca
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_VsvnListMca::find($pk);
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
                    'record_id' => $pk];
        return $this->response($response);
    }
}