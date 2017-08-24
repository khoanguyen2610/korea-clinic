<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:26:44
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:22
 */

namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MPosition extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_position';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_position
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
     * Table m_position
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('name',__('Name', [], 'Name'),'required');
        
        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = !empty($value)?$value:null;
                $key == 'parent'?($value = !empty($value)?(int)$value:0):null;
                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $obj = \Model_MPosition::forge()->set($arrData);
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
     * Table m_position
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function put_index($pk = null){
        if(!empty($pk)){
            $param = \Input::param();
            $validation = \Validation::forge();
            $validation->add_callable('MyRules');
            $validation->add_field('name',__('Name', [], 'Name'),'required');

            if($validation->run($param)){
                $arrData = [];
                foreach ($param as $key => $value) {
                	if(!in_array($key, $this->table_field)) continue;
                    $value = !empty($value)?$value:null;
                    $key == 'parent'?($value = !empty($value)?(int)$value:0):null;
                    $arrData[$key] = $value;
                }
                $arrData['id'] = $pk;
                //======================== Default Data =================
                $Item = \Model_MPosition::find($pk);
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
     * Table m_position
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MPosition::softDelete($pk, array('item_status' => 'delete'));
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
     * Function get basic data of group
     * Method GET
     * Table m_position
     * Return array data
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_limit_approval_form(){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $condition      = [];

        // $select         = ['id', 'code', 'name'];
        // $condition = array_merge($condition, [['id', 'IN', ['5', '7', '11' , '12']]]);
        // $data = \Model_MPosition::find('all', ['select' => $select, 'where' => $condition]);
        // $total_data = count($data);

        $query = \DB::select('id', 'code', 'name')
                     ->from([$this->main_table, 'SM'])
                     ->where('id', 'IN', ['5', '7', '11' , '12']);

        $data = $query->execute()->as_array();
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
}