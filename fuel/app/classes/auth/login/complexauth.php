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

class Auth_Login_ComplexAuth extends \Auth_Login_Driver {

    protected $user = null;
    protected $message = '';
    protected $table_name = null;
    protected $table_group_name = null;
    protected $config = array(
        'drivers' => array('group' => array('complexgroup')),
        'additional_fields' => array('profile_fields'),
    );

    protected function __construct(){
        //============ Create Default Parameters ==============
        $this->table_name = \Config::get('complexauth.table_name');
        $this->table_group_name = \Config::get('complexauth.table_group_name');
    }

    public static function _init() {
        \Config::load('complexauth', true, true, true);
        if (\Config::get('complexauth.remember_me.enabled', false)) {
            static::$remember_me = \Session::forge(array(
                        'driver' => 'cookie',
                        'cookie' => array(
                            'cookie_name' => \Config::get('complexauth.remember_me.cookie_name', 'rmcookie'),
                        ),
                        'encrypt_cookie' => true,
                        'expire_on_close' => false,
                        'expiration_time' => \Config::get('complexauth.remember_me.expiration', 86400 * 31),
            ));
        }
    }

    protected function perform_check() {
        $username_post_key = \Session::get(\Config::get('complexauth.username_post_key'));
        if (!empty($username_post_key)) {
            if (is_null($this->user) or ($this->user[\Config::get('complexauth.username_post_key')] != $username_post_key)) {
                $enable_date = date('Y-m-d');
                $select = ['SM.*'];

                    $this->user = \DB::select_array($select)
                                        ->from([$this->table_name, 'SM'])
                                        ->where('SM.' . \Config::get('complexauth.username_post_key'), '=', $username_post_key)
                                        ->and_where('SM.item_status', 'active')
                                        ->execute(\Config::get('complexauth.db_connection'))->current();
            }
            if ($this->user) {
                return true;
            }
        }elseif (static::$remember_me and $user_id = static::$remember_me->get('user_id', null)) {
            return $this->force_login($user_id);
        }
        \Session::delete(\Config::get('complexauth.username_post_key'));
        return false;
    }

    public function validate_user($username_or_email = null, $password  = null) {
        $username_or_email = trim($username_or_email);
        $password = trim($password);
        $enable_date = date('Y-m-d');

        if (empty($username_or_email) or empty($password)) {
            return false;
        }

        $password = $this->hash_password($password);
        $select = ['SM.*'];

		$user = \DB::select_array($select)
                        ->from([$this->table_name, 'SM'])
                        ->where('SM.' . \Config::get('complexauth.username_post_key'), '=', $username_or_email)
                        ->and_where(\Config::get('complexauth.password_post_key'), '=', $password)
                        ->and_where('SM.item_status', 'active')
                        ->execute(\Config::get('complexauth.db_connection'))->current();

        if(empty($user)){
            $this->message = 'Enter any username and password.';
            return false;
        }
        return $user;

    }

    public function get_error(){
        return $this->message;
    }

    public function login($username_or_email = '', $password = '') {
        if (!($this->user = $this->validate_user($username_or_email, $password))) {
            \Session::delete(\Config::get('complexauth.username_post_key'));
            return false;
        }
        Auth::_register_verified($this);
        \Session::set(\Config::get('complexauth.username_post_key'), $this->user[\Config::get('complexauth.username_post_key')]);
        \Session::instance()->rotate();
        return true;
    }

    public function force_login($user_id = '') {
        if (empty($user_id)) {
            return false;
        }

        $this->user = \Model_MUser::getDetailUserInfo(['m_user_id' => $user_id]);
        Auth::_register_verified($this);
        \Session::set(\Config::get('complexauth.username_post_key'), $this->user[\Config::get('complexauth.username_post_key')]);
        \Session::instance()->rotate();
        return true;
    }

    /**
     * Logout user
     *
     * @return  bool
     */
    public function logout() {
        \Session::destroy();
        return true;
    }

    public function get_user_id() {
        if (empty($this->user)) {
            return false;
        }
        return array($this->id, (int) $this->user['id']);
    }

    public function get_groups() {
        $data = \Model_VsvnGroup::find('all', ['related' => ['vsvn_user' => ['where' => ['id' => $this->user['id']]]]]);
        $user = [];
        foreach ($data as $key => $value) {
            $temp = $value->to_array();
            unset($temp['vsvn_role']);
            unset($temp['vsvn_user']);
            $user[] = $temp;
        }
        return $user ? : false;
    }

    public function get($field = null, $default = null) {

        if (isset($this->user[$field])) {
            return $this->user[$field];
        }else{
            return $this->user;
        }
        return $default;
    }

    public function get_user_groups() {
        if (!empty($this->user)) {
            $roles = \Config::get('complexauth.roles');
            $groups = \Config::get('complexauth.groups');
            $user_groups = $this->get_groups();
            $arrGroup = [];
            if(!empty($user_groups)){
                foreach ($user_groups as $k => $v) {
                   $arrGroup[] = $v['id'];
                }
            }
            $arrGroup[] = 'user_role_key';
            //================ Get Role Of User =================
            $roles = \Model_VsvnUserRole::find('all', ['where' => ['user_id' => $this->user['id']]]);
            $user_roles = \Vision_Common::as_array($roles, 'id', 'role_id');

            $groups['user_role_key'] = array(
                                        'name' => 'Role of User',
                                        'roles' => $user_roles
                                        );

            \Config::set('complexauth.groups', $groups);
            return array(array('complexgroup', $arrGroup));
        }
        return false;
    }

    /**
     * Extension of base driver method to default to user group instead of user id
     */
    public function has_access($condition, $driver = null, $user = null) {
        if (is_null($user)) {
            $groups = $this->get_user_groups();
            $user = reset($groups);
        }
        return parent::has_access($condition, $driver, $user);
    }

    public function hash_password($password) {
        $salt =  \Config::get('auth.salt');
        return md5($salt . $password);
    }

    public function get_email(){}
    public function get_screen_name(){}
}
