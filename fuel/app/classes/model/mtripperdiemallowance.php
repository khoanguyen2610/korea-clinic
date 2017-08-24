<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:58:58
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-05 17:02:26
 */
class Model_MTripPerdiemAllowance extends \Orm\Model {
	protected static $_table_name = 'm_trip_perdiem_allowance';
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
                            ['db' => 'SM.m_trip_area_id', 'dt' => 0],
                            ['db' => 'SM.m_position_id', 'dt' => 1],
                            ['db' => 'SM.perdiem', 'dt' => 2],
                            ['db' => 'SM.allowance', 'dt' => 3],
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*',
                        DB::expr('MP.name AS position_name'), DB::expr('MTA.type AS trip_area_type'), DB::expr('MTA.name AS trip_area_name'),];
            $query = DB::select_array($colums)
                        ->from([static::$_table_name, 'SM'])
                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'SM.m_position_id')
                        ->join(['m_trip_area', 'MTA'], 'left')->on('MTA.id', '=', 'SM.m_trip_area_id')
                        ->where('SM.item_status', '!=', 'delete');

            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }

}
