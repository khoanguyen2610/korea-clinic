<?php

class Model_System_VsvnGroup extends \Orm\Model {
	protected static $_table_name = 'vsvn_group';
	protected static $_primary_key = ['id'];
	protected static $_many_many = array(
	    		'vsvn_role' => array(
							        'key_from' => 'id',
							        'key_through_from' => 'group_id',
							        'table_through' => 'vsvn_group_role',
							        'key_through_to' => 'role_id',
							        'model_to' => '\Model_System_VsvnRole',
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
				'deleted_at' => date('Y-m-d H:i:s'),
				'deleted_id' => \Auth::get('id')
		), $attributes);
		$Item = self::find($pk);
		if($Item){
			return $Item->set($attributes)->save();
		}
		return false;
	}

	public static function listItem($arrParam = null, $options = null) {
		if ($options ['task'] == 'list-dbtable') {
			$aColumns = [static::$_table_name . '.name',
						static::$_table_name . '.description',
						static::$_table_name . '.status',
						static::$_table_name . '.status',
						static::$_table_name . '.status'];
			$colums = [DB::expr ('SQL_CALC_FOUND_ROWS `' . static::$_table_name . '`.`id`'),
						DB::expr (static::$_table_name . '.id AS DT_RowId'),
						static::$_table_name . '.*'];
			$query = DB::select_array ( $colums )->from ( static::$_table_name )->where ( static::$_table_name . '.status', '!=', 'delete' );

			/**
			 * custom sort by count member*
			 */
			if ($arrParam ['iSortCol_0'] == 3) {
				$colums [] = "user_group.total_member";
				$query->join(DB::expr("(SELECT group_id, count(user_id) as total_member FROM `vsvn_user_group` group by group_id ) AS user_group" ), 'LEFT')
						->on(static::$_table_name . '.id', '=', 'user_group.group_id')
						->order_by('total_member', $arrParam ['sSortDir_0'] );
			}
			$result = Vision_Db::datatable_query($query, $aColumns, $arrParam, $options);
		}
		return $result;
	}
}
