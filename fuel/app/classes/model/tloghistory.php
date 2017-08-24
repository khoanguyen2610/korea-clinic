<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:03:04
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-02-13 16:20:03
 */
class Model_TLogHistory extends \Orm\Model {
	protected static $_table_name = 't_log_history';
	protected static $_primary_key = ['id'];
    
    protected static $_observers = array(
        'Orm\\Observer_System' => array(
                'events' => array('before_insert', 'before_save'),
                'mysql_timestamp' => true,
                'overwrite' => true)
    );

    public static function softDelete($pk, $attributes, $conditions = array()) {
        $attributes = array_merge(array(
                'deleted_date' => date('Y-m-d H:i:s'),
                'deleted_user_id' => \Auth::get('id')
        ), $attributes);
        $Item = self::find($pk);
        if($Item){
            return $Item->set($attributes)->save();
        }
        return false;
    }


    /*============================================
     * List Datatable
     *============================================*/
    public static function listData($arrParam = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $columns = [
                            ['db' => 'MU.staff_no', 'dt' => 0],
                            ['db' => 'MU.fullname', 'dt' => 1],
                            ['db' => 'SM.ip_address', 'dt' => 2],
                            ['db' => 'SM.host_name', 'dt' => 3],
                            ['db' => 'SM.date_time', 'dt' => 4],
                            ['db' => 'SM.operation', 'dt' => 5]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', 'MU.staff_no', 'MU.fullname'];
            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->join(['m_user', 'MU'], 'left')->on('SM.m_user_id', '=', 'MU.id')
                         ->where('SM.item_status', '!=', 'delete');
            
            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['from_date']) && !empty($arrParam['from_date']) && isset($arrParam['to_date']) && !empty($arrParam['to_date'])){
                $from_date = date('Y-m-d H:i:s', strtotime($arrParam['from_date']));
                $to_date = date('Y-m-d 23:59:59', strtotime($arrParam['to_date']));
                $filterDays = [$from_date, $to_date];
                sort($filterDays);
                $query->and_where('SM.date_time', 'BETWEEN', $filterDays);
            }else if(isset($arrParam['from_date']) && !empty($arrParam['from_date'])){
                $from_date = date('Y-m-d H:i:s', strtotime($arrParam['from_date']));
                $query->and_where('SM.date_time', '>=', $from_date);
            }else if(isset($arrParam['to_date']) && !empty($arrParam['to_date'])){
                $to_date = date('Y-m-d H:i:s', strtotime($arrParam['to_date']));
                $query->and_where('SM.date_time', '<=', $to_date);
            }

            if(isset($arrParam['fullname']) && $arrParam['fullname'] != null){
                $query->and_where('MU.fullname', 'LIKE', '%' . $arrParam['fullname'] . '%');
            }

            if(isset($arrParam['host_name']) && $arrParam['host_name'] != null){
                $query->and_where('SM.host_name', 'LIKE', '%' . $arrParam['host_name'] . '%');
            }


            if(isset($arrParam['operation']) && $arrParam['operation'] != null){
                $query->and_where('SM.operation', '=', $arrParam['operation']);
            }



            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }
}
