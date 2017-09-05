<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:04:29
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-09-05 14:18:02
 */
class Model_Gallery extends \Orm\Model {
	protected static $_table_name = 'gallery';
	protected static $_primary_key = ['id'];

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


    /*============================================
     * Get all record
     *============================================*/
    public static function getAll($params = null, $option = null){
        $select = [DB::expr('SM.id AS DT_RowId'), 'SM.*'];

        $query = \DB::select_array($select)
                        ->from([self::$_table_name, 'SM'])
                        ->and_where('SM.item_status', '=', 'active')
                        ->order_by('SM.created_at', 'DESC');

        //Query by params
        if(isset($params['language_code']) && !empty($params['language_code'])) $query->where('SM.language_code', '=', $params['language_code']);
        if(isset($params['limit']) && !empty($params['limit'])) $query->limit($params['limit']);

        $result = $query->as_object()->execute()->as_array();

        return $result;
    }

	/*============================================
     * List Datatable
     *============================================*/
    public static function listData($params = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $columns = [
                            ['db' => 'SM.title', 'dt' => 0],
                            ['db' => 'SM.description', 'dt' => 1]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*'];

            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->where('SM.item_status', '!=', 'delete');

            $result = Vision_Db::datatable_query($query, $columns, $params, $options);
        }
        return $result;
    }

	/*============================================
     * Get detail informat based on primary key
     *============================================*/
	public static function getDetail($pk = null, $params = null, $option = null){
		$select = ['SM.*'];

		$query = \DB::select_array($select)
			            ->from([self::$_table_name, 'SM'])
			            ->where('SM.item_status', '=', 'active')
						->as_object();

		//Query by params
		if(!empty($pk)) $query->where('SM.id', '=', $pk);
		if(isset($params['id']) && !empty($params['id'])) $query->where('SM.id', '=', $params['id']);

		if(isset($params['item_key']) && !empty($params['item_key'])) $query->where('SM.item_key', '=', $params['item_key']);
		if(isset($params['language_code']) && !empty($params['language_code'])) $query->where('SM.language_code', '=', $params['language_code']);



		//Return one record or muilti
		if(isset($params['response_quantity']) && $params['response_quantity'] == 'all') $result = $query->execute();
		if((isset($params['response_quantity']) && $params['response_quantity'] == 'single') || !isset($params['response_quantity']) || empty($params['response_quantity'])) $result = $query->execute()->current();

		return $result;
	}

}
