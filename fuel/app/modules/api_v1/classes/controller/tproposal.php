<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_TProposal extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_proposal';
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
    public function get_detail($pk){
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

        $select = ['SM.id', 'SM.copy_petition_id', 'SM.m_menu_id', 'SM.m_user_id', 'SM.m_user_concurrent_post_flag', 'SM.m_user_department_id',
                    'SM.m_petition_status_id', \DB::expr('MPS.name AS m_petition_status_name'),
                    'SM.code', 'SM.name', 'SM.date', 'SM.priority_flg', 'SM.change_route', 'SM.last_approve_user_id', 'SM.last_approve_date',
                    \DB::expr('MM.name AS menu_name'), \DB::expr('MM.code AS menu_code')];
        $query = \DB::select_array($select)
                     ->from([$this->main_table, 'SM'])
                     ->join(['m_menu', 'MM'], 'left')->on('SM.m_menu_id', '=', 'MM.id')
                     ->join(['m_petition_status', 'MPS'], 'left')->on('SM.m_petition_status_id', '=', 'MPS.id')
                     ->join(['t_approval_status', 'TAS'], 'left')->on('SM.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('1'))
                     ->where('SM.id', '=', $pk)
                     ->and_where('SM.item_status', '=', 'active');

        //return data when user in routes
        if(!$user_info['permission_system']){
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
                                            ->and_where('petition_type', '=', 1)
                                            ->and_where('m_user_id', '=', $user_info['id'])
                                            ->execute();
            //Get comment
            $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.date_time',  'SM.content', 'SM.parent', 'SM.level', 'SM.m_user_id', 'SM.item_status', 'MU.fullname')
                         ->from(['t_comment', 'SM'])
                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')    
                         ->where('SM.petition_id', '=', $pk)
                         ->and_where('SM.petition_type', '=', 1)
                         ->and_where('SM.item_status', 'IN', ['active', 'client_delete'])
                         ->order_by('SM.id', 'ASC')
                         ->order_by('SM.date_time', 'ASC');
            $result = $query->execute()->as_array();      
            $comments = $recursive->buildComment($result, 0);   
            $data['comments'] = $comments;


            //Get file inputs
            $query = \DB::select('SM.id', 'SM.m_input_id', 'SM.value', \DB::expr('MI.name AS m_input_name'), 'MI.m_input_type_id', \DB::expr('MIT.name_e AS input_type_name_e'))
                         ->from(['t_proposal_input', 'SM'])
                         ->join(['m_input', 'MI'], 'left')->on('MI.id', '=', 'SM.m_input_id')
                         ->join(['m_input_type', 'MIT'], 'left')->on('MIT.id', '=', 'MI.m_input_type_id')
                         ->where('SM.t_proposal_id', '=', $pk)
                         ->and_where('SM.item_status', '=', 'active');
            $result = $query->execute()->as_array('m_input_id');         
            $data['inputs'] = $result;

            //Get file attachment
            $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath', 'area_upload')
                         ->from(['t_form_attachment', 'SM'])
                         ->where('SM.petition_id', '=', $pk)
                         ->and_where('SM.petition_type', '=', 1)
                         ->and_where('SM.item_status', '=', 'active');
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
                         ->and_where('SM.petition_type', '=', 1)
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
                $recursive->getCopyPetition($data['copy_petition_id'], 1, $copy_petition);
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
     * Table t_proposal
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
        $validation->add_field('m_menu_id',__('Menu ID', [], 'Menu ID'),'required');
        $validation->add_field('name',__('Name', [], 'Name'),'required');
            
        //Check method allow copy data
        $allow_copy = ['copy'];


        // echo '<pre>';
        // print_r($param);
        // echo '</pre>';
        // die;

        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?trim($value):null;

                switch ($key) {
                    case 'date':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d', strtotime($value)):null;
                        break;
                }

                $arrData[$key] = $value;
            }



            //======================== Default Data =================
            $Item = empty($pk)?\Model_TProposal::forge():\Model_TProposal::find($pk);
            if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                $Item = \Model_TProposal::forge();
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
                    //Create new form proposal

                    //Copy form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $code = \Model_TProposal::get_last_proposal_code(['menu_code' => $param['m_menu_code']]);

                        $arrData['m_user_concurrent_post_flag'] = !is_null($user_info['active_concurrent_post_flag'])?$user_info['active_concurrent_post_flag']:0; //detect department of user create form
                        $arrData['m_user_department_id'] = !empty($user_info['active_m_department_id'])?$user_info['active_m_department_id']:null; //detect department of user create form
                        $arrData['code'] = $code; //get petition_code
                        $arrData['m_petition_status_id'] = 1; //draft
                    }
                }else{
                    //Create new form proposal
                    $code = \Model_TProposal::get_last_proposal_code(['menu_code' => $param['m_menu_code']]);
                    $arrData['m_user_concurrent_post_flag'] = !is_null($user_info['active_concurrent_post_flag'])?$user_info['active_concurrent_post_flag']:0; //detect department of user create form
                    $arrData['m_user_department_id'] = !empty($user_info['active_m_department_id'])?$user_info['active_m_department_id']:null; //detect department of user create form
                    $arrData['code'] = $code; //get petition_code
                    $arrData['m_petition_status_id'] = 1; //draft
                }
                //save data to t_proposal
                $Item->set($arrData)->save();


                $inputs = json_decode($param['inputs']);
                if(!empty($inputs)){
                    //=================== Update All Input Delete Before Save ================
                    \DB::update('t_proposal_input')->set(['item_status' => 'delete',
                                                        'deleted_date' => date('Y-m-d H:i:s'),
                                                        'deleted_user_id' => \Auth::get('id')])
                                                    ->where('t_proposal_id', '=', $Item->id)
                                                    ->execute();
                    foreach ($inputs as $obj) {
                        $data_value = isset($obj->value)?$obj->value:null;


                        switch ($obj->input_type_id) {
                            case 2: //checkbox
                                // $data_value = json_decode($data_value, true);
                                $key = array_search('その他', $data_value);
                                if($key !== false){
                                    $data_value[$key] = isset($obj->other)?$obj->other:null;
                                }
                                break;
                            case 3: //radio button
                            case 6: //select box
                                if('その他' == $data_value){
                                    $data_value = isset($obj->other)?$obj->other:null;
                                }
                                break;
                        }

                        if(is_array($data_value)){
                            $data_value = json_encode($data_value);
                        }
                        $iData = ['t_proposal_id' => $Item->id,
                                    'm_input_id' => $obj->m_input_id,
                                    'value' => $data_value,
                                    'item_status' => 'active'
                                    ]; 
                        $ObjMI = !isset($obj->id)?\Model_TProposalInput::forge():\Model_TProposalInput::find($obj->id);
                        //Create New input Element When copy Form
                        if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                            $ObjMI = \Model_TProposalInput::forge();
                        }
                        if(!empty($ObjMI)){ 
                            $ObjMI->set($iData)->save();
                        }
                    }
                }

                /*============================================
                 * Config Upload File
                 *============================================*/
                $today_dir = date('Ymd');
                if(\Input::file()){
                    $has_upload = true;
                    
                    if(empty($errors)){
                        try{
                            \File::read_dir(PROPOSALPATH . $today_dir, 0, null);
                        }catch(\FileAccessException $e){
                            \File::create_dir(PROPOSALPATH, $today_dir, 0777);
                        }
                        \Upload::process([
                            'path' => PROPOSALPATH . $today_dir . '/',
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
                    $temp = $ftp->list_files(FTPPROPOSALPATH . $today_dir);
                    if(!$ftp->list_files(FTPPROPOSALPATH . $today_dir)){
                        @$ftp->mkdir(FTPPROPOSALPATH . $today_dir . '/');
                    }
                    
                    foreach(\Upload::get_files() as $file) {
                        if(isset($param_files['uploads']) && array_search($file['file'], $param_files['uploads']['tmp_name']) !== false){
                            $key = array_search($file['file'], $param_files['uploads']['tmp_name']);
                            if($file['name'] === $param_files['uploads']['name'][$key] && $file['size'] == $param_files['uploads']['size'][$key]){

                                //==== Save into database t_form_attachment
                                $arrFiles = ['petition_id' => $Item->id,
                                            'petition_type' => 1, //form proposal - 0.2
                                            'filename' => $file['name'],
                                            'filepath' => $today_dir . '/' . $file['saved_as'],
                                            ];
                                \Model_TFormAttachment::forge()->set($arrFiles)->save();
                            }
                        }

                        if(isset($param_files['upload_inputs']) && array_search($file['file'], $param_files['upload_inputs']['tmp_name']) !== false){
                            $key = array_search($file['file'], $param_files['upload_inputs']['tmp_name']);
                            if($file['name'] == $param_files['upload_inputs']['name'][$key] && $file['size'] == $param_files['upload_inputs']['size'][$key]){
                                //==== Save into database file input
                                $data_value = ['filename' => $file['name'],
                                                'filepath' => $today_dir . '/' . $file['saved_as']];
                                $iData = ['t_proposal_id' => $Item->id,
                                            'm_input_id' => $key, 
                                            'value' => json_encode($data_value)
                                            ]; 
                                // $ObjMI = !isset($obj->id)?\Model_TProposalInput::forge():\Model_TProposalInput::find($obj->id);
                                $ObjMI = \Model_TProposalInput::forge();
                                if(!empty($ObjMI)){ 
                                    $ObjMI->set($iData)->save();
                                }
                            }
                        }
                        

                        //==== Push to FTP
                        $ftp->upload(PROPOSALPATH . $today_dir . '/' . $file['saved_as'],FTPPROPOSALPATH . $today_dir . '/' . $file['saved_as'],'auto',0777);
                    }
                    $ftp->close();
                }


                //Get master route and save database t_approval_status
                //Get master route and save database t_approval_status
                if(empty($pk) || (isset($param['method']) && in_array($param['method'], $allow_copy))){
                    $this->save_routes(['m_menu_id' => $Item->m_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                }
                
                /*
                if(empty($pk)){
                    $this->save_routes(['m_menu_id' => $Item->m_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                }else{
                    //Copy Routes When copy Form
                    if(isset($param['method']) && in_array($param['method'], $allow_copy)){
                        $FormCopyDetail = \Model_TProposal::find($pk);
                        if(!empty($FormCopyDetail) && $Item->m_user_id == $FormCopyDetail->m_user_id){
                            //Get old list routes
                            $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.m_user_id', 'SM.m_authority_id', \DB::expr('MA.name AS authority_name'), 'SM.m_approval_status_id', 'SM.approval_datetime', 'SM.order', 'SM.resource_data', 'SM.unit',
                                            'MU.fullname')
                                         ->from(['t_approval_status', 'SM'])
                                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                                         ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'SM.m_authority_id')
                                         ->where('SM.petition_id', '=', $pk)
                                         ->and_where('SM.petition_type', '=', 1)
                                         ->and_where('SM.item_status', '=', 'active')
                                         ->and_where('SM.m_authority_id', '!=', 1) //remove old user create form
                                         ->order_by('SM.order', 'ASC');
                            $result_routes = $query->execute()->as_array(); 
                            if(!empty($result_routes)){
                                //Add User Create Form
                                $dataRoutes = ['petition_id' => $Item->id,
                                                'petition_type' => 1,
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
                                                    'petition_type' => 1,
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
                                $this->save_routes(['m_menu_id' => $Item->m_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                            }
                        }else{
                            $this->save_routes(['m_menu_id' => $Item->m_menu_id, 'petition_id' => $Item->id, 'enable_date' => $Item->date]);
                        }       
                    }

                }
                */

                
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
                                        ->and_where('petition_type', '=', 1)
                                        ->and_where('petition_id', '=', $Item->id)
                                        ->execute();
                            }
                        }
                    }
                }


                //Copy Form attachment When copy Form
                //$param['upload_inputs']
                //$param['upload_inputs']
                // echo '<pre>';
                // print_r($param['upload_inputs']);
                // echo '</pre>';
                if(isset($param['method']) && in_array($param['method'], $allow_copy) && !empty($param['files_attach'])){
                    $result_form_attach = [];
                    $files_attach = json_decode($param['files_attach'], true);
                    $files_attach_keys = array_keys($files_attach);
                    //Get file attachment
                    if(!empty($files_attach_keys)){
                        $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath')
                                     ->from(['t_form_attachment', 'SM'])
                                     ->where('SM.petition_id', '=', $pk)
                                     ->and_where('SM.petition_type', '=', 1)
                                     ->and_where('SM.id', 'IN', $files_attach_keys)
                                     ->and_where('SM.item_status', '=', 'active');
                        $result_form_attach = $query->execute()->as_array('id'); 
                    }

                    if(!empty($result_form_attach)){
                        foreach ($result_form_attach as $attachment) {
                            if(!isset($files_attach[$attachment['id']]['is_deleted']) || $files_attach[$attachment['id']]['is_deleted'] != 1){
                                //==== Save into database t_form_attachment
                                $arrFiles = ['petition_id' => $Item->id,
                                            'petition_type' => 1, //form proposal - 0.2
                                            'filename' => $attachment['filename'],
                                            'filepath' => $attachment['filepath'],
                                            ];
                                \Model_TFormAttachment::forge()->set($arrFiles)->save();            
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

    /*================================================
     * Save Route Of Form 
     * Input: m_menu_id, petition_id
     *================================================*/
    protected function save_routes($arrParam = null){
        $user_info = \Auth::get();
        $arrData = ['menu_type' => 'menu',
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
                    $dataRoutes = ['petition_id' => $arrParam['petition_id'],
                                    'petition_type' => 1,
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
     * Table t_proposal
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_TProposal::softDelete($pk, array('item_status' => 'delete'));
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
    
}