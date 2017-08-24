<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_TFormAttachment extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_form_attachment';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }


    /*=============================================================
     * Author: Phan Ngoc Minh Luan
     * Function insert record into table
     * Method POST
     * Table t_form_attachment
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $param_files = \Input::file();
        $user_info = \Auth::get();


        $upload_path = PROPOSALPATH;
        $ftp_upload_path = FTPPROPOSALPATH;
        if(isset($param['petition_type']) && $param['petition_type'] == 2){
            $upload_path = PAYMENTPATH;
            $ftp_upload_path = FTPPAYMENTPATH;
        }

        /*============================================
         * Config Upload File
         *============================================*/
        $today_dir = date('Ymd');
        if(\Input::file()){
            $has_upload = true;
            
            if(empty($errors)){
                try{
                    \File::read_dir($upload_path . $today_dir, 0, null);
                }catch(\FileAccessException $e){
                    \File::create_dir($upload_path, $today_dir, 0777);
                }
                \Upload::process([
                    'path' => $upload_path . $today_dir . '/',
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
            $temp = $ftp->list_files($ftp_upload_path . $today_dir);
            if(!$ftp->list_files($ftp_upload_path . $today_dir)){
                @$ftp->mkdir($ftp_upload_path . $today_dir . '/');
            }
            
            foreach(\Upload::get_files() as $file) {
                if(isset($param_files['uploads']) && array_search($file['file'], $param_files['uploads']['tmp_name']) !== false){
                    $key = array_search($file['file'], $param_files['uploads']['tmp_name']);
                    if($file['name'] === $param_files['uploads']['name'][$key] && $file['size'] == $param_files['uploads']['size'][$key]){

                        //==== Save into database t_form_attachment
                        $arrFiles = ['petition_id' => $param['petition_id'],
                                    'petition_type' => $param['petition_type'],
                                    'filename' => $file['name'],
                                    'filepath' => $today_dir . '/' . $file['saved_as'],
                                    'area_upload' => 'addition' // For case upload addition
                                    ];
                        \Model_TFormAttachment::forge()->set($arrFiles)->save();
                    }
                }

            
                

                //==== Push to FTP
                $ftp->upload($upload_path . $today_dir . '/' . $file['saved_as'],$ftp_upload_path . $today_dir . '/' . $file['saved_as'],'auto',0777);
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
                                ->and_where('petition_type', '=', $param['petition_type'])
                                ->and_where('petition_id', '=', $param['petition_id'])
                                ->execute();
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
                    'record_id' => $param['petition_id']];
    
        return $this->response($response);
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