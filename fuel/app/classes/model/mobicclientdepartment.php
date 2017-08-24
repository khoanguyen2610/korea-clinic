<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:27:20
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-11-28 11:57:35
 */
class Model_MObicClientDepartment extends \Orm\Model {
	protected static $_table_name = 'm_obic_client_department';
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
