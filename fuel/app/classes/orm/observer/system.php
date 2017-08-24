<?php

/**
 * PHP Class
 *
 * LICENSE
 *
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Apr 22, 2016 01:12:56 PM
 */
namespace Orm;
class Observer_System extends Observer
{
	public static $mysql_timestamp = false;
	public static $property = 'created_at';
	protected $_mysql_timestamp;
	protected $_property;
	protected $_overwrite;
	protected $_relations;

	public function __construct($class)
	{
		$props = $class::observers(get_class($this));
		$this->_mysql_timestamp  = isset($props['mysql_timestamp']) ? $props['mysql_timestamp'] : static::$mysql_timestamp;
		$this->_property         = isset($props['property']) ? $props['property'] : static::$property;
		$this->_overwrite        = isset($props['overwrite']) ? $props['overwrite'] : true;
		$this->_relations        = isset($props['relations']) ? $props['relations'] : array();
	}
    public function before_insert(\Orm\Model $obj){
        $obj->created_at = $this->_mysql_timestamp ? \Date::time()->format('mysql') : \Date::time()->get_timestamp();
        $obj->created_id = \Auth::get('id');
        $obj->updated_at = null;
        $obj->updated_id = null;
    }

    public function before_save(\Orm\Model $obj){
		$objClassName = get_class($obj);
		$objProperties = $objClassName::properties();
		//=============== Do not check change delete history ===================
		if(array_key_exists('deleted_at', $objProperties))
			unset($objProperties['deleted_at']);
		if(array_key_exists('deleted_at', $objProperties))
			unset($objProperties['deleted_at']);

		if ($obj->is_changed(array_keys($objProperties))){
	        $obj->updated_at = $this->_mysql_timestamp ? \Date::time()->format('mysql') : \Date::time()->get_timestamp();
	        $obj->updated_id = \Auth::get('id');
		}
    }
}
