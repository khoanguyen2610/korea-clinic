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
                $select = ['SM.*', \DB::expr('MP.id AS position_id'), \DB::expr('MP.name AS position_name'), \DB::expr('MP.code AS position_code'),
                            \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), \DB::expr('DEP.code AS department_code'), \DB::expr('DEP.sub_code AS department_sub_code'), 
                            \DB::expr('DIV.id AS division_id'), \DB::expr('DIV.name AS division_name'), \DB::expr('DIV.code AS division_code'), 
                            \DB::expr('BUS.id AS business_id'), \DB::expr('DEP.name AS business_name'), \DB::expr('BUS.code AS business_code'),
                            \DB::expr('MCU.name AS currency_name'), \DB::expr('MCU.symbol AS currency_symbol')];
                
                    $this->user = \DB::select_array($select)
                                        ->from([$this->table_name, 'SM'])
                                        // ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')
                                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'SM.active_m_department_id')
                                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                                        ->join(['m_company', 'MC'], 'left')->on('MC.id', '=', 'BUS.m_company_id')
                                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'SM.active_m_position_id')
                                        ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'SM.m_currency_id')


                                        ->where('SM.' . \Config::get('complexauth.username_post_key'), '=', $username_post_key)
                                        ->and_where('SM.item_status', 'active')
                                        // ->and_where('MUD.item_status', '=', 'active')

                                        // ->and_where_open()
                                        //     ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                                        //     ->or_where_open()
                                        //         ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                        //         ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                                        //     ->or_where_close()
                                        // ->and_where_close()
                                        ->and_where_open()
                                            ->and_where('SM.retirement_date', '>=', $enable_date)
                                            ->or_where('SM.retirement_date', 'IS', \DB::expr('NULL'))
                                        ->and_where_close()

                                        ->execute(\Config::get('complexauth.db_connection'))->current();                    
            }
            if ($this->user) {
                /*=============================================
                 * Check group of user
                 *=============================================*/
                $groups = \Model_System_VsvnUserGroup::list_permission(['m_user_id' => $this->user['id']]);
                $this->user = array_merge($this->user, $groups);

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
        $select = ['SM.*', \DB::expr('MP.id AS position_id'), \DB::expr('MP.name AS position_name'), \DB::expr('MP.code AS position_code'),
                    \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), \DB::expr('DEP.code AS department_code'), \DB::expr('DEP.sub_code AS department_sub_code'), 
                    \DB::expr('DIV.id AS division_id'), \DB::expr('DIV.name AS division_name'), \DB::expr('DIV.code AS division_code'), 
                    \DB::expr('BUS.id AS business_id'), \DB::expr('DEP.name AS business_name'), \DB::expr('BUS.code AS business_code'),
                    \DB::expr('MCU.name AS currency_name'), \DB::expr('MCU.symbol AS currency_symbol')];
                
		$user = \DB::select_array($select)
                        ->from([$this->table_name, 'SM'])
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')
                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                        ->join(['m_company', 'MC'], 'left')->on('MC.id', '=', 'BUS.m_company_id')
                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                        ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'SM.m_currency_id')

                        ->where('SM.' . \Config::get('complexauth.username_post_key'), '=', $username_or_email)
                        ->and_where(\Config::get('complexauth.password_post_key'), '=', $password)
                        ->and_where('SM.item_status', 'active')
                        ->and_where('MUD.item_status', '=', 'active')

                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()

                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('DEP.enable_start_date'), \DB::expr('DEP.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('DEP.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('DEP.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        
                        ->and_where_open()
                            ->and_where('SM.retirement_date', '>=', $enable_date)
                            ->or_where('SM.retirement_date', 'IS', \DB::expr('NULL'))
                        ->and_where_close()

                        ->execute(\Config::get('complexauth.db_connection'))->current();
           
        if(empty($user)){
            $this->message = 'ログインエラーユーザーIDまたはパスワードに誤りがあります。';
            return false;
        }

        /*=============================================
         * Check group of user
         *=============================================*/
        $groups = \Model_System_VsvnUserGroup::list_permission(['m_user_id' => $user['id']]);
        $user = array_merge($user, $groups);
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
