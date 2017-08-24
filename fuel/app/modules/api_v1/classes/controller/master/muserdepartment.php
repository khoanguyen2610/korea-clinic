<?php
/**
 * @Author: l_phan
 * @Date:   2017-02-23 11:44:57
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-05-05 13:57:42
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_Master_MUserDepartment extends \Controller_API {
	public function before() {
		parent::before();
		$this->main_table = 'm_user_department';
		$columns = \DB::list_columns($this->main_table);
		$this->table_field = array_keys($columns);
	}

	/*=============================================================
	 * Author: Hoang Phong Phu
	 * Function insert record into table
	 * Method POST
	 * Table m_user_department
	 * name have to require|unique
	 * Response data: status[success|error], message[Created OK|Validation]
	 *=============================================================*/
    public function post_change_user_department($pk = null){
		$param = \Input::param();
		$validation = \Validation::forge();
		$validation->add_field('m_department_id',__('Department', [], 'Department'),'required');
		$validation->add_field('enable_date',__('Enable Date', [], 'Enable Date'),'required');
		$validation->add_field('m_user_department',__('User Department', [], 'User Department'),'required');

		if($validation->run()){
			$ids = [];
			$enable_date = date('Y-m-d', strtotime($param['enable_date']));
			$end_date = date('Y-m-d',strtotime('-1 day',strtotime($enable_date)));
			$arrData = ['enable_end_date' => $end_date];
			$mud = json_decode($param['m_user_department'],true);
			foreach($mud as $item){
				$query = \DB::select()
							->from([$this->main_table,'SM'])
							->where('SM.m_user_id','=',$item['m_user_id'])
							->where('SM.m_department_id','=',$item['m_department_id'])
							->where('SM.m_position_id','=',$item['m_position_id'])
							->and_where_open()
								->where('SM.enable_start_date', '<', $enable_date)
								->where('SM.enable_end_date', 'IS', \DB::expr('NULL'))
							->and_where_close();
				$current_mud = $query->execute()->current();
				//update enable_end_date to old department
				if($current_mud){
					$obj = \Model_MUserDepartment::find($current_mud['id']);
					$obj->set($arrData)->save();
				}

				//insert new user department
				$new_mud = \Model_MUserDepartment::forge();
				$new_mud->set([
					'm_user_id' => $item['m_user_id'],
                 	'fullname' => $item['fullname'],
					'fullname_kana' => $item['fullname_kana'],
					'staff_no' => $item['staff_no'],
					'm_department_id' => $param['m_department_id'],
					'm_position_id' => $item['m_position_id'],
					'enable_start_date' => $enable_date
				])->save();

				$ids[] = $new_mud->id;
			}

			/*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => Exception::E_CREATE_SUCCESS,
                        'message' => Exception::E_CREATE_SUCCESS,
                        'record_id' => $ids];
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
                        case 'm_user_id':
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
        }else{
            $query->limit($limit)->offset($offset);
            $data = $query->execute()->as_array();
        }

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
        $validation->add_field('staff_no',__('Staff No', [], 'Staff No'),'required');
        $validation->add_field('fullname',__('Fullname', [], 'Fullname'),'required');

        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;
                $arrData[$key] = $value;
            }
            //======================== Default Data =================
            $Item = empty($pk)?\Model_MUserDepartment::forge():\Model_MUserDepartment::find($pk);
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
				//Check Exist m_user_id && enable_start_date in database
				$flag_save_allow = true;
				if(empty($pk)){
					$exist = \Model_MUserDepartment::find('first', ['where' => ['m_user_id' => $arrData['m_user_id'],
                                                                                'enable_start_date' => $arrData['enable_start_date'],
                                                                                'item_status' => 'active']]);
					if($exist) $flag_save_allow = false;

					$validation_errors = 'この情報は既に存在しています。';
	                /*==================================================
	                 * Response Data
	                 *==================================================*/
	                $response = ['status' => 'error',
	                            'code' => Exception::E_VALIDATE_ERR,
	                            'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
	                            'error' => $validation_errors];
				}

				if($flag_save_allow){
					$Item->set($arrData)->save();
	                /*==================================================
	                 * Update user info base on user department
	                 *==================================================*/
	                $arrParam = [];
	                $arrParam['arr_user_id'] = [$arrData['m_user_id']];
	                \Model_MUser::updateInfoUserBaseUserDepartment($arrParam);

	                /*==================================================
	                 * Response Data
	                 *==================================================*/
	                $response = ['status' => 'success',
	                            'code' => !empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS,
	                            'message' => Exception::getMessage(!empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS),
	                            'record_id' => $Item->id];
				}
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
            $result = \Model_MUserDepartment::softDelete($pk, array('item_status' => 'delete'));
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
        $result     = \Model_MUserDepartment::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
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
