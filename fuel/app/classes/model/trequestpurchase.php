<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:07:54
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-11-25 16:29:30
 */
class Model_TRequestPurchase extends \Orm\Model {
	protected static $_table_name = 't_request_purchase';
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

}
