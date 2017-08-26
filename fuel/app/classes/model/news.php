<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:04:29
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-04-03 10:58:47
 */
class Model_News extends \Orm\Model {
	protected static $_table_name = 'news';
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
     * List Datatable
     *============================================*/
    public static function listData($params = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $columns = [
                            ['db' => 'SM.image', 'dt' => 0],
                            ['db' => 'SM.news_category_id', 'dt' => 1],
                            ['db' => 'SM.language_code', 'dt' => 2],
                            ['db' => 'SM.title', 'dt' => 3],
                            ['db' => 'SM.description', 'dt' => 4],
                            ['db' => 'SM.date', 'dt' => 5]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', DB::expr('VL.name as language_name'), DB::expr('NC.title as news_category_title')];

            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
						 ->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
						 ->join(['news_category', 'NC'], 'left')->on('SM.news_category_id', '=', 'NC.id')
                         ->where('SM.item_status', '!=', 'delete');

            $result = Vision_Db::datatable_query($query, $columns, $params, $options);
        }
        return $result;
    }

	/*============================================
     * Get detail informat based on primary key
     *============================================*/
	public static function getDetail($pk, $params = null, $option = null){
		$select = ['SM.*', DB::expr('VL.name as language_name'), DB::expr('NC.title as news_category_title')];

		$query = \DB::select_array($select)
			            ->from([self::$_table_name, 'SM'])
						->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
						->join(['news_category', 'NC'], 'left')->on('SM.news_category_id', '=', 'NC.id')
			            ->where('SM.id', '=', $pk)
			            ->and_where('SM.item_status', '=', 'active');

        $result = $query->as_object()->execute()->current();
		return $result;
	}
}