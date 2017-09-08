<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:57:05
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-06-26 11:28:27
 */
class Model_System_VsvnUser extends \Orm\Model {
	protected static $_table_name = 'vsvn_user';
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


    public static function getDetailUserInfo($arrParam = null, $options = null){
        $select = ['SM.*'];

        $query = \DB::select_array($select)
                    ->from([static::$_table_name, 'SM'])
                    ->where('SM.id', '=', $arrParam['username'])
                    ->and_where('SM.item_status', 'active');


        $result = $query->execute()->current();
        return $result;
    }
}
