<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_Staff extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'staff';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get all data
     * Method GET
     * Table staff
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_all(){
        $param = \Input::param();
        $data     = \Model_Staff::getAll($param);

        foreach($data as $k => $v){
            //generate image url
            $image = json_decode($v->image);
            $param_img = ['filepath' => isset($image->filepath)? base64_encode(STAFF_DIR . $image->filepath): null,
                            'filename' => isset($image->filename)? base64_encode($image->filename): null,
                            'width' => 300,
                            ];
            $data[$k]->image_url = \Uri::create('api/v1/system_general/image', [], $param_img);
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
     * Function get data for datatable
     * Method GET
     * Table staff
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_Staff::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];

        foreach($items as $k => $v){
            //generate image url
            $image = json_decode($v['image']);
            $param_img = ['filepath' => isset($image->filepath)? base64_encode(STAFF_DIR . $image->filepath): null,
                            'filename' => isset($image->filename)? base64_encode($image->filename): null,
                            'width' => 300,
                            ];
            $items[$k]['image_url'] = \Uri::create('api/v1/system_general/image', [], $param_img);
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
     * Function get detail form information
     * Method GET
     * Table staff
     * Single data
     * Input $pk - primary key
     * Response data: status[success|error], total[total_record], data[single|array]
     *=============================================================*/
    public function get_detail($pk = null){
        $pk = intval($pk);
        $param = \Input::param();

        $data = \Model_Staff::getDetail($pk, $param);

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
     * Table staff
     * fullname, phone, date have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();

        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('fullname',__('Fullname', [], 'Fullname'),'required');
        $validation->add_field('language_code',__('Language', [], 'Language'),'required');


        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?trim($value):null;

                $arrData[$key] = $value;
            }

            //======================== Default Data =================
			try{
				\DB::start_transaction();
	            $obj = empty($pk)?\Model_Staff::forge():\Model_Staff::find($pk);

				//Generate random item key
				empty($pk) && !isset($arrData['item_key']) && $arrData['item_key'] = \Vision_Common::randomItemKey();

                /*============================================
                 * Config Upload File
                 *============================================*/
                $today_dir = date('Ymd');
                $folder_name = STAFF_DIR;
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
                            'max_size' => '5242880',
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
                if($has_upload){
                    \Upload::save();

                    foreach(\Upload::get_files() as $file) {
                        //==== Save into database
                        $arrFiles = ['filename' => $file['name'],
                                    'filepath' => $today_dir . '/' . $file['saved_as']];

                        //Now just save first image
                        $arrData['image'] = json_encode($arrFiles);
                        break;
                    }
                }

				!empty($obj) && $obj->set($arrData)->save();
				\DB::commit_transaction();

				if(empty($obj)){
					$response = ['status' => 'error',
		                        'code' => Exception::E_NO_RECORD,
		                        'message' => Exception::getMessage(Exception::E_NO_RECORD)];
					return $this->response($response);
				}
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
     * Table staff
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
			try{
				\DB::start_transaction();
	            $result = \Model_Staff::softDelete($pk, array('item_status' => 'delete'));
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
     * Table staff
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_item_key($item_key = null){
        $Ids = $result = [];
        if(!empty($item_key)){
            try{
                \DB::start_transaction();

                $items = \Model_Staff::find('all', ['select' => ['id'], 'where' => ['item_key' => $item_key]]);

                if(!empty($items)){
                    foreach ($items as $val) {
                        $Ids[] = $val->id;
                        $result = \Model_Staff::softDelete($val->id, array('item_status' => 'delete'));
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
