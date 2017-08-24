<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:14
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_TApprovalStatus extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_proposal';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);
				
    }



    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Update list approval of form
     * Method POST
     * Table t_approval_status
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function post_set_routes($pk){
        $param = \Input::param();
        $user_info = \Auth::get();

        // echo '<pre>';
        // print_r($param);
        // echo '</pre>';

        // $routes = json_decode($param['routes']);
        // echo '<pre>';
        // print_r($routes);
        // echo '</pre>';
        // die;
        //Detect type of menu
        $petition_type = 1;
        switch ($param['menu_type']) {
            case 'menu':
                $petition_type = 1;
                break;
            case 'payment':
                $petition_type = 2;
                break;
        }
        if(isset($param['routes']) && !empty($param['routes'])){
            $routes = json_decode($param['routes']);
            // echo '<pre>';
            // print_r($routes);
            // echo '</pre>';die;
            $i = 0;
            if(!empty($routes)){
                //=================== Update All Input Delete Before Save ================
                \DB::update('t_approval_status')->set(['item_status' => 'delete',
                                                    'deleted_date' => date('Y-m-d H:i:s'),
                                                    'deleted_user_id' => $user_info['id']])
                                                ->where('petition_id', '=', $pk)
                                                ->and_where('petition_type', '=', $petition_type)
                                                ->execute();
                foreach ($routes as $obj) {
                    $i++;
                    $m_approval_status_id = (isset($obj->m_approval_status_id) && !empty($obj->m_approval_status_id))?$obj->m_approval_status_id:null;
                    //  if($i == 2 && empty($m_approval_status_id)) $m_approval_status_id = 1;
                    $dataRoutes = ['petition_id' => $pk,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $obj->m_user_id,
                                    'm_authority_id' => $obj->m_authority_id,
                                    'm_approval_status_id' => $m_approval_status_id,
                                    'order' => $i,
                                    'resource_data' => $obj->resource_data,
                                    'unit' => $obj->unit,
                                    'is_read_comment' => isset($obj->is_read_comment)?$obj->is_read_comment:1,
                                    'notice_confirm_code' => isset($obj->notice_confirm_code)?$obj->notice_confirm_code:1,
                                    'item_status' => 'active',
                                    'deleted_date' => null,
                                    'deleted_user_id' => null
                                    ];
                    $ObjTAS = !isset($obj->id)?\Model_TApprovalStatus::forge():\Model_TApprovalStatus::find($obj->id);
                    if(!empty($ObjTAS)){
                        $ObjTAS->set($dataRoutes)->save();
                    }
                }
            }
        }


        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => !Exception::E_UPDATE_SUCCESS,
                    'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS)];
        return $this->response($response);
    }

}
