<?php

class Model_System_VsvnTranslate extends Orm\Model {
	protected static $_table_name = 'vsvn_translate';
    protected static $_primary_key = ['id'];

    protected static $_belongs_to = array(
                'vsvn_language' => array(
                    'key_from' => 'language_code',
                    'model_to' => '\Model_VsvnLanguage',
                    'key_to' => 'code',
                    'cascade_save' => false,
                    'cascade_delete' => false,
                )
    );

    protected static $_observers = array(
        'Orm\\Observer_System' => array(
                'events' => array('before_insert', 'before_save'),
                'mysql_timestamp' => true,
                'overwrite' => true)
    );

    public static function softDelete($pk, $attributes, $conditions = array()) {
        $attributes = array_merge(array(
                'deleted_at' => date('Y-m-d H:i:s'),
                'deleted_id' => \Auth::get('id')
        ), $attributes);
        $Item = self::find($pk);
        if($Item){
            return $Item->set($attributes)->save();
        }
        return false;
    }

    public static function listItem($arrParam = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $aColumns = array(DB::expr(TABLE_PREFIX . 'vsvn_language.name'), static::$_table_name . '.key', static::$_table_name . '.value', static::$_table_name . '.status');
            $colums = array(DB::expr('SQL_CALC_FOUND_ROWS `' . static::$_table_name . '`.`id`'), DB::expr(static::$_table_name . '.id AS DT_RowId'), static::$_table_name . '.*', DB::expr(TABLE_PREFIX . 'vsvn_language.name AS language'));
            $query = DB::select_array($colums)
                         ->from(static::$_table_name)
                         ->join(TABLE_PREFIX . 'vsvn_language', 'left')->on(TABLE_PREFIX . 'vsvn_language.code', '=' , static::$_table_name . '.language_code')
                         ->where(static::$_table_name . '.status', '!=', 'delete');

            $result = Vision_Db::datatable_query($query, $aColumns, $arrParam, $options);
        }
        return $result;
    }
}
