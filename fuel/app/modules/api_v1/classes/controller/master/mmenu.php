<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:35:03
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-06-28 13:17:26
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MMenu extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_menu';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get basic data of group
     * Method GET
     * Table m_menu
     * Single data | array
     * Where condition "LIKE %$1%" 
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_index($pk = null){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $limit          = 5000;
        $offset         = 0;

        $select         = ['SM.*', \DB::expr('MD.name AS m_department_name'), \DB::expr('MP.name AS limit_m_position_name'),
                            \DB::expr('MM.id AS has_draft_menu_id')];
        $query = \DB::select_array($select)
                         ->from([$this->main_table, 'SM'])
                         ->join(['m_department', 'MD'], 'left')->on('MD.id', '=', 'SM.m_department_id')
                         ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'SM.limit_m_position_id')
                         ->join(['m_menu', 'MM'], 'left')->on('MM.draft_id', '=', 'SM.id')->on('MM.item_status', '=', \DB::expr('"active"'));
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
                            if($param[$field] == 'active'){
                                $query->and_where('SM.enable_flg', '=', 1);
                            }
                        case 'm_department_id':
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

        isset($param['sort_order']) && in_array(strtolower($param['sort_order']), ['asc', 'desc']) && $query->order_by('SM.order', $param['sort_order']);
        /*==================================================
         * Process Query
         *==================================================*/
        if(isset($pk)){
            $query->and_where('SM.id', '=', $pk);
            $data = $query->execute()->current();

            if(isset($param['has_master_input']) && $param['has_master_input']){    
                $queryMasterInput = \DB::select('MI.id', 'MI.m_input_type_id', 'MI.code', 'MI.name', \DB::expr('MI.name AS label'), 'MI.default_value', 'MI.options_value', 'MI.placeholder',
                                        'MI.unit', 'MI.required', 'MI.supplementation', 'MI.supplementation_position', 'MI.enable_flg', 'MI.size_height', 'MI.size_width',
                                        \DB::expr('MIT.name AS input_type_name'), \DB::expr('MIT.name_e AS type'))
                                        ->from(['m_input', 'MI'])
                                        ->join(['m_menu_input', 'MMI'], 'left')->on('MMI.m_input_id', '=', 'MI.id')
                                        ->join(['m_input_type', 'MIT'], 'left')->on('MIT.id', '=', 'MI.m_input_type_id')
                                        ->where('MMI.m_menu_id', '=', $pk)
                                        ->where('MMI.item_status', '=', 'active');
                $dataMenuInput = $queryMasterInput->execute()->as_array();                         
                $data['inputs'] = $dataMenuInput;
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
     * Table m_menu
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('m_department_id',__('Department ID', [], 'Department ID'),'required');
        $validation->add_field('limit_m_position_id',__('Position ID', [], 'Position ID'),'required');
        $validation->add_field('name',__('name', [], 'name'),'required');
        


        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;
                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $Item = empty($pk)?\Model_MMenu::forge():\Model_MMenu::find($pk);
            if(isset($param['method']) && $param['method'] == 'draft'){
                $Item = \Model_MMenu::forge();
            }

            if(isset($param['method']) && $param['method'] == 'apply_draft'){
                $Item = \Model_MMenu::find($param['draft_id']);
            }



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
                if(isset($param['method']) && $param['method'] == 'draft'){
                    unset($arrData['id']);
                }
                if(isset($param['method']) && $param['method'] == 'apply_draft'){
                    $arrData['id'] = $param['draft_id'];
                    $arrData['draft_id'] = null;

                    //delete record draft
                    \Model_MMenu::softDelete($pk, array('item_status' => 'delete'));
                }

                //generate code
                if(!isset($arrData['id']) || (isset($arrData['id']) && empty($arrData['id']))){
                    $generate_code = \Model_MMenu::last_menu_code();
                    $mid_code = !empty($generate_code)?(int)$generate_code['second_number']:'1';
                    $menu_code = '1' . \Vision_Common::create_number($mid_code + 1, 3) . '01';
                    $arrData['code'] = $menu_code;
                }

                $Item->set($arrData)->save();

                /*==================================================
                 * Stored data input_element
                 * Table: m_input
                 *==================================================*/
                if(!empty($param['input_element'])){
                    $i =0;
                    $input_element = json_decode($param['input_element']);
                    if(!empty($input_element)){
                        //=================== Get Input Type ====================
                        $query = \DB::select('name_e', 'id')
                                    ->from(['m_input_type', 'SM'])
                                    ->where('SM.item_status', '!=', 'delete');
                        $arrInputType = $query->execute()->as_array('name_e', 'id');

                        //=================== Update All Input Delete Before Save ================
                        \DB::update('m_menu_input')->set(['item_status' => 'delete',
                                                            'deleted_date' => date('Y-m-d H:i:s'),
                                                            'deleted_user_id' => \Auth::get('id')])
                                                ->where('m_menu_id', '=', $Item->id)
                                                ->execute();

                        foreach ($input_element as $value) {
                            $m_input_type_id = $arrInputType[$value->type];
                            if(in_array($value->type, ['checkbox-group', 'radio-group', 'select'])){
                                $options_value = [];
                                if(!empty($value->values)){
                                    foreach ($value->values as $opts) {
                                        $options_value[] = $opts->label;
                                    }
                                }
                                $options_value = json_encode($options_value);
                                $default_value = null;
                            }else{
                                $options_value = null;
                                $default_value = isset($value->value)?$value->value:null;
                            }

                            $udData = ['m_input_type_id' => $m_input_type_id,
                                        'name' => isset($value->label)?$value->label:null,
                                        'default_value' => $default_value,
                                        'options_value' => $options_value,
                                        'placeholder' => isset($value->placeholder)?$value->placeholder:null,
                                        'unit' => isset($value->unit)?$value->unit:null,
                                        'required' => isset($value->required)?$value->required:0,
                                        'supplementation' => isset($value->description)?$value->description:null,
                                        'supplementation_position' => 2,
                                        'enable_flg' => 1,
                                        'size_height' => null,
                                        'size_width' => isset($value->sizeWidth)?$value->sizeWidth:null,
                                        ]; 
                            $ObjMI = !isset($value->id)?\Model_MInput::forge():\Model_MInput::find($value->id);
                            if(!empty($ObjMI)){ 
                                $ObjMI->set($udData)->save();

                                /*==================================================
                                 * Stored data m_menu_input
                                 * Table: m_menu_input
                                 *==================================================*/
                                $i++;
                                $objMMI = \Model_MMenuInput::find('first', ['where' => ['m_menu_id' => $Item->id, 'm_input_id' => $ObjMI->id, 'item_status' => 'active']]);
                                $objMMI = empty($objMMI)?\Model_MMenuInput::forge():$objMMI;

                                if(!empty($ObjMI)){ 
                                    $mmiData = ['m_menu_id' => $Item->id,
                                                'm_input_id' => $ObjMI->id,
                                                'order' => $i,
                                                'item_status' => 'active'];
                                    $objMMI->set($mmiData)->save();
                                }       
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
     * Table m_menu
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MMenu::softDelete($pk, array('item_status' => 'delete'));
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
        $result     = \Model_MMenu::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
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

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function update order of menu item
     * Method PUT
     * Table m_menu
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function put_update_order(){
        $param = \Input::param();
        if(!empty($param['ids'])){
            $i = 0;
            foreach ($param['ids'] as $key => $value) {
                $obj = \Model_MMenu::find($value);
                if(!empty($obj)){
                    $obj->set(['order' => ++$i])->save();
                }
            }
        }

        $response = ['status' => 'success',
                    'code' => Exception::E_UPDATE_SUCCESS,
                    'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS)];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get all menu master both 0.2 & 0.4
     * Method GET
     * Table m_menu, m_request_menu
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function get_all_menu_master(){
        $param = \Input::param();
        $data = [];

        $queryMMenu = \DB::select('id', 'code', 'name', 'm_department_id', 'item_status', 'enable_flg', \DB::expr('CONCAT("menu_",id) AS _id'))
                            ->from(['m_menu', 'MM']);

        $queryMMenuPayment = \DB::select('id', 'code', 'name', 'm_department_id', 'item_status', 'enable_flg', \DB::expr('CONCAT("payment_",id) AS _id'))
                                    ->from(['m_request_menu', 'MRM']);  


        $query = \DB::select()
                    ->from(\DB::expr('(('.$queryMMenu.') UNION ('.$queryMMenuPayment.')) UQ'))
                    ->where('UQ.item_status', '!=', 'delete');

        if(isset($param['item_status'])){
            $query->and_where('UQ.item_status', '=', $param['item_status']);
            if($param['item_status'] == 'active'){
                $query->and_where('UQ.enable_flg', '=', 1);
            }
        }

        if(isset($param['division_id'])){
            $query->and_where('UQ.m_department_id', '=', $param['division_id']);
        }

        $query->order_by('UQ.code', 'ASC');
                            
        $data = $query->execute()->as_array();                    

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
     * Function get detail from 
     * Relation with input
     * Method GET
     * Table m_menu
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_menu_input_detail($pk){
        $param = \Input::param();
        $data = [];
        if(!empty($pk)){
            //Get Basic Information Of Menu Master
            $query = \DB::select(\DB::expr('MM.id AS m_menu_id'),  'MM.m_department_id', \DB::expr('MM.code AS m_menu_code'), 'MM.name', 'MM.description', 'MM.limit_m_position_id', 'MM.enable_flg', 'MM.add_file_flg')
                            ->from(['m_menu', 'MM'])
                            ->where('MM.id', '=', $pk)
                            ->and_where('MM.item_status', '=', 'active');
            $data = $query->execute()->current();

            if(!empty($data)){
                //Get List Input Of Menu Master
                $query = \DB::select(\DB::expr('MI.id AS m_input_id'), 'MI.code', 'MI.name', 'MI.default_value', 'MI.options_value', 'MI.placeholder', 'MI.unit', 'MI.required', 'MI.supplementation', 'MI.supplementation_position',
                                    'MI.enable_flg', 'MI.size_height', 'MI.size_width',
                                    \DB::expr('MIT.id AS input_type_id'), \DB::expr('MIT.code AS input_type_code'), \DB::expr('MIT.name AS input_type_name'), \DB::expr('MIT.name_e AS input_type_name_e'))
                            ->from(['m_menu_input', 'MMI'])
                            ->join(['m_input', 'MI'], 'left')->on('MI.id', '=', 'MMI.m_input_id')
                            ->join(['m_input_type', 'MIT'], 'left')->on('MIT.id', '=', 'MI.m_input_type_id')
                            ->where('MMI.m_menu_id', '=', $pk)
                            ->and_where('MMI.item_status', '=', 'active')
                            ->and_where('MMI.item_status', '!=', 'delete')
                            ->and_where('MI.enable_flg', '=', 1)
                            ->order_by('MMI.order', 'ASC');
                $data['inputs'] = $query->execute()->as_array();       
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

