<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:35:14
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-11-28 09:45:40
 */
class Model_MCompany extends \Orm\Model {
	protected static $_table_name = 'm_company';
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
                            ['db' => 'SM.code', 'dt' => 0],
                            ['db' => 'SM.name', 'dt' => 1],
                            ['db' => 'SM.name_e', 'dt' => 2],
                            ['db' => 'SM.domain', 'dt' => 3]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*'];

            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->where('SM.item_status', '!=', 'delete');
            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }

}
