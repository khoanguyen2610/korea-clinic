<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:57:04
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-05 13:46:43
 */
class Model_MObicKari extends \Orm\Model {
	protected static $_table_name = 'm_obic_kari';
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
                            ['db' => 'SM.karikata_name', 'dt' => 0],
                            ['db' => 'SM.karikata_sokanjokamoku_cd', 'dt' => 1],
                            ['db' => 'SM.karikata_hojokamoku_cd', 'dt' => 2],
                            ['db' => 'SM.karikata_hojouchiwakekamoku_cd', 'dt' => 3],
                            ['db' => 'SM.karikata_torihikisaki_cd', 'dt' => 4],
                            ['db' => 'SM.karikata_zei_kubun', 'dt' => 5],
                            ['db' => 'SM.karikata_zeikomi_kubun', 'dt' => 6],
                            ['db' => 'SM.karikata_bunseki_cd1', 'dt' => 7]
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
