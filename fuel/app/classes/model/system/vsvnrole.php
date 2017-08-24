<?php

class Model_System_VsvnRole extends Orm\Model {
	protected static $_table_name = 'vsvn_role';
    protected static $_primary_key = ['id'];

    protected static $_many_many = array(
                'vsvn_group' => array(
                                        'key_from' => 'id',
                                        'key_through_from' => 'role_id',
                                        'table_through' => 'vsvn_group_role',
                                        'key_through_to' => 'group_id',
                                        'model_to' => '\Model_System_VsvnGroup',
                                        'key_to' => 'id',
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
                'deleted_date' => date('Y-m-d H:i:s'),
                'deleted_user_id' => 15
        ), $attributes);
        $Item = self::find($pk);
        if($Item){
            return $Item->set($attributes)->save();
        }
        return false;
    }

	public static function listItem($arrParam = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $aColumns = array(static::$_table_name . '.name', static::$_table_name . '.description', static::$_table_name . '.content', static::$_table_name . '.status');
            $colums = array(DB::expr('SQL_CALC_FOUND_ROWS `' . static::$_table_name . '`.`id`'), DB::expr(static::$_table_name . '.id AS DT_RowId'), static::$_table_name . '.*');
            $query = DB::select_array($colums)
                         ->from(static::$_table_name)
						 ->where(static::$_table_name . '.status', '!=', 'delete');
            
            $result = Vision_Db::datatable_query($query, $aColumns, $arrParam, $options);
        }        
        return $result;
    }
}