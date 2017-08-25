<?php
namespace Api_v1;
use \Controller\Exception;

class Controller_Appointment extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 'appointment';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get detail form information
     * Method GET
     * Table appointment
     * Single data
     * Input $pk - primary key
     * Response data: status[success|error], total[total_record], data[single|array]
     *=============================================================*/
    public function get_detail($pk){
        $pk = intval($pk);
        $param = \Input::param();
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

        $data = $query->execute()->current();



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
     * Table appointment
     * fullname, phone, date have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();

        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('fullname',__('Fullname', [], 'Fullname'),'required');
        $validation->add_field('phone',__('Phone', [], 'Phone'),'required');
        $validation->add_field('date',__('Date', [], 'Date'),'required');


        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?trim($value):null;

                switch ($key) {
                    case 'date':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d', strtotime($value)):null;
                        break;
                    case 'time':
                        $value = (!is_null($value) && $value != '')?date('H:i:s', strtotime($value)):null;
                        break;
                }

                $arrData[$key] = $value;
            }



            //======================== Default Data =================
			try{
				\DB::start_transaction();
	            $obj = empty($pk)?\Model_Appointment::forge():\Model_Appointment::find($pk);
				$obj->set($arrData)->save();
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

            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'success',
                        'code' => !empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS,
                        'message' => Exception::getMessage(!empty($pk)?Exception::E_UPDATE_SUCCESS:Exception::E_CREATE_SUCCESS),
                        'record_id' => $obj->id,
                        'date' => $obj];
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
     * Table t_proposal
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_Appointment::softDelete($pk, array('item_status' => 'delete'));
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
