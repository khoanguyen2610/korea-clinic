<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:26:44
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-04-28 14:23:19
 */

namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MDepartment extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_department';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_department
     * Single data | array
     * Where condition "LIKE %$1%" 
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_index($pk = null){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $limit          = 5000;
        $offset         = 0;

        $select         = ['SM.*', 'MOCD.client_code'];
        $query = \DB::select_array($select)
                         ->from([$this->main_table, 'SM'])
                         ->join(['m_obic_client_department', 'MOCD'], 'LEFT')->on('MOCD.m_department_id', '=', 'SM.id')->on('MOCD.item_status', '=', \DB::expr('"active"'));
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

        /*=====================================================
         * Get List Department Has Menu Master
         *=====================================================*/
        if(isset($param['has_department_show_code']) && $param['has_department_show_code'] == true){
            $query->select(\DB::expr('CONCAT(DIV.name, " - ", SM.name, " - ", SM.code) as department_name_has_code'))
                    ->join([$this->main_table, 'DIV'], 'left')->on('DIV.id', '=', 'SM.parent')->on('DIV.level', '=', \DB::expr('2'));
        }


        /*=====================================================
         * Get List Department Has Menu Master
         *=====================================================*/
        if(isset($param['has_menu_master']) && $param['has_menu_master'] == true){
            $query->join(['m_menu', 'MM'], 'left')->on('MM.m_department_id', '=', 'SM.id')
                    ->and_where('MM.id', '<>', '')
                    ->group_by('SM.id');
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
     * Function insert record into table | update record based on $pk
     * Method POST
     * Table m_department
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('name',__('Name', [], 'Name'),'required');
        
        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;
                $key == 'parent'?($value = !empty($value)?(int)$value:0):null;

                /*=========================
                 * Format Date Type
                 *=========================*/
                switch ($key) {
                    case 'enable_start_date':
                    case 'enable_end_date':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d', strtotime($value)):null;
                    break;
                }

                $arrData[$key] = $value;

                if($param['level'] == 2 && !empty($param['business_id'])){
                    $arrData['parent'] = $param['business_id'];
                }else if($param['level'] == 3 && !empty($param['division_id'])){
                    $arrData['parent'] = $param['division_id'];
                }

                //Default value allow_export_routes if level != 3
                if($param['level'] != 3) $arrData['allow_export_routes'] = 1;
            }       
            
            //======================== Default Data =================
            $Item = empty($pk)?\Model_MDepartment::forge():\Model_MDepartment::find($pk);

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

                //Generate sub_code for department - level = 3
                if(empty($pk) && $arrData['level'] == 3){
                    $result_sub_code = \Model_MDepartment::find('first', ['where'=>['code' =>$arrData['code']], 'order_by' => ['sub_code' => 'DESC']]);
                    if(empty($result_sub_code)){
                        $sub_code = $arrData['code'] . '01';
                    }else{
                        $sub_code = intval($result_sub_code->sub_code) + 1;
                    }
                    $arrData['sub_code'] = $sub_code;
                }
                $Item->set($arrData)->save();

                //Insert || Update record table m_obic_client_department
                if($arrData['level'] == 3){
                    $objClientDepartment = \Model_MObicClientDepartment::find('first', ['where' => ['m_department_id' => $Item->id, 'item_status' => 'active']]);
                    if(!empty($objClientDepartment) && !empty($param['client_code'])){
                        $objClientDepartment->set(['client_code' => $param['client_code']])->save();
                    }else if(!empty($objClientDepartment) && empty($param['client_code'])){
                        \Model_MObicClientDepartment::softDelete($objClientDepartment->id, array('item_status' => 'delete'));
                    }if(empty($objClientDepartment) && !empty($param['client_code'])){
                        \Model_MObicClientDepartment::forge()->set(['m_department_id' => $Item->id,
                                                                    'client_code' => $param['client_code']])->save();
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
     * Table m_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MDepartment::softDelete($pk, array('item_status' => 'delete'));
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
     * Table m_menu
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_MDepartment::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            $items[$k]['business_name_dtb_output'] = "<a href=\"#\" data-id=\"{$v['business_id']}\" id=\"btn_edit\" >{$v['business_name']}</a>";
            $items[$k]['division_name_dtb_output'] = "<a href=\"#\" data-id=\"{$v['division_id']}\" id=\"btn_edit\" >{$v['division_name']}</a>";
            $items[$k]['name_dtb_output'] = "<a href=\"#\" data-id=\"{$v['id']}\" id=\"btn_edit\" >{$v['name']}</a>";
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
     * Function list department build into selectbox
     * Method GET
     * Table m_department
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_list_option(){
        $param          = \Input::param();
        $enable_date = date('Y-m-d');
        $m_company_id = $business_id = $division_id = $department_id = null;
        //Set ID data responese
        isset($param['m_company_id']) && !empty($param['m_company_id']) && $m_company_id = $param['m_company_id'];
        isset($param['business_id']) && !empty($param['business_id']) && $business_id = $param['business_id'];
        isset($param['division_id']) && !empty($param['division_id']) && $division_id = $param['division_id'];
        isset($param['department_id']) && !empty($param['department_id']) && $department_id = $param['department_id'];

        /*=====================================
         * Get List Department
         * Department Level = 3
         *=====================================*/
        $query = \DB::select('SM.id', 'SM.name', 'SM.code', 'SM.parent', \DB::expr('DIV.name AS division_name'))
                     ->from([$this->main_table, 'SM'])
                     ->join([$this->main_table, 'DIV'], 'left')->on('SM.parent', '=', 'DIV.id')->on('DIV.level', '=', \DB::expr(2))
                     ->where('SM.level', '=', 3)
                     ->and_where('SM.item_status', '!=', 'delete');
        isset($param['item_status']) && !empty($param['item_status']) && $query->and_where('SM.item_status', '=', $param['item_status']); 
        isset($param['business_id']) && !empty($param['business_id']) && $query->and_where('SM.parent', 'IN', \DB::expr("(SELECT id FROM m_department WHERE parent = {$param['business_id']})"));
        isset($param['division_id']) && !empty($param['division_id']) && $query->and_where('SM.parent', '=', $param['division_id']);            
        isset($param['department_id']) && !empty($param['department_id']) && $query->and_where('SM.parent', '=', \DB::expr("(SELECT parent FROM m_department WHERE id = {$param['department_id']})"));

        //get department is only available
        if(isset($param['item_status']) && !empty($param['item_status']) && $param['item_status'] == "active"){
            $query->and_where_open()
                    ->and_where(\DB::expr('SM.enable_end_date'), '>=', $enable_date)
                    ->or_where(\DB::expr('SM.enable_end_date'), 'IS', \DB::expr('NULL'))
                    ->and_where_close();
                    ; 
        }
        //============= Only Get Department Enable ==============
        if(isset($param['has_enable']) && $param['has_enable'] == true){

        }   
        $result = $query->execute()->as_array();
        $data['options']['department'] = [];
        if(!empty($result)){
            foreach ($result as $key => $value) {
                $label = $value['division_name'] . " - " . $value['name'] . " - " . $value['code'];
                $data['options']['department'][] = ['id' => $value['id'],
                                                    'text' => $label];
            // get current parent id of division_id request                                                    
                isset($param['department_id']) && !empty($param['department_id']) && $param['department_id'] == $value['id'] && $division_id = $value['parent'];
            }
        }      

        /*=====================================
         * Get List Division
         * Department Level = 2
         *=====================================*/
        $query = \DB::select('SM.id', 'SM.name', 'SM.code', 'SM.parent', 'SM.m_company_id')
                     ->from([$this->main_table, 'SM'])
                     ->where('SM.level', '=', 2)
                     ->and_where('SM.item_status', '!=', 'delete');
        isset($param['item_status']) && !empty($param['item_status']) && $query->and_where('SM.item_status', '=', $param['item_status']);  
        isset($param['business_id']) && !empty($param['business_id']) && $query->and_where('SM.parent', '=', $param['business_id']);
        !empty($division_id) && $query->and_where('SM.parent', '=', \DB::expr("(SELECT parent FROM m_department WHERE id = {$division_id} LIMIT 1)"));

        //============= Only Get Department Enable ==============
        if(isset($param['has_enable']) && $param['has_enable'] == true){

        }    
        $result = $query->execute()->as_array();
        $data['options']['division'] = [];
        if(!empty($result)){
            foreach ($result as $key => $value) {
                $data['options']['division'][] = ['id' => $value['id'],
                                                    'text' => $value['name']];
                // get current parent id of division_id request                                                    
                !empty($division_id) && $division_id == $value['id'] && $business_id = $value['parent'];
            }
        }


        /*=====================================
         * Get List Business
         * Department Level = 1
         *=====================================*/
        // $query = \DB::select()
        $query = \DB::select('SM.id', 'SM.name', 'SM.code', 'SM.parent', 'SM.m_company_id')
                     ->from([$this->main_table, 'SM'])
                     ->where('SM.level', '=', 1)
                     ->and_where('SM.item_status', '!=', 'delete');
        isset($param['item_status']) && !empty($param['item_status']) && $query->and_where('SM.item_status', '=', $param['item_status']);
        !empty($business_id) && $query->and_where('SM.parent', '=', \DB::expr("(SELECT parent FROM m_department WHERE id = {$business_id} LIMIT 1)"));
        isset($param['m_company_id']) && !empty($param['m_company_id']) && $query->and_where('SM.m_company_id', '=', $param['m_company_id']);

        //============= Only Get Department Enable ==============
        if(isset($param['has_enable']) && $param['has_enable'] == true){

        }
        $result = $query->execute()->as_array();
        $data['options']['business'] = [];
        if(!empty($result)){
            foreach ($result as $key => $value) {
                $data['options']['business'][] = ['id' => $value['id'],
                                                    'text' => $value['name']];
                !empty($value['m_company_id']) && $m_company_id = $value['m_company_id'];
            }
            !empty($business_id) && $business_id == $value['id'] && $m_company_id = $value['m_company_id'];
        }     
       
        


        $data['m_company_id'] = ($business_id || $division_id || $department_id)?$m_company_id:@$param['m_company_id'];
        $data['business_id'] = $business_id;
        $data['division_id'] = $division_id;
        $data['department_id'] = $department_id;

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
     * Function list department build into selectbox
     * Method GET
     * Table m_department
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_autocomplete_department(){
        $param          = \Input::param();
        /*=====================================
         * Get List Department
         * Department Level = 3
         *=====================================*/
        $query = \DB::select('SM.id', 'SM.name', 'SM.code', 'SM.parent', 'SM.sub_code')
                     ->from([$this->main_table, 'SM'])
                     ->where('SM.level', '=', 3)
                     ->and_where('SM.item_status', '!=', 'delete');
        isset($param['item_status']) && !empty($param['item_status']) && $query->and_where('SM.item_status', '=', $param['item_status']); 
        isset($param['division_id']) && !empty($param['division_id']) && $query->and_where('SM.parent', '=', $param['division_id']);            

        //============= Only Get Department Enable ==============
        if(isset($param['has_enable']) && $param['has_enable'] == true){

        }   
        $result = $query->execute()->as_array();
        $data['options']['department'] = [];
        if(!empty($result)){
            foreach ($result as $key => $value) {
                $label = $value['code'] . " - " . $value['name'];
                $data['options']['department'][] = ['code' => $value['code'],
                                                    'name' => $value['name'],
                                                    'value' => $label];
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