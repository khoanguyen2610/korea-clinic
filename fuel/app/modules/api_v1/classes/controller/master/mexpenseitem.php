<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:39:59
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:26
 */

namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MExpenseItem extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_expense_item';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_expense_item
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


            if(isset($param['has_obic_kashi']) && $param['has_obic_kashi']){
                $queryObicKashi = \DB::select()
                                        ->from(['m_obic_kashi', 'MOK'])
                                        ->where('MOK.m_expense_item_id', '=', $pk)
                                        ->and_where('MOK.item_status', '!=', 'delete')
                                        ->order_by('client_type', 'ASC');
                $dataObicKashi = $queryObicKashi->execute()->as_array();                         
                $data['obic_kashi'] = $dataObicKashi;
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
     * Table m_expense_item
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('type_code',__('Type Code', [], 'Type Code'),'required');
        $validation->add_field('item_name_code',__('Item Name Code', [], 'Item Name Code'),'required');
        $validation->add_field('item',__('Item', [], 'Item'),'required');
        //Validate Unique Data
        if(!empty($pk)){
            $validation->field('item_name_code',__('Item Name Code', [], 'Item Name Code'))->add_rule('unique', $this->main_table . '.id.item_name_code.'.$pk);
        }else{
            $validation->field('item_name_code',__('Item Name Code', [], 'Item Name Code'))->add_rule('unique', $this->main_table . '.id.item_name_code');
        }

        
        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;
                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $Item = empty($pk)?\Model_MExpenseItem::forge():\Model_MExpenseItem::find($pk);
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
                 * Stored data obic_kashi
                 * Table: m_obic_kshi
                 *==================================================*/
                if(!empty($param['obic_kashi'])){
                    $obic_kashi = json_decode($param['obic_kashi']);
                    if(!empty($obic_kashi)){
                        foreach ($obic_kashi as $value) {
                            $udData = ['m_expense_item_id' => $Item->id,
                                        'client_type' => isset($value->client_type)?$value->client_type:null,
                                        'bottom_amount' => isset($value->bottom_amount)?$value->bottom_amount:null,
                                        'upper_amount' => isset($value->upper_amount)?$value->upper_amount:null,
                                        'karikata_sokanjokamoku_cd' => isset($value->karikata_sokanjokamoku_cd)?$value->karikata_sokanjokamoku_cd:null,
                                        'karikata_hojokamoku_cd' => isset($value->karikata_hojokamoku_cd)?$value->karikata_hojokamoku_cd:null,
                                        'karikata_hojouchiwakekamoku_cd' => isset($value->karikata_hojouchiwakekamoku_cd)?$value->karikata_hojouchiwakekamoku_cd:null,
                                        'karikata_zei_kubun' => isset($value->karikata_zei_kubun)?$value->karikata_zei_kubun:null,
                                        'karikata_zeikomi_kubun' => isset($value->karikata_zeikomi_kubun)?$value->karikata_zeikomi_kubun:null,
                                        'memo' => isset($value->memo)?$value->memo:null,
                                        ]; 
                            $ObjUD = !isset($value->id)?\Model_MObicKashi::forge():\Model_MObicKashi::find($value->id);
                            if(!empty($ObjUD)){ 
                                $ObjUD->set($udData)->save();
                            }             
                        }
                    }

                }


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
     * Table m_expense_item
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MExpenseItem::softDelete($pk, array('item_status' => 'delete'));
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
     * Table m_company
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_MExpenseItem::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        // foreach($items as $k => $v){

        // }
        $response = ["sEcho" => intval(@$this->_arrParam['sEcho']),
                        "iTotalRecords" => $result['total'],
                        "iTotalDisplayRecords" => $result['total'],
                        "aaData" => $items
                        ];
        return $this->response($response);
    }
}