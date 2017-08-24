<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:39:18
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-05 18:31:37
 */
class Model_MExpenseItem extends \Orm\Model {
	protected static $_table_name = 'm_expense_item';
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
                            ['db' => 'SM.item_name_code', 'dt' => 0],
                            ['db' => 'SM.item', 'dt' => 1],
                            ['db' => 'SM.item_e', 'dt' => 2],
                            ['db' => 'SM.enable_flg', 'dt' => 3],
                            ['db' => 'SM.receipt_flg', 'dt' => 4]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*'];

            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->where('SM.item_status', '!=', 'delete');

            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['type_code']) && $arrParam['type_code'] != null && $arrParam['type_code'] != 'none' ){
                $query->and_where('SM.type_code', '=', $arrParam['type_code']);
            }

            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }

}
