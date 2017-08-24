<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_TRequest extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_request';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get detail form information
     * Method GET
     * Table t_proposal
     * Single data
     * Input $pk - primary key
     * Response data: status[success|error], total[total_record], data[single|array] 
     *=============================================================*/
    public function get_detail($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $recursive = new \Vision_Recursive();
        $user_info = \Auth::get();

        if(empty($pk)){
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_PK_MISS,
                        'message' => Exception::getMessage(Exception::E_PK_MISS)];
            return $this->response($response);
        }

        //sub-query get column receipt_flg
        $receipt_flg = 'CASE SM.m_request_menu_id
                            WHEN 1 THEN (IF((SELECT TRTS.id
                                                FROM t_request_transport_spec TRTS 
                                                LEFT JOIN m_expense_item MEI ON MEI.id=TRTS.m_expense_item_id 
                                                WHERE TRTS.t_request_id=SM.id
                                                AND TRTS.item_status = "active"
                                                AND MEI.receipt_flg = 1 
                                                LIMIT 1) > 0, 1, 0))
                            WHEN 4 THEN (SELECT TRTE.lodging_receipt_flg FROM t_request_traveling_expenses TRTE WHERE TRTE.t_request_id=SM.id AND TRTE.item_status = "active" LIMIT 1)
                            WHEN 5 THEN (SELECT TRTE.lodging_receipt_flg FROM t_request_traveling_expenses TRTE WHERE TRTE.t_request_id=SM.id AND TRTE.item_status = "active" LIMIT 1)
                            WHEN 6 THEN (SELECT MEI.receipt_flg FROM t_request_purchase TRP INNER JOIN m_expense_item MEI ON MEI.id=TRP.m_expense_item_id WHERE TRP.t_request_id=SM.id AND TRP.item_status = "active" LIMIT 1)
                            WHEN 8 THEN (SELECT MEI.receipt_flg FROM t_request_dietary TRD INNER JOIN m_expense_item MEI ON MEI.id=TRD.m_expense_item_id WHERE TRD.t_request_id=SM.id AND TRD.item_status = "active" LIMIT 1)
                            WHEN 9 THEN (SELECT MEI.receipt_flg FROM t_request_dietary TRD INNER JOIN m_expense_item MEI ON MEI.id=TRD.m_expense_item_id WHERE TRD.t_request_id=SM.id AND TRD.item_status = "active" LIMIT 1)
                            ELSE 0
                        END AS receipt_flg';

        $select = ['SM.id', 'SM.copy_petition_id', 'SM.m_request_menu_id', 'SM.m_user_id', 'SM.m_user_concurrent_post_flag', 'SM.m_user_department_id',
                    'SM.m_currency_id', 'SM.m_petition_status_id', \DB::expr('MPS.name AS m_petition_status_name'),
                    'SM.code', 'SM.date', 'SM.type', 'SM.name', 'SM.destination', 
                    'SM.expenses_flg', 'SM.priority_flg', 'SM.change_route', 'SM.reason', 'SM.amount', 'SM.reason', 'SM.suspense_payments', 'SM.settlement_amount', 'SM.cor_amount', 'SM.cor_suspense_payments', 
                    'SM.cor_settlement_amount', 'SM.account_conf_date', 'SM.account_staff_no', 'SM.transfer_date', 'SM.obic_outeput_date', 'SM.zenginkyo_outeput_date', 'SM.zenginkyo_output_hold_flg', 'zenginkyo_output_prevent_flg', 
                    'SM.receipt_arrival', \DB::expr($receipt_flg), 'SM.last_approve_user_id', 'SM.last_approve_date',
                    \DB::expr('MRM.name AS request_menu_name'), \DB::expr('MRM.code AS request_menu_code'),
                    'TRP.m_expense_item_id',
                    \DB::expr('MCU.symbol AS currency_symbol')
                    ];

        $query = \DB::select_array($select)
                     ->from([$this->main_table, 'SM'])
                     ->join(['m_request_menu', 'MRM'], 'left')->on('SM.m_request_menu_id', '=', 'MRM.id')
                     ->join(['t_request_purchase', 'TRP'], 'left')->on('TRP.t_request_id', '=', 'SM.id')
                     ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                     ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'MU.m_currency_id')
                     ->join(['m_petition_status', 'MPS'], 'left')->on('SM.m_petition_status_id', '=', 'MPS.id')
                     ->join(['t_approval_status', 'TAS'], 'left')->on('SM.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('2'))
                     ->where('SM.id', '=', $pk)
                     ->and_where('SM.item_status', '=', 'active');
        //return data when user in routes
        if($user_info['permission_system'] 
            || (isset($param['export_obic']) && $param['export_obic'])){
            
        }else{
            // $query->and_where('TAS.m_user_id', '=', $user_info['id']);
        }             

        $data = $query->execute()->current();

        //Check status form != draft in case current user is not user who was created form
        if($data['m_petition_status_id'] == 1 && $data['m_user_id'] != $user_info['id']){
            $data = [];
        }

        if(!empty($data)){

            //Update comment read in table t_approval_status
            \DB::update('t_approval_status')->set(['is_read_comment' => 1,
                                                'updated_date' => date('Y-m-d H:i:s'),
                                                'updated_user_id' => $user_info['id']])
                                            ->where('petition_id', '=', $pk)
                                            ->and_where('petition_type', '=', 2)
                                            ->and_where('m_user_id', '=', $user_info['id'])
                                            ->execute();

            //Get comment
            $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.date_time',  'SM.content', 'SM.parent', 'SM.level', 'SM.m_user_id', 'SM.item_status', 'MU.fullname')
                         ->from(['t_comment', 'SM'])
                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')    
                         ->where('SM.petition_id', '=', $pk)
                         ->and_where('SM.petition_type', '=', 2)
                         ->and_where('SM.item_status', 'IN', ['active', 'client_delete'])
                         ->order_by('SM.id', 'ASC')
                         ->order_by('SM.date_time', 'ASC');
            $result = $query->execute()->as_array();      
            $comments = $recursive->buildComment($result, 0);   
            $data['comments'] = $comments;

            //Get file attachment
            $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath')
                         ->from(['t_form_attachment', 'SM'])
                         ->where('SM.petition_id', '=', $pk)
                         ->and_where('SM.petition_type', '=', 2)
                         ->and_where('SM.item_status', '=', 'active');
            $result = $query->execute()->as_array('id');         
            $data['files_attach'] = $result;


            //Get data from table t_request_transport_spec 
            $query = \DB::select()
                         ->from(['t_request_transport_spec', 'SM'])
                         ->where('SM.t_request_id', '=', $pk)
                         ->and_where('SM.item_status', '=', 'active')
                         ->order_by('SM.id', 'ASC');
            $result = $query->execute()->as_array();         
            $data['t_request_transport_spec'] = $result;
            
            //Get data from table t_cost_divide 
            $query = \DB::select('SM.id', 'SM.t_request_id', 'SM.m_department_id', 'SM.divide_cost',  'SM.cor_divide_cost',  'SM.description', 
                            \DB::expr('CONCAT(DIV.name, " - ", DEP.name, " - ", DEP.code) as department_name'))
                         ->from(['t_cost_divide', 'SM'])
                         ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'SM.m_department_id')
                         ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                         ->where('SM.t_request_id', '=', $pk)
                         ->and_where('SM.item_status', '=', 'active');
            $result = $query->execute()->as_array();         
            $data['t_cost_divide'] = $result;

            //Get data from table t_request_traveling_expenses 
             $query = \DB::select('SM.*', \DB::expr('TR.code AS quote_t_request_code'))
                         ->from(['t_request_traveling_expenses', 'SM'])
                         ->join(['t_request', 'TR'], 'left')->on('SM.quote_t_request_id', '=', 'TR.id')
                         ->where('SM.t_request_id', '=', $pk)
                         ->and_where('SM.item_status', '=', 'active')
                         ->order_by('SM.id', 'ASC');
            $result = $query->execute()->current();       

            //Get data from table t_request_traveling_expenses_other 
            if(!empty($result)){
                $query = \DB::select()
                             ->from(['t_request_traveling_expenses_other', 'SM'])
                             ->where('SM.t_request_traveling_expenses_id', '=', $result['id']);
                $result['other'] = $query->execute()->as_array(); 
            }
            $data['t_request_traveling_expenses'] = $result;

            //Get data from table t_purchase_reception_spec 
            $query = \DB::select()
                         ->from(['t_purchase_reception_spec', 'SM'])
                         ->where('SM.t_request_id', '=', $pk)
                         ->and_where('SM.item_status', '=', 'active')
                         ->order_by('SM.id', 'ASC');
            $result = $query->execute()->as_array();         
            $data['t_purchase_reception_spec'] = $result;

            //Get data from table t_request_dietary 
            $query = \DB::select()
                         ->from(['t_request_dietary', 'SM'])
                         ->where('SM.t_request_id', '=', $pk)
                         ->and_where('SM.item_status', '=', 'active')
                         ->order_by('SM.id', 'ASC');
            $result = $query->execute()->current();         
            $data['t_request_dietary'] = $result;

            //Get file attachment
            $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath', 'area_upload')
                         ->from(['t_form_attachment', 'SM'])
                         ->where('SM.petition_id', '=', $pk)
                         ->and_where('SM.petition_type', '=', 2)
                         ->and_where('SM.item_status', '=', 'active')
                         ->order_by('SM.id', 'ASC');
            $result = $query->execute()->as_array('id');         
            $data['files_attach'] = $result;

            //Get list routes
            $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.m_user_id', 'SM.m_authority_id', \DB::expr('MA.name AS authority_name'), 'SM.m_approval_status_id', \DB::expr('MAS.name AS m_approval_status_name'), 'SM.approval_datetime', 'SM.order', 'SM.resource_data', 'SM.unit',
                            'MU.staff_no', 'MU.fullname')
                         ->from(['t_approval_status', 'SM'])
                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                         ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'SM.m_authority_id')
                         ->join(['m_approval_status', 'MAS'], 'left')->on('MAS.id', '=', 'SM.m_approval_status_id')
                         ->where('SM.petition_id', '=', $pk)
                         ->and_where('SM.petition_type', '=', 2)
                         ->and_where('SM.item_status', '=', 'active')
                         ->order_by('SM.order', 'ASC');
            $result = $query->execute()->as_array(); 
            $user_create_form = [];

            if(!empty($result)){
                foreach ($result as $key => $value) {
                    $concurrent_post_flag = ($value['m_authority_id'] == 1)?$data['m_user_concurrent_post_flag']:0;
                    //check exact department when concurrent_post_flag == 1;
                    $current_department_param = ($value['m_authority_id'] == 1)?['m_department_id' => $data['m_user_department_id']]:[];
                    $mainDepartment = \Model_MUserDepartment::getCurrentDepartment($value['m_user_id'], $data['date'], false, $concurrent_post_flag, $current_department_param);
                    $result[$key]['segment'] = ($value['unit'] == 'organization')?'組織':'部品';
                    $result[$key]['m_position_id'] = $mainDepartment['m_position_id'];
                    $result[$key]['position_name'] = $mainDepartment['position_name'];
                    $result[$key]['department_id'] = $mainDepartment['department_id'];
                    $result[$key]['department_code'] = $mainDepartment['department_code'];
                    $result[$key]['department_name'] = $mainDepartment['department_name'];
                    $result[$key]['division_id'] = $mainDepartment['division_id'];
                    $result[$key]['division_name'] = $mainDepartment['division_name'];
                    $result[$key]['business_id'] = $mainDepartment['business_id'];
                    $result[$key]['business_name'] = $mainDepartment['business_name'];

                    //Get creator info
                    if($value['m_authority_id'] == 1){
                        $user_create_form = $result[$key];
                    }
                }
            }  
            $data['user_create_form'] = $user_create_form;     
            $data['routes'] = $result;

            /*=========================================
             * Get All Copy Form Petition
             *=========================================*/
            $copy_petition = [];
            // if($user_info['id'] == $data['m_user_id']){
                $recursive = new \Vision_Recursive();
                $recursive->getCopyPetition($data['copy_petition_id'], 2, $copy_petition);
            // }
            $data['copy_petition'] = $copy_petition;
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
     * Function insert record into table
     * Method POST
     * Table t_request
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $param_files = \Input::file();
        $user_info = \Auth::get();

        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('m_request_menu_id',__('Menu Request ID', [], 'Menu Request ID'),'required');
        // $validation->add_field('destination',__('Destination', [], 'Destination'),'required');

        //Check method allow copy data
        $allow_copy = ['copy'];

        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?trim($value):null;

                switch ($key) {
                    case 'date':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d', strtotime($value)):null;
                        break;
                    case 'amount':
                    case 'suspense_payments':
                    case 'settlement_amount':
                    case 'cor_amount':
                    case 'cor_suspense_payments':
                    case 'cor_settlement_amount':
                        //replace ',' in money (numeric)
                        $value = (!is_null($value) && $value != '' && $value != 'null')?str_replace(',', '', $value):null;
                        break;

                }

                $arrData[$key] = $value;
            }
            //Set default currency if is not set
            if(!isset($arrData['m_user_id']) || empty(@$arrData['m_currency_id'])){
                $arrData['m_currency_id'] = 1; //default currency
            }



            //======================== Default Data =================
            $Item = empty($pk)?\Model_TRequest::forge():\Model_TRequest::find($pk);
            if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                $Item = \Model_TRequest::forge();
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
                if(!empty($pk)){
                    //Update.... form proposal

                    //Copy form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $code = \Model_TRequest::get_last_payment_code(['menu_code' => $param['m_menu_code']]);

                        $arrData['m_user_concurrent_post_flag'] = !is_null($user_info['active_concurrent_post_flag'])?$user_info['active_concurrent_post_flag']:0; //detect department of user create form
                        $arrData['active_m_department_id'] = !empty($user_info['active_m_department_id'])?$user_info['active_m_department_id']:null; //detect department of user create form
                        $arrData['code'] = $code; //get petition_code
                        $arrData['m_petition_status_id'] = 1; //draft
                    }
                }else{
                    //Create new form proposal
                    $code = \Model_TRequest::get_last_payment_code(['menu_code' => $param['m_menu_code']]);
                    $arrData['m_user_concurrent_post_flag'] = !is_null($user_info['active_concurrent_post_flag'])?$user_info['active_concurrent_post_flag']:0; //detect department of user create form
                    $arrData['active_m_department_id'] = !empty($user_info['active_m_department_id'])?$user_info['active_m_department_id']:null; //detect department of user create form
                    $arrData['code'] = $code; //get petition_code
                    $arrData['m_petition_status_id'] = 1; //draft
                }
                //save data to t_request
                $Item->set($arrData)->save();


                //Update reference_form_id
                if(isset($param['reference_form_id']) && !empty($param['reference_form_id'])){
                    $reference_form_id = $param['reference_form_id'];
                    $obj_reference_form_id = \Model_TRequestTravelingExpenses::find('first', ['where' => ['t_request_id' => $reference_form_id, 'item_status' => 'active']]);
                    if(!empty($obj_reference_form_id)){ 
                        $obj_reference_form_id->set(['request_expenses_flg' => 1])->save();
                    }
                }


                //Save data to table t_request_transport_spec
                if(isset($param['t_request_transport_spec']) && !empty($param['t_request_transport_spec'])){
                    $t_request_transport_spec = json_decode($param['t_request_transport_spec']);

                    //Update Delete
                    \DB::update('t_request_transport_spec')->set(['item_status' => 'delete'])
                                                                ->where('t_request_id', '=', $Item->id)
                                                                ->execute();

                    foreach ($t_request_transport_spec as $obj) {
                        //Copy form reset cor_transportation_spec_fee form
                        if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                            $obj->cor_transportation_spec_fee = null;
                        }
                        
                        $iData = ['t_request_id' => $Item->id,
                                    'm_expense_item_id' => $obj->m_expense_item_id,
                                    'use_date' => (!is_null($obj->use_date) && $obj->use_date != '')?date('Y-m-d', strtotime($obj->use_date)):null,
                                    'departure_point' => isset($obj->departure_point)?$obj->departure_point:null,
                                    'arrival_point' => isset($obj->arrival_point)?$obj->arrival_point:null,
                                    'transportation_spec_fee' => isset($obj->transportation_spec_fee)?(float)str_replace(',', '', $obj->transportation_spec_fee):null,
                                    'cor_transportation_spec_fee' => isset($obj->cor_transportation_spec_fee)?(float)str_replace(',', '', $obj->cor_transportation_spec_fee):null,
                                    'receipt_flg' => $obj->receipt_flg,
                                    'item_status' => 'active'
                                    ]; 
                        $ObjTRTS = !isset($obj->id)?\Model_TRequestTransportSpec::forge():\Model_TRequestTransportSpec::find($obj->id);

                        //Create New Object When copy Form
                        if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                            $ObjTRTS = \Model_TRequestTransportSpec::forge();
                        }

                        if(!empty($ObjTRTS)){ 
                            $ObjTRTS->set($iData)->save();
                        }
                    }  
                }



                //Save data to table t_request_purchase
                if(isset($param['m_expense_item_id']) && !empty($param['m_expense_item_id'])){
                    $m_expense_item_id = $param['m_expense_item_id'];

                    $ObjTRP = \Model_TRequestPurchase::find('first', ['where' => ['t_request_id' => $Item->id]]);
                    $iData = ['t_request_id' => $Item->id,
                                'm_expense_item_id' => $m_expense_item_id,
                                'date' => $Item->date
                                ]; 
                    if(!empty($ObjTRP)){ 
                        $ObjTRP->set($iData)->save();
                    }else{
                        $ObjTRP = \Model_TRequestPurchase::forge()->set($iData)->save();
                    }
                    
                }

                //Save data to table t_cost_divide
                if(isset($param['t_cost_divide']) && !empty($param['t_cost_divide'])){
                    $t_cost_divide = json_decode($param['t_cost_divide']);

                    //Update Delete
                    \DB::update('t_cost_divide')->set(['item_status' => 'delete'])
                                                ->where('t_request_id', '=', $Item->id)
                                                ->execute();

                    foreach ($t_cost_divide as $obj) {
                        //Copy form reset cor_transportation_spec_fee form
                        if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                            $obj->cor_divide_cost = null;
                        }

                        $iData = ['t_request_id' => $Item->id,
                                    'm_department_id' => $obj->m_department_id,
                                    'divide_cost' => isset($obj->divide_cost)?(float)str_replace(',', '', $obj->divide_cost):null,
                                    'cor_divide_cost' => isset($obj->cor_divide_cost)?(float)str_replace(',', '', $obj->cor_divide_cost):null,
                                    'description' => isset($obj->description)?$obj->description:null,
                                    'item_status' => 'active'
                                    ]; 
                        $ObjTCD = !isset($obj->id)?\Model_TCostDivide::forge():\Model_TCostDivide::find($obj->id);

                        //Create New Object When copy Form
                        if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                            $ObjTCD = \Model_TCostDivide::forge();
                        }

                        if(!empty($ObjTCD)){ 
                            $ObjTCD->set($iData)->save();
                        }
                    }
                }

                //Save data to table t_request_traveling_expenses
                if(isset($param['t_request_traveling_expenses']) && !empty($param['t_request_traveling_expenses'])){
                    $t_request_traveling_expenses = json_decode($param['t_request_traveling_expenses']);

                    //Update Delete
                    \DB::update('t_request_traveling_expenses')->set(['item_status' => 'delete'])
                                                                ->where('t_request_id', '=', $Item->id)
                                                                ->execute();

                    $obj = $t_request_traveling_expenses ;

                    //Copy form reset flag quote form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $obj->request_expenses_flg = 0;
                        $obj->quote_t_request_id = null;
                        $obj->cor_perdiem_fee = null;
                        $obj->cor_lodging_fee = null;
                    }


                    $iData = ['t_request_id' => $Item->id,
                                'm_trip_area_id' => isset($obj->m_trip_area_id)?$obj->m_trip_area_id:null,
                                'request_expenses_flg' => isset($obj->request_expenses_flg)?$obj->request_expenses_flg:0,
                                'settlement_date' => isset($obj->settlement_date) && !is_null($obj->settlement_date) && $obj->settlement_date != ''?$obj->settlement_date:null,
                                'business_trip_class' => isset($obj->business_trip_class)?$obj->business_trip_class:null,
                                'business_trip_destination' => isset($obj->business_trip_destination)?$obj->business_trip_destination:null,
                                'accommodation' => isset($obj->accommodation)?$obj->accommodation:null,
                                'contact_address' => isset($obj->contact_address)?$obj->contact_address:null,
                                'departure_date' => (isset($obj->departure_date) && !is_null($obj->departure_date) && $obj->departure_date != '')?date('Y-m-d', strtotime($obj->departure_date)):null,
                                'departure_transportation_id' => isset($obj->departure_transportation_id)?$obj->departure_transportation_id:null,
                                'departure_time' => (isset($obj->departure_time) && !is_null($obj->departure_time) && $obj->departure_time != '')?date('H:i:s', strtotime($obj->departure_time)):null,
                                'departure_flight' => isset($obj->departure_flight)?$obj->departure_flight:null,
                                'end_date' => (isset($obj->end_date) && !is_null($obj->end_date) && $obj->end_date != '')?date('Y-m-d', strtotime($obj->end_date)):null,
                                'end_transportation_id' => isset($obj->end_transportation_id)?$obj->end_transportation_id:null,
                                'end_time' => (isset($obj->end_time) && !is_null($obj->end_time) && $obj->end_time != '')?date('H:i:s', strtotime($obj->end_time)):null,
                                'end_flight' => isset($obj->end_flight)?$obj->end_flight:null,
                                'memo' => isset($obj->memo)?$obj->memo:null,
                                'approximate_amount' => isset($obj->approximate_amount)?(float)str_replace(',', '', $obj->approximate_amount):null,
                                'report_memo' => isset($obj->report_memo)?$obj->report_memo:null,
                                'perdiem_daily' => isset($obj->perdiem_daily)?(float)str_replace(',', '', $obj->perdiem_daily):null,
                                'perdiem_days' => isset($obj->perdiem_days)?(float)str_replace(',', '', $obj->perdiem_days):null,
                                'perdiem_fee' => isset($obj->perdiem_fee)?(float)str_replace(',', '', $obj->perdiem_fee):null,
                                'cor_perdiem_fee' => isset($obj->cor_perdiem_fee)?(float)str_replace(',', '', $obj->cor_perdiem_fee):null,
                                'lodging_daily' => isset($obj->lodging_daily)?(float)str_replace(',', '', $obj->lodging_daily):null,
                                'lodging_days' => isset($obj->lodging_days)?(float)str_replace(',', '', $obj->lodging_days):null,
                                'lodging_fee' => isset($obj->lodging_fee)?(float)str_replace(',', '', $obj->lodging_fee):null,
                                'cor_lodging_fee' => isset($obj->cor_lodging_fee)?(float)str_replace(',', '', $obj->cor_lodging_fee):null,
                                'lodging_receipt_flg' => isset($obj->lodging_receipt_flg)?$obj->lodging_receipt_flg:null,
                                'quote_t_request_id' => isset($obj->quote_t_request_id)?$obj->quote_t_request_id:null,
                                'item_status' => 'active'
                                ]; 
                    $ObjTRTE = !isset($obj->id)?\Model_TRequestTravelingExpenses::forge():\Model_TRequestTravelingExpenses::find($obj->id);

                    //Create New Object When copy Form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $ObjTRTE = \Model_TRequestTravelingExpenses::forge();
                    }

                    if(!empty($ObjTRTE)){ 
                        $ObjTRTE->set($iData)->save();
                    }


                    /*==================================================
                     * Insert Into Table t_request_traveling_expenses_other
                     *==================================================*/
                    if(isset($obj->other) && !empty($obj->other)){
                        $objOther = json_decode($obj->other);
                        foreach ($objOther as $obj) {
                            if(isset($obj->m_expense_item_id) && !empty($obj->m_expense_item_id)){
                                
                                $ObjTRTET = !isset($obj->id)?\Model_TRequestTravelingExpensesOther::forge():\Model_TRequestTravelingExpensesOther::find($obj->id);
                                //Create New Object When copy Form
                                if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                                    $ObjTRTET = \Model_TRequestTravelingExpensesOther::forge();
                                    $obj->cor_payments = null;
                                }

                                $iData = ['t_request_traveling_expenses_id' => $ObjTRTE->id,
                                            'm_expense_item_id' => isset($obj->m_expense_item_id)?$obj->m_expense_item_id:null,
                                            'description' => isset($obj->description)?$obj->description:0,
                                            'payments' => isset($obj->payments)?(float)str_replace(',', '', $obj->payments):null,
                                            'cor_payments' => isset($obj->cor_payments)?(float)str_replace(',', '', $obj->cor_payments):null
                                            ]; 

                                if(!empty($ObjTRTET)){ 
                                    $ObjTRTET->set($iData)->save();
                                }
                            }
                        }
                    }

                }

                //Save data to table t_purchase_reception_spec
                if(isset($param['t_purchase_reception_spec']) && !empty($param['t_purchase_reception_spec'])){
                    $t_purchase_reception_spec = json_decode($param['t_purchase_reception_spec']);
                    //Update Delete
                    \DB::update('t_purchase_reception_spec')->set(['item_status' => 'delete'])
                                                            ->where('t_request_id', '=', $Item->id)
                                                            ->execute();

                    // $obj = $t_purchase_reception_spec ;
                    foreach ($t_purchase_reception_spec as $obj) {
                        
                        $ObjTPRS = !isset($obj->id)?\Model_TPurchaseReceptionSpec::forge():\Model_TPurchaseReceptionSpec::find($obj->id);
                        //Create New Object When copy Form
                        if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                            $ObjTPRS = \Model_TPurchaseReceptionSpec::forge();
                            $obj->cor_payments = null;
                        }

                        $iData = ['t_request_id' => $Item->id,
                                    'reception_date' => (isset($obj->reception_date) && !is_null($obj->reception_date) && $obj->reception_date != '')?date('Y-m-d', strtotime($obj->reception_date)):null,
                                    'reception_target' => isset($obj->reception_target)?$obj->reception_target:null,
                                    'target_item' => isset($obj->target_item)?$obj->target_item:null,
                                    'payments' => isset($obj->payments)?(float)str_replace(',', '', $obj->payments):null,
                                    'cor_payments' => isset($obj->cor_payments)?(float)str_replace(',', '', $obj->cor_payments):null,
                                    'receipt_flg' => isset($obj->receipt_flg)?$obj->receipt_flg:null,
                                    'item_status' => 'active'
                                    ]; 

                        if(!empty($ObjTPRS)){ 
                            $ObjTPRS->set($iData)->save();
                        }
                    }
                }

                //Save data to table t_request_dietary
                if(isset($param['t_request_dietary']) && !empty($param['t_request_dietary'])){
                    $t_request_dietary = json_decode($param['t_request_dietary']);

                    //Update Delete    
                    \DB::update('t_request_dietary')->set(['item_status' => 'delete'])
                                                        ->where('t_request_id', '=', $Item->id)
                                                        ->execute();

                    $obj = $t_request_dietary ;

                    $iData = ['t_request_id' => $Item->id,
                                'm_expense_item_id' => $obj->m_expense_item_id,
                                'participant_name' => isset($obj->participant_name)?$obj->participant_name:null,
                                'other_company_name' => isset($obj->other_company_name)?$obj->other_company_name:null,
                                'other_company_participant_name' => isset($obj->other_company_participant_name)?$obj->other_company_participant_name:null,
                                'our_company_participant_name' => isset($obj->our_company_participant_name)?$obj->our_company_participant_name:null,
                                'participant_num' => isset($obj->participant_num)?(float)str_replace(',', '', $obj->participant_num):null,
                                'item_status' => 'active'
                                ]; 
                    $ObjTRD = !isset($obj->id)?\Model_TRequestDietary::forge():\Model_TRequestDietary::find($obj->id);
                    //Create New Object When copy Form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $ObjTRD = \Model_TRequestDietary::forge();
                    }

                    if(!empty($ObjTRD)){ 
                        $ObjTRD->set($iData)->save();
                    }
                }

                //Get master route and save database t_approval_status
                if(empty($pk) || (isset($param['method']) && in_array($param['method'], $allow_copy))){
                    $this->save_routes(['m_menu_id' => $Item->m_request_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                }

                /*
                if(empty($pk)){
                    $this->save_routes(['m_menu_id' => $Item->m_request_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                }else{
                    //Copy Routes When copy Form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $FormCopyDetail = \Model_TRequest::find($pk);
                        if(!empty($FormCopyDetail) && $Item->m_user_id == $FormCopyDetail->m_user_id){
                            //Get old list routes
                            $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.m_user_id', 'SM.m_authority_id', \DB::expr('MA.name AS authority_name'), 'SM.m_approval_status_id', 'SM.approval_datetime', 'SM.order', 'SM.resource_data', 'SM.unit',
                                            'MU.fullname')
                                         ->from(['t_approval_status', 'SM'])
                                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                                         ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'SM.m_authority_id')
                                         ->where('SM.petition_id', '=', $pk)
                                         ->and_where('SM.petition_type', '=', 2)
                                         ->and_where('SM.item_status', '=', 'active')
                                         ->and_where('SM.m_authority_id', '!=', 1) //remove old user create form
                                         ->order_by('SM.order', 'ASC');
                            $result_routes = $query->execute()->as_array(); 
                            if(!empty($result_routes)){
                                //Add User Create Form
                                $dataRoutes = ['petition_id' => $Item->id,
                                                'petition_type' => 2,
                                                'm_user_id' => $user_info['id'],
                                                'm_authority_id' => 1,
                                                'm_approval_status_id' => null,
                                                'order' => 1,
                                                'resource_data' => 'system',
                                                'unit' => 'parts',
                                                'is_read_comment' => 1,
                                                'notice_confirm_code' => 1,
                                                ];
                                \Model_TApprovalStatus::forge()->set($dataRoutes)->save();
                                $i = 1;
                                foreach ($result_routes as $routes) {
                                    $i ++;
                                    $dataRoutes = ['petition_id' => $Item->id,
                                                    'petition_type' => 2,
                                                    'm_user_id' => $routes['m_user_id'],
                                                    'm_authority_id' => $routes['m_authority_id'],
                                                    'm_approval_status_id' => null,
                                                    'order' => $i,
                                                    'resource_data' => $routes['resource_data'],
                                                    'unit' => $routes['unit'],
                                                    'is_read_comment' => 1,
                                                    'notice_confirm_code' => 1,
                                                    ];
                                    \Model_TApprovalStatus::forge()->set($dataRoutes)->save();
                                }
                            }else{
                                $this->save_routes(['m_menu_id' => $Item->m_request_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                            }
                        }else{
                            $this->save_routes(['m_menu_id' => $Item->m_request_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                        } 
                    }

                }
                */

                //Update name of form payment
                if(isset($param['m_expense_item_id'])) $Item->m_expense_item_id = $param['m_expense_item_id'];
                if($Item->m_petition_status_id == 1){
                    $payment_name = $this->load_title($Item->id, $Item);
                    $Item->set(['name' => $payment_name])->save();
                }



                /*============================================
                 * Config Upload File
                 *============================================*/
                $today_dir = date('Ymd');
                if(\Input::file()){
                    $has_upload = true;
                    
                    if(empty($errors)){
                        try{
                            \File::read_dir(PAYMENTPATH . $today_dir, 0, null);
                        }catch(\FileAccessException $e){
                            \File::create_dir(PAYMENTPATH, $today_dir, 0777);
                        }
                        \Upload::process([
                            'path' => PAYMENTPATH . $today_dir . '/',
                            'max_size' => '5242880',
                            'ext_whitelist' => ['jpg', 'jpeg', 'gif', 'png', 'txt', 'csv', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'],
                            'suffix' => '_'.strtotime('now'). rand(0, 999),
                            'normalize' => true
                        ]);
                        $upload_valid = \Upload::is_valid();
                    }else{
                        $upload_valid = !$has_upload;
                    }
                }else{
                    $upload_valid = !($has_upload = false);
                }

                /*============================================
                 * Upload file & push to FTP
                 *============================================*/
                if($has_upload){
                    \Upload::save();
                    $ftp = \Ftp::forge();
                    $ftp->connect();
                    $temp = $ftp->list_files(FTPPAYMENTPATH . $today_dir);
                    if(!$ftp->list_files(FTPPAYMENTPATH . $today_dir)){
                        @$ftp->mkdir(FTPPAYMENTPATH . $today_dir . '/');
                    }
                    
                    foreach(\Upload::get_files() as $file) {
                        if(isset($param_files['uploads']) && array_search($file['file'], $param_files['uploads']['tmp_name']) !== false){
                            $key = array_search($file['file'], $param_files['uploads']['tmp_name']);
                            if($file['name'] === $param_files['uploads']['name'][$key] && $file['size'] == $param_files['uploads']['size'][$key]){

                                //==== Save into database t_form_attachment
                                $arrFiles = ['petition_id' => $Item->id,
                                            'petition_type' => 2, //form payment - 0.4
                                            'filename' => $file['name'],
                                            'filepath' => $today_dir . '/' . $file['saved_as'],
                                            ];
                                \Model_TFormAttachment::forge()->set($arrFiles)->save();
                            }
                        }
                        //==== Push to FTP
                        $ftp->upload(PAYMENTPATH . $today_dir . '/' . $file['saved_as'],FTPPAYMENTPATH . $today_dir . '/' . $file['saved_as'],'auto',0777);
                    }
                    $ftp->close();
                }

                //Delete file input - update item status
                if(isset($param['files_attach']) && !empty($param['files_attach'])){
                    $files_attach = json_decode($param['files_attach']);
                    if(!empty($files_attach)){
                        foreach ($files_attach as $file_status) {
                            if(isset($file_status->is_deleted) && $file_status->is_deleted){
                                \DB::update('t_form_attachment')->set(['item_status' => 'delete',
                                            'updated_date' => date('Y-m-d H:i:s'),
                                            'updated_user_id' => $user_info['id']])
                                        ->where('id', '=', $file_status->id)
                                        ->and_where('petition_type', '=', 2)
                                        ->and_where('petition_id', '=', $Item->id)
                                        ->execute();
                            }
                        }
                    }
                }

                //Copy Form attachment When copy Form
                if(isset($param['method']) && in_array($param['method'], $allow_copy) && !empty($param['upload_inputs'])){
                    //Get file attachment
                    $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath')
                                 ->from(['t_form_attachment', 'SM'])
                                 ->where('SM.petition_id', '=', $pk)
                                 ->and_where('SM.petition_type', '=', 2)
                                 ->and_where('SM.id', 'IN', array_keys($param['upload_inputs']))
                                 ->and_where('SM.item_status', '=', 'active');
                    $result_form_attach = $query->execute()->as_array('id');         
                    if(!empty($result_form_attach)){
                        foreach ($result_form_attach as $attachment) {
                            //==== Save into database t_form_attachment
                            $arrFiles = ['petition_id' => $Item->id,
                                        'petition_type' => 2, //form proposal - 0.2
                                        'filename' => $attachment['filename'],
                                        'filepath' => $attachment['filepath'],
                                        ];
                            \Model_TFormAttachment::forge()->set($arrFiles)->save();
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

    /*================================================
     * Save Route Of Form 
     * Input: m_menu_id, petition_id
     *================================================*/
    protected function save_routes($arrParam = null){
        $user_info = \Auth::get();
        $arrData = ['menu_type' => 'payment',
                    'm_menu_id' => $arrParam['m_menu_id'],
                    'm_department_id' => $user_info['active_m_department_id'],
                    'concurrent_post_flag' => $user_info['active_concurrent_post_flag'],
                    'm_user_id' => $user_info['id'],
                    'enable_date' => $arrParam['enable_date'],
                    'user_check' => 1];
        //======================== Begin Get Routes From Other API ===============================
        $api_res = json_decode($this->rest->request('system_approvalroutes/master_routes?' . http_build_query($arrData), 'get'));
        if($api_res->status == 'success'){
            if(!empty($api_res->data)){
                $i = 0;
                foreach ($api_res->data as $key => $value) {
                    $i++;
                    $m_approval_status_id = null;
                    if($i == 2) $m_approval_status_id = 1;
                    $dataRoutes = ['petition_id' => $arrParam['petition_id'],
                                    'petition_type' => 2,
                                    'm_user_id' => $value->m_user_id,
                                    'm_authority_id' => $value->m_authority_id,
                                    'm_approval_status_id' => null,
                                    'order' => $i,
                                    'resource_data' => $value->resource_data,
                                    'unit' => $value->unit,
                                    'is_read_comment' => 1,
                                    'notice_confirm_code' => 1,
                                    ];
                    \Model_TApprovalStatus::forge()->set($dataRoutes)->save();
                }
            }
        }
    }
    
    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table t_request
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_TRequest::softDelete($pk, array('item_status' => 'delete'));
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
     * Function get
     * Return withdrawal content code
     * Method get
     * Table m_expense_item
     * ID: 14 15 16
     *=============================================================*/
    public function get_withdrawal_contents_code(){
        $param          = \Input::param();
        $field_filters  = $this->table_field;
        $condition      = [];

        $select         = ['id', 'type_code', 'item_name_code', 'item', 'item_e'];
        $condition = array_merge($condition, [['id', 'IN', ['14', '15', '16']]]);
        $data = \Model_MExpenseItem::find('all', ['select' => $select, 'where' => $condition]);
        
        $default["0"] = ["type_code" => null,
                      "item_name_code" => null,
                      "item" => "-",
                      "item_e" => null];
        $data = $default + $data;                      
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
     * Function get refernce form
     * Return list form 
     * Method get
     * Table t_request
     * Input: m_request_menu_id
     *=============================================================*/
    public function get_reference_form(){
        $param          = \Input::param();
        $user_info = \Auth::get();
        $data      = [];
        if(isset($param['m_request_menu_id']) && !empty($param['m_request_menu_id'])){
            $m_request_menu_id = $param['m_request_menu_id'];

            if($m_request_menu_id == 5){ //200501
                $m_request_menu_id = 3; //200301
            }else if($m_request_menu_id == 4){ //200401
                $m_request_menu_id = 2; //200201
            }

            $query = \DB::select('SM.*')
                         ->from(['t_request', 'SM'])
                         ->join(['t_request_traveling_expenses', 'TRTE'], 'left')->on('TRTE.t_request_id', '=', 'SM.id')
                         ->where('TRTE.request_expenses_flg', '=', 0)
                         ->and_where('SM.item_status', '=', 'active')
                         ->and_where('SM.m_petition_status_id', 'IN', [2, 3]) //get form has petition_status in 01 02
                         ->and_where('SM.m_request_menu_id', '=', $m_request_menu_id)
                         ->and_where('SM.m_user_id', '=', $user_info['id'])
                         ;
            $data = $query->execute()->as_array();         
        }
        
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


    protected function load_title($request_id, $objParam = null){
       
        $user_info = \Auth::get();
        $title = '';


        $m_request_menu_id = $objParam->m_request_menu_id;
        switch($m_request_menu_id){
            case 1: //code 200101
                $transport = \Model_TRequestTransportSpec::find('first', [
                    'where' => ['t_request_id' => $request_id],
                    'order_by' => ['use_date' => 'asc']
                ]);

                $use_date = isset($transport->use_date)?$label = date(DISPLAY_DATE_MONTH_FORMAT, strtotime($transport->use_date)):null;
                
                if($transport && $objParam->destination){
                    $title = $use_date . '　' . $objParam->destination . '　交通費精算　' . $user_info['fullname'];
                }else{
                    if(empty($transport) && empty($objParam->destination)){
                        $title = '交通費精算　'.$user_info['fullname'];
                    }elseif(empty($transport)){
                        $title = $objParam->destination . '　交通費精算　' . $user_info['fullname'];
                    }else{
                        $title = $use_date . '　交通費精算　' . $user_info['fullname'];
                    }
                }
                $title .= '　' . $user_info['currency_symbol'] . number_format($objParam->settlement_amount);
                break;
            case 2: //code 200201
            case 3: //code 200301
                $type = ($m_request_menu_id == 2)?'事前出張申請(国内)':'事前出張申請(海外)';
                if(isset($objParam->departure_date) && !empty($objParam->departure_date)
                    && isset($objParam->destination) && !empty($objParam->destination)){
                    $title = date(DISPLAY_DATE_MONTH_FORMAT, strtotime($objParam->departure_date)) . '　' . $objParam->destination . '　' . $type . '　' . $user_info['fullname'];
                }else{
                    if(empty($objParam->departure_date) && empty($objParam->destination)){
                        $title = $type.'　'.$user_info['fullname'];
                    }elseif(empty($objParam->departure_date)){
                        $title = $objParam->destination.'　'.$type.'　'.$user_info['fullname'];
                    }else{
                        $title = date(DISPLAY_DATE_MONTH_FORMAT, strtotime($objParam->departure_date)) . '　' . $type . '　' . $user_info['fullname'];
                    }
                }
                break;
            case 4: //code 200401
            case 5: //code 200501
                $type = ($m_request_menu_id == 4)?'出張旅費精算(国内)':'出張旅費精算(海外)';
                if(isset($objParam->settlement_date) && !empty($objParam->settlement_date)
                    && isset($objParam->destination) && !empty($objParam->destination)){
                    $title = date(DISPLAY_DATE_MONTH_FORMAT,strtotime($objParam->settlement_date)).'　'.$objParam->destination.'　'.$type.'　'.$user_info['fullname'];
                }else{
                    if(empty($objParam->settlement_date) && empty($objParam->destination)){
                        $title = $type.'　'.$user_info['fullname'];
                    }elseif(empty($objParam->settlement_date)){
                        $title = $objParam->destination.'　'.$type.'　'.$user_info['fullname'];
                    }else{
                        $title = date(DISPLAY_DATE_MONTH_FORMAT, strtotime($objParam->settlement_date)).'　'.$type.'　'.$user_info['fullname'];
                    }
                }
                $title .= '　'.$user_info['currency_symbol'].number_format($objParam->settlement_amount);
                break;
            case 6: //code 200601
            case 8: //code 200801
            case 9: //code 200901
               
                $expense_item = \Model_MExpenseItem::find($objParam->m_expense_item_id);
                if($m_request_menu_id == 6 && $objParam->type == '2' ){
                    if($objParam->date){
                        $title = '【仮払】' . date(DISPLAY_DATE_MONTH_FORMAT, strtotime($objParam->date)) . '　' . $expense_item->item .'　'.$user_info['fullname'];
                    }else{
                        $title = '【仮払】　' . $expense_item->item . '　' . $user_info['fullname'];
                    }
                }else{  
                    $purchase = \Model_TPurchaseReceptionSpec::find('first', [
                        'where' => ['t_request_id' => $request_id],
                        'order_by' => ['reception_date' => 'asc']
                    ]);


                    
                    if($m_request_menu_id == 6){
                        $type = '購入精算';
                    }elseif($m_request_menu_id == 8){
                        $type = '飲食精算(社内)';
                    }else{
                        $type = '飲食精算(社外)';
                    }

                    if($purchase){
                        $title = date(DISPLAY_DATE_MONTH_FORMAT, strtotime($purchase->reception_date)) . '　' . $expense_item->item . '　' . $type . '　' . $user_info['fullname'];
                    }else{
                        $title = $expense_item->item . '　' . $type . '　' . $user_info['fullname'];
                    }
                    $title .= '　' . $user_info['currency_symbol'] . number_format($objParam->settlement_amount);
                }
                break;
        }
        return $title;
    }

    /*=============================================================
     * Author: Hoang Phong Phu
     * Function update column receipt_arrival
     * Method POST
     * Table t_request
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function post_update_receipt_arrival($pk){
        $param = \Input::param();
        $Item = \Model_TRequest::find($pk);

        if(empty($Item)){
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_NO_RECORD,
                        'message' => Exception::getMessage(Exception::E_NO_RECORD),
                        'record_id' => $pk];
        }else{
            $arrData['id'] = $param['id'];
            $arrData['receipt_arrival'] = $param['receipt_arrival'];
            //save data to t_request
            $Item->set($arrData)->save();

            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => Exception::E_UPDATE_SUCCESS,
                        'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS),
                        'record_id' => $Item->id];
        }

        return $this->response($response);
    }

    /*=============================================================
     * Author: Hoang Phong Phu
     * Function update column zenginkyo_output_hold_flg
     * Method POST
     * Table t_request
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function post_update_zenginkyo_output_hold_flg($pk){
        $param = \Input::param();
        $Item = \Model_TRequest::find($pk);

        if(empty($Item)){
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_NO_RECORD,
                        'message' => Exception::getMessage(Exception::E_NO_RECORD),
                        'record_id' => $pk];
        }else{
            $arrData['id'] = $param['id'];
            $hold_flg = $param['zenginkyo_output_hold_flg'];
            switch($hold_flg){
                case '0':
                case '1':
                    $arrData['zenginkyo_output_hold_flg'] = $hold_flg;
                    $msg = $hold_flg ? '振込データを保留しました。' : '振込データの保留を解除しました。';
                    break;
                case '-1':
                    $arrData['zenginkyo_output_prevent_flg'] = 1;
                    $arrData['zenginkyo_outeput_date'] = null;
                    $msg = '振込データを除外しました。';



                    /*==================================================
                     * Recheck If Has Form Finish => Update Status
                     *==================================================*/
                    $query = \DB::select('id')
                                ->from(['t_approval_status', 'SM'])
                                ->where('petition_id', '=', $Item->id)
                                ->and_where('petition_type', '=', 2)
                                ->and_where('m_authority_id', '!=', 1) //authority_code != 01 - create form
                                ->and_where_open()
                                ->and_where('m_approval_status_id', 'IN', [1, 3, 4, 7]) //m_approval_status_id NOT IN ("00", "02", "03", "30")
                                ->or_where('m_approval_status_id', 'IS', \DB::expr('null'))
                                ->or_where('m_approval_status_id', '=', '')
                                ->and_where_close();

                    $checkNotComplete = $query->execute()->current();

                    if(empty($checkNotComplete)){
                        //form 0.4 - proposal
                        //Update form finish => m_petition_status_id = 7 => m_petition_status_code = 90
                        if(!empty($Item->obic_outeput_date)){
                           $Item->set(['m_petition_status_id' => 7])->save();
                        }
                    }
                    break;
            }
            //save data to t_request
            $Item->set($arrData)->save();

            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => Exception::E_UPDATE_SUCCESS,
                        'message' => $msg,
                        'record_id' => $Item->id];
        }

        return $this->response($response);
    } 

    /*=============================================================
     * Author: Hoang Phong Phu
     * Function get link export list form
     * Method get
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_export_list_form(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/export/list_form_payment?p=' . base64_encode($build_query));
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

    /*=============================================================
     * Author: Hoang Phong Phu
     * Function get link export OBIC | FB
     * Method get
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_export_obic_fb(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        if($param['type'] == 10){
            $action = 'export_obic';
            //get forms have m_petition_status_id is 10 and obic_outeput_date is null
            $query = \DB::select('SM.id')
                ->from(['t_request','SM'])
                ->where('m_request_menu_id','NOT IN', [2,3])
                ->where('m_petition_status_id', '=', 10)
                ->where('obic_outeput_date', 'IS', \DB::expr('NULL'))
                ->where('item_status', '=', 'active')
                ->order_by('code','asc');
            $records = $query->execute()->as_array();
        }else{
            $action = 'export_fb';
            //get forms have m_petition_status_id is 11 and zenginkyo_outeput_date is null
            $query = \DB::select('SM.id')
                    ->from(['t_request','SM'])
                    ->where('SM.m_petition_status_id', 11)
                    ->and_where_open()
                    ->or_where('SM.obic_outeput_date', '!=', "")
                    ->or_where('SM.obic_outeput_date', 'IS NOT', \DB::expr('NULL'))
                    ->and_where_close()

                    ->and_where_open()
                    ->or_where('SM.zenginkyo_outeput_date', '=', "")
                    ->or_where('SM.zenginkyo_outeput_date', 'IS', \DB::expr('NULL'))
                    ->and_where_close()
                    ->where('SM.zenginkyo_output_hold_flg', 0)
                    ->where('SM.zenginkyo_output_prevent_flg', 0)
                    ->where('SM.item_status','active');
            $records = $query->execute()->as_array();
        }

        $url_download = \Uri::create('/client/obic/'. $action .'?p=' . base64_encode($build_query));
        $data['url'] = $url_download;
        $data['cid'] = array_column($records, 'id');

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