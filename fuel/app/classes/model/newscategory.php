<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:04:29
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-04-03 10:58:47
 */
class Model_NewsCategory extends \Orm\Model {
	protected static $_table_name = 'news_category';
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
		$select = ['SM.*', DB::expr('VL.name as language_name')];

		$query = \DB::select_array($select)
			            ->from([self::$_table_name, 'SM'])
						->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
			            ->and_where('SM.item_status', '=', 'active');

        $result = $query->as_object()->execute()->as_array();

		//Recursive data
		if(isset($params['recursive']) && $params['recursive']){
			$recursive = new \Vision_Recursive();
			$recursive->recursiveData($result, 0, $resResult, 1);
            $result = $resResult;
		}

		return $result;
	}


	/*============================================
     * Get detail informat based on primary key
     *============================================*/
	public static function getDetail($pk, $params = null, $option = null){
		$select = ['SM.*', DB::expr('VL.name as language_name')];

		$query = \DB::select_array($select)
			            ->from([self::$_table_name, 'SM'])
						->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
			            ->where('SM.id', '=', $pk)
			            ->and_where('SM.item_status', '=', 'active');

        $result = $query->as_object()->execute()->current();
		return $result;
	}

}
