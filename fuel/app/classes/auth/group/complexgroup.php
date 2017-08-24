<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Mar 17, 2014 1:39:32 PM
 */
//namespace Auth;


class Auth_Group_Complexgroup extends \Auth_Group_Driver {

    public static $_valid_groups = array();

    public static function _init() {
        static::$_valid_groups = array_keys(\Config::get('complexauth.groups'));
    }

    protected $config = array(
        'drivers' => array('acl' => array('complexacl'))
    );

    public function member($group, $user = null) {
        if ($user === null) {
            $groups = \Auth::instance()->get_user_groups();
        } else {
            // to be written...
            $groups = \Auth::instance($user[0])->get_user_groups();
        }
        return in_array(array($this->id, $group), $groups);
    }

    public function get_name($group) {
        return \Config::get('complexauth.groups.'.$group.'.name', null) ? : false;
    }

    public function get_roles($group) {
        static::$_valid_groups = array_keys(\Config::get('complexauth.groups'));
        if (!in_array($group, static::$_valid_groups)) {
            return false;
        }

        $groups = \Config::get('complexauth.groups');
        return $groups[$group]['roles'];
    }

}

/* end of file simplegroup.php */
