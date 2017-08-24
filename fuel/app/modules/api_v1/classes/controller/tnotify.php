<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:12
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_TNotify extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_notify';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table t_notify
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
     * Table t_notify
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('title',__('Title', [], 'Title'),'required');
        
        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;

                switch ($key) {
                    case 'date':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d', strtotime($value)):null;
                        break;
                }

                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $Item = empty($pk)?\Model_TNotify::forge():\Model_TNotify::find($pk);
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
     * Table t_notify
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_TNotify::softDelete($pk, array('item_status' => 'delete'));
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
     * Table t_notify
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_TNotify::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            $content_dtb_output = strip_tags($v['content']);
            $items[$k]['content_dtb_output'] = !empty($content_dtb_output)?mb_substr($content_dtb_output, 0, 100) . '...':null;
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
     * Function get newest notify
     * Method GET
     * Table t_notify
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_newest_notify(){
        $param          = \Input::param();
        $query = \DB::select()
                    ->from(['t_notify', 'TN'])
                    ->where('TN.item_status', '=', 'active')
                    ->and_where('TN.release_flg', '=', 1)
                    ->order_by('TN.date', 'DESC')
                    ->limit(1)
                    ;
        $data = $query->execute()->current();
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
}