<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:25:13
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-21 09:20:56
 */
class Model_TNotify extends \Orm\Model {
	protected static $_table_name = 't_notify';
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
                            ['db' => 'SM.date', 'dt' => 0],
                            ['db' => 'SM.type', 'dt' => 1],
                            ['db' => 'SM.title', 'dt' => 2],
                            ['db' => 'SM.content', 'dt' => 3],
                            ['db' => 'SM.release_flg', 'dt' => 4]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*'];
            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->where('SM.item_status', '!=', 'delete');

            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['from_date']) && !empty($arrParam['from_date']) && isset($arrParam['to_date']) && !empty($arrParam['to_date'])){
                $from_date = date('Y-m-d', strtotime($arrParam['from_date']));
                $to_date = date('Y-m-d', strtotime($arrParam['to_date']));
                $filterDays = [$from_date, $to_date];
                sort($filterDays);
                $query->and_where('SM.date', 'BETWEEN', $filterDays);
            }else if(isset($arrParam['from_date']) && !empty($arrParam['from_date'])){
                $from_date = date('Y-m-d', strtotime($arrParam['from_date']));
                $query->and_where('SM.date', '>=', $from_date);
            }else if(isset($arrParam['to_date']) && !empty($arrParam['to_date'])){
                $to_date = date('Y-m-d', strtotime($arrParam['to_date']));
                $query->and_where('SM.date', '<=', $to_date);
            }

            if(isset($arrParam['release_flg']) && $arrParam['release_flg'] != null && $arrParam['release_flg'] != 'none' ){
                $query->and_where('SM.release_flg', '=', $arrParam['release_flg']);
            }

            if(isset($arrParam['type']) && $arrParam['type'] != null && $arrParam['type'] != 'none' ){
                $query->and_where('SM.type', '=', $arrParam['type']);
            }      

            if(isset($arrParam['has_order_by_date']) && $arrParam['has_order_by_date']){
                $query->order_by('SM.date', 'DESC');
            }                  
            
            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }
}
