<?php
/**
 * @Author: l_phan
 * @Date:   2017-02-23 11:44:57
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:25
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MImportUserDepartment extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'm_import_user_department';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Phan Ngoc Minh Luan
     * Function get basic data of group
     * Method GET
     * Table m_import_user_department
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

		$query->group_by('SM.m_user_id', 'SM.enable_start_date', 'SM.concurrent_post_flag');
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

        if(!empty($data)){
            foreach ($data as $key => $value) {
                $mainDepartment = \Model_MUserDepartment::getCurrentDepartment($value['m_user_id']);
                $data[$key]['staff_name'] = $value['fullname'];
                $data[$key]['m_company_id'] = $mainDepartment['m_company_id'];
                $data[$key]['company_name'] = $mainDepartment['company_name'];
                $data[$key]['m_position_id'] = $mainDepartment['m_position_id'];
                $data[$key]['position_name'] = $mainDepartment['position_name'];
                $data[$key]['department_id'] = $mainDepartment['department_id'];
                $data[$key]['department_code'] = $mainDepartment['department_code'];
                $data[$key]['department_name'] = $mainDepartment['department_name'];
                $data[$key]['division_id'] = $mainDepartment['division_id'];
                $data[$key]['division_name'] = $mainDepartment['division_name'];
                $data[$key]['business_id'] = $mainDepartment['business_id'];
                $data[$key]['business_name'] = $mainDepartment['business_name'];
            }
        }

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
     * Author: Phan Ngoc Minh Luan
     * Function insert record into table
     * Method POST
     * Table m_import_user_department
     * name have to require|unique
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
                $value = !empty($value)?$value:null;
                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $Item = empty($pk)?\Model_MImportUserDepartment::forge():\Model_MImportUserDepartment::find($pk);
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
     * Author: Phan Ngoc Minh Luan
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table m_import_user_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_MImportUserDepartment::softDelete($pk, array('item_status' => 'delete'));
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
     * Author: Phan Ngoc Minh Luan
     * Function get data for datatable
     * Method GET
     * Table m_import_user_department
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_MImportUserDepartment::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
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
     * Author: Phan Ngoc Minh Luan
     * Function insert record into table
     * Method POST
     * Table m_import_user_department
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_import_user_department(){
        $param = \Input::param();
		$list_user_department = json_decode($param['list_user_department']);
		$arr_user_department = [];
		// Convert into array m_user_id with enable_start_date
		foreach ($list_user_department as $key => $value) {
			$concurrent_post_flag = (isset($value->concurrent_post_flag) && !empty($value->concurrent_post_flag))?$value->concurrent_post_flag:0;
			$arr_user_department[$value->m_user_id][$value->enable_start_date . $concurrent_post_flag] = $value;
		}

		foreach ($arr_user_department as $key => $user_department) {
			$arrData = ['m_user_id' => $key,
	                    'item_status' => 'active'
	                    ];
			$url = 'master_muserdepartment/index?' . http_build_query($arrData);
			$api_res = json_decode($this->rest->request($url, 'get'));

			if($api_res->status == 'success') {
				$data = json_decode(json_encode($api_res->data));
				foreach ($user_department as $k => $val) {
					$checkExist = [];
					foreach ($data as $val_check) {
						if($val_check->enable_start_date == $val->enable_start_date
							&& ($val_check->concurrent_post_flag == 0 || empty($val_check->concurrent_post_flag))
							&& ($val->concurrent_post_flag == 0 || empty($val->concurrent_post_flag))
						){
							$checkExist = $val;
							break;
						}
					}


					if(empty($checkExist)){
						array_push($data, $val);
					}else{
						if(isset($val->m_iud_id) && !empty($val->m_iud_id)){
							$arrData = ['item_status' => 'save'];
				            $obj = \Model_MImportUserDepartment::find($val->m_iud_id);
				            $obj->set($arrData)->save();
						}
					}
				}
				$res = \Model_MUserDepartment::processUserDepartment($data);
				foreach ($res as $k => $val) {

					// Common params
					$arrData = [];
					foreach ($val as $i => $v) {
						$v = !empty($v)?$v:null;
						$arrData[$i] = $v;
					}
					$arrData['concurrent_post_flag'] = isset($val->concurrent_post_flag) && $val->concurrent_post_flag ? '1' : '0';
					// Saving m_import_user_department data
					if(isset($val->m_iud_id)) {
			            //======================== Default Data =================
						$arrData['item_status'] = 'save';
			            $Item = \Model_MImportUserDepartment::find($val->m_iud_id);
			            $Item->set($arrData)->save();
					}else{
						//======================== Default Data =================
						unset($arrData['id']);
						$arrData['item_status'] = 'save';
			            $Item = \Model_MImportUserDepartment::forge();
			            $Item->set($arrData)->save();
					}

					// Saving m_user_department
					$arrData['item_status'] = 'active';
					$pk = isset($val->id)? $val->id: null;
					$Item = empty($pk)?\Model_MUserDepartment::forge():\Model_MUserDepartment::find($pk);
					$Item->set($arrData)->save();
				}

				$response = ['status' => 'success',
							'code' => Exception::E_UPDATE_SUCCESS,
							'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS)];
			} else {
				/*==================================================
	             * Response Data
	             *==================================================*/
	            $response = ['status' => 'error',
	                        'code' => Exception::E_VALIDATE_ERR,
	                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
	                        'error' => $validation->error_message()];
			}
		}

		return $this->response($response);

    }
}
