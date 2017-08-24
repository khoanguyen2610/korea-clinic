<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-04-13 15:11:06
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_TComment extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_comment';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function insert record into table
     * Method POST
     * Table t_comment
     * name have to require|unique
     * Response data: status[success|error], message[Created OK|Validation]
     *=============================================================*/
    public function post_index($pk = null){
        $pk = intval($pk);
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('petition_id',__('Petition ID', [], 'Petition ID'),'required');
        $validation->add_field('petition_type',__('Petition Type', [], 'Petition Type'),'required');
        $validation->add_field('content',__('Content', [], 'Content'),'required');
        $validation->add_field('m_user_id',__('User ID', [], 'User ID'),'required');

        if($validation->run()){
            $arrData = [];
            foreach ($param as $key => $value) {
            	if(!in_array($key, $this->table_field)) continue;
                $value = (!is_null($value) && $value != '')?$value:null;

                switch ($key) {
                    case 'date_time':
                        $value = (!is_null($value) && $value != '')?date('Y-m-d H:i:s', strtotime($value)):date('Y-m-d H:i:s');
                        break;
                    case 'parent':
                        $value = !empty($value)?(int)$value:0;
                        break;
                    case 'content':
                        $value = \Vision_Common::trim($value);
                        break;
                }
                $arrData[$key] = $value;
            }

            if(!isset($arrData['date_time']) || empty($arrData['date_time']))
                $arrData['date_time'] = date('Y-m-d H:i:s');
            //======================== Default Data =================
            $Item = empty($pk)?\Model_TComment::forge():\Model_TComment::find($pk);
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

				//Send email incased post new comment
				if(empty($pk) && !empty($Item)){
					//open socket send email notify to creator
                    $uri_query = ['comment_id' => $Item->id,
                                    'petition_type' => $Item->petition_type,
                                    'm_user_id' => $Item->m_user_id];
                    $url_request = '/public/api/v1/system_socket/send_mail_when_user_comment?' . http_build_query($uri_query);
                    $this->send_request($url_request);
				}



                //=================== Update Comment Unread In Table t_approval_status ================
                \DB::update('t_approval_status')->set(['is_read_comment' => '0'])
                                                ->where('petition_id', '=', $param['petition_id'])
                                                ->and_where('petition_type', '=', $param['petition_type'])
                                                ->and_where('m_user_id', '!=', $param['m_user_id'])
                                                ->execute();
                \DB::update('t_approval_status')->set(['is_read_comment' => '1'])
                                                ->where('petition_id', '=', $param['petition_id'])
                                                ->and_where('petition_type', '=', $param['petition_type'])
                                                ->and_where('m_user_id', '=', $param['m_user_id'])
                                                ->execute();



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
     * Table t_comment
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function delete_index($pk = null){
        if(!empty($pk)){
            $result = \Model_TComment::softDelete($pk, array('item_status' => 'delete'));
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
     * Function delete a record
     * Update status record to 'delete'
     * Method DELETE
     * Table t_comment
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function post_client_delete($pk = null){
        if(!empty($pk)){
            $objTC = \Model_TComment::find($pk);
            if(!empty($objTC)){
                $objTC->set(['item_status' => 'client_delete'])->save();

                $status = 'success';
                $response_code = Exception::E_DELETE_SUCCESS;
                $response_message = Exception::getMessage(Exception::E_DELETE_SUCCESS);
            }else{
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
