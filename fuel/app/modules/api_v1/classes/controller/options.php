<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_Options extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'options';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get all data
     * Method GET
     * Table options
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_all(){
        $param = \Input::param();
        $data     = \Model_Options::getAll($param);

        foreach($data as $k => $v){
            // //generate image url
			if($v->key == 'logo'){
	            $logo = json_decode($v->value);
	            $data[$k]->logo_url = isset($logo->filepath)? \Uri::create(FILESURL . OPTIONS_DIR . $logo->filepath):null;
			}

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

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get detail form information
     * Method GET
     * Table options
     * Single data
     * Input $pk - primary key
     * Response data: status[success|error], total[total_record], data[single|array]
     *=============================================================*/
    public function get_detail($pk = null){
        $pk = intval($pk);
        $param = \Input::param();

        $data = \Model_Options::getDetail($pk, $param);

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
     * Table options
     * fullname, phone, date have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();

        $validation = \Validation::forge();
        $validation->add_callable('MyRules');

        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '' && $value != 'undefined' && $value != 'null')?trim($value):null;

                $arrData[$key] = $value;
            }

			if(!empty($param['options'])){
				foreach ($param['options'] as $key => $value) {
					//======================== Default Data =================
					try{
						\DB::start_transaction();
			            $obj = \Model_Options::find('first', ['where' => ['key' => $key, 'language_code' => $param['language_code']]]);
						$arrData['value'] = $value = (!is_null($value) && $value != '' && $value != 'undefined' && $value != 'null')?trim($value):null;


						if($key == 'logo'){
							/*============================================
			                 * Config Upload File
			                 *============================================*/
			                $today_dir = date('Ymd');
			                $folder_name = OPTIONS_DIR;

			                if(\Input::file()){
			                    $has_upload = true;

			                    if(empty($errors)){
			                        try{
			                            \File::read_dir(FILESPATH . $folder_name . $today_dir, 0, null);
			                        }catch(\FileAccessException $e){
			                            \File::create_dir(FILESPATH  . $folder_name, $today_dir, 0777);
			                        }
			                        \Upload::process([
			                            'path' => FILESPATH . $folder_name . $today_dir . '/',
			                            'max_size' => '10485760',
			                            'ext_whitelist' => ['jpg', 'jpeg', 'gif', 'png'],
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
			                 * Upload file
			                 *============================================*/
							$arrUploadImage = [];
			                if($has_upload){
			                    \Upload::save();
			                    foreach(\Upload::get_files() as $file) {
			                        //==== Save into database
			                        $arrFiles = ['filename' => $file['name'],
			                                     'filepath' => $today_dir . '/' . $file['saved_as']];
			                        break;
			                    }
			 					//Now just save first image
			 					$arrUploadImage = $arrFiles;
			                }

							if(!empty($param['current_logo']) && $param['current_logo'] != 'null'){
								$current_logos = json_decode($param['current_logo']);
								$arr_current_logos = [];
								// foreach ($current_logos as $k => $v) {
									if(isset($current_logos->filename) && isset($current_logos->filepath)){
										$arr_current_logos = ['filename' => $current_logos->filename,
				                                    			'filepath' => $current_logos->filepath];
									}
								// }
								if(!empty($arr_current_logos)){
									$arrUploadImage = $arr_current_logos;
								}
								// $arrUploadImage = array_values($arrUploadImage);
							}
							$arrData['value'] = json_encode($arrUploadImage);
						}


						!empty($obj) && $obj->set($arrData)->save();
						\DB::commit_transaction();
					} catch (\Exception $e) {
				      	\DB::rollback_transaction();
				    }
				}
			}

            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => !empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS,
                        'message' => Exception::getMessage(!empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS),
                        'record_id' => $obj->id,
                        'data' => $obj];
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
     * Table options
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
			try{
				\DB::start_transaction();
	            $result = \Model_Options::softDelete($pk, array('item_status' => 'delete'));
				\DB::commit_transaction();
			} catch (\Exception $e) {
		      	\DB::rollback_transaction();
				/*==================================================
	             * Response Data
	             *==================================================*/
	            $response = ['status' => 'error',
	                        'code' => Exception::E_UNEXPECTED_ERR,
	                        'message' => Exception::getMessage(Exception::E_UNEXPECTED_ERR),
	                        'error' => $e->getMessage()];
				return $this->response($response);
		    }

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
     * Function delete a record based on item_key
     * Update status record to 'delete'
     * Method DELETE
     * Table options
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_item_key($item_key = null){
        $Ids = $result = [];
        if(!empty($item_key)){
            try{
                \DB::start_transaction();

                $items = \Model_Options::find('all', ['select' => ['id'], 'where' => ['item_key' => $item_key]]);

                if(!empty($items)){
                    foreach ($items as $val) {
                        $Ids[] = $val->id;
                        $result = \Model_Options::softDelete($val->id, array('item_status' => 'delete'));
                    }
                }
                \DB::commit_transaction();
            } catch (\Exception $e) {
                \DB::rollback_transaction();
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_UNEXPECTED_ERR,
                            'message' => Exception::getMessage(Exception::E_UNEXPECTED_ERR),
                            'error' => $e->getMessage()];
                return $this->response($response);
            }

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
                    'record_id' => $Ids];
        return $this->response($response);
    }
}
