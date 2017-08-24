<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:33:01
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-11-25 16:28:36
 */
class Model_MRequestMenu extends \Orm\Model {
	protected static $_table_name = 'm_request_menu';
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
                            ['db' => 'MP.name', 'dt' => 2],
                            ['db' => 'SM.enable_flg', 'dt' => 3]
                        ];

            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', \DB::expr('MP.name AS position_name')];
            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->join(['m_position', 'MP'], 'left')->on('SM.limit_m_position_id', '=', 'MP.id')
                         ->where('SM.item_status', '!=', 'delete');
            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }
}
