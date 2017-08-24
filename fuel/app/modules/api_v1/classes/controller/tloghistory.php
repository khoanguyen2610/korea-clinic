<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-09 09:39:13
 */
namespace Api_v1;
use \Controller\Exception;

class Controller_TLogHistory extends \Controller_API {
	public function before() {
        parent::before();
        $this->main_table = 't_log_history';
        $columns = \DB::list_columns($this->main_table);
        $this->table_field = array_keys($columns);

    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get data for datatable
     * Method GET
     * Table t_log_history
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_data(){
        $result     = \Model_TLogHistory::listData($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        $response = ["sEcho" => intval(@$this->_arrParam['sEcho']),
                    "iTotalRecords" => $result['total'],
                    "iTotalDisplayRecords" => $result['total'],
                    "aaData" => $items
                    ];
        return $this->response($response);
    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function list operation
     * Method GET
     * Response data: status[success|error], message[notification]
     *=============================================================*/
    public function get_list_operation(){
        /*==================================================
         * Response Data
         *==================================================*/
        $data = [['id' => 'ログイン', 'text' => 'ログイン'],
                    ['id' => 'ログアウト', 'text' => 'ログアウト'],
                    ['id' => 'CSV出力(審議・決済一覧)', 'text' => 'CSV出力(審議・決済一覧)'],
                    ['id' => 'CSV出力(ユーザ管理)', 'text' => 'CSV出力(ユーザ管理)'],
                    ['id' => 'CSV出力(精算処理申請一覧)', 'text' => 'CSV出力(精算処理申請一覧)']
                ];


        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => count($data),
                    'data' => $data];
        return $this->response($response);
    }
}