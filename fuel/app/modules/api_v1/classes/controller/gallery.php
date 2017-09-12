<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_Gallery extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'gallery';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get all data
     * Method GET
     * Table gallery
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_all(){
        $param = \Input::param();
        $data     = \Model_Gallery::getAll($param);

		foreach($data as $k => $v){
            //generate image url
            $image = json_decode($v->image);
			$arrImageUrl = [];
			if(!empty($image)){
				foreach ($image as $img) {
					$param_img = ['filepath' => isset($img->filepath)? base64_encode(GALLERY_DIR . $img->filepath): null,
		                            'filename' => isset($img->filename)? base64_encode($img->filename): null
		                            ];
					isset($param['image_resize_width']) && !empty($param['image_resize_width'])	&& $param_img['width'] = $param['image_resize_width'];
					isset($param['image_resize_square']) && !empty($param['image_resize_square']) && $param_img['square'] = $param['image_resize_square'];

					//Last param
					$param_img['file_extentsion'] = isset($img->filepath)? '.' . pathinfo($img->filepath, PATHINFO_EXTENSION): null;
					$arrImageUrl[] = \Uri::create('api/v1/system_general/image', [], $param_img);
				}
			}

            $data[$k]->image_url = $arrImageUrl;
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
     * Table gallery
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
		$param = \Input::param();
        $result     = \Model_Gallery::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];

		foreach($items as $k => $v){
            $image = json_decode($v['image']);
            $items[$k]['total_image'] = count($image);
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
     * Table gallery
     * Single data
     * Input $pk - primary key
     * Response data: status[success|error], total[total_record], data[single|array]
     *=============================================================*/
    public function get_detail($pk = null){
        $pk = intval($pk);
        $param = \Input::param();

        $data = \Model_Gallery::getDetail($pk, $param);

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
     * Table gallery
     * fullname, phone, date have to require|unique
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
                $value = (!is_null($value) && $value != '' && $value != 'undefined' && $value != 'null')?trim($value):null;

                $arrData[$key] = $value;
            }



            //======================== Default Data =================
			try{
				\DB::start_transaction();
	            $obj = empty($pk)?\Model_Gallery::forge():\Model_Gallery::find($pk);

				//Generate random item key
				empty($pk) && !isset($arrData['item_key']) && $arrData['item_key'] = \Vision_Common::randomItemKey();

				/*============================================
                 * Config Upload File
                 *============================================*/
                $today_dir = date('Ymd');
                $folder_name = GALLERY_DIR;

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
                        $arrFiles[] = ['filename' => $file['name'],
                                    'filepath' => $today_dir . '/' . $file['saved_as']];
                    }
					//Now just save first image
					$arrUploadImage = $arrFiles;
                }

				if(!empty($pk)){
					if(!empty($param['current_image']) && $param['current_image'] != 'null'){
						$current_images = json_decode($param['current_image']);
						$arr_current_images = [];
						foreach ($current_images as $k => $v) {
							if(isset($v->filename) && isset($v->filepath)){
								$arr_current_images[] = ['filename' => $v->filename,
		                                    			'filepath' => $v->filepath];
							}
						}
						$arrUploadImage = array_merge($arr_current_images, $arrUploadImage);
						$arrUploadImage = array_values($arrUploadImage);
					}

				}
				$arrData['image'] = json_encode($arrUploadImage);

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
     * Table gallery
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
			try{
				\DB::start_transaction();
	            $result = \Model_Gallery::softDelete($pk, array('item_status' => 'delete'));
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
     * Table gallery
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_item_key($item_key = null){
        $Ids = $result = [];
        if(!empty($item_key)){
            try{
                \DB::start_transaction();

                $items = \Model_Gallery::find('all', ['select' => ['id'], 'where' => ['item_key' => $item_key]]);

                if(!empty($items)){
                    foreach ($items as $val) {
                        $Ids[] = $val->id;
                        $result = \Model_Gallery::softDelete($val->id, array('item_status' => 'delete'));
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
