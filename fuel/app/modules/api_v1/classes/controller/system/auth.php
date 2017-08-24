<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Mar 25, 2016 04:42:31 PM
 */


namespace Api_v1;
use \Controller\Exception;

class Controller_System_Auth extends \Controller_API {
	public function before() {
        parent::before();
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function login
     * Login with user_id & password
     * Method POST
     *=============================================================*/
    public function post_login(){
        $param = \Input::param();
        $user_info = \Auth::get();
        
        if(empty($user_info)){
            $val = \Validation::forge();
            $val->add_field('user_id', __('User ID', [], 'User ID'), 'required');
            $val->add_field('password', __('Password', [], 'Password'), 'required');
            if ($val->run($param)) {
                if (\Auth::instance()->login($param['user_id'], $param['password'])) {
                    $user_info = \Auth::get();

                    //Update current department available
                    \Model_MUser::find($user_info['id'])
                                ->set(['active_m_department_id' => $user_info['department_id'],
                                       'active_m_position_id' => $user_info['position_id']
                                    ])->save();

                    //Save log t_op_history
                    $hostname = null;
                    $ip = \Input::server('HTTP_X_FORWARDED_FOR')?:\Input::server('REMOTE_ADDR');
                    $hostname = gethostbyaddr($ip);
                    \Model_TLogHistory::forge()->set([
                        'm_user_id' => $user_info['id'],
                        'ip_address' => $ip,
                        'host_name' => $hostname,
                        'date_time' => date('Y-m-d H:i:s'),
                        'operation' => 'ログイン'
                    ])->save();    

                    $user_info = \Model_MUser::getDetailUserInfo(['m_user_id' => $user_info['id']]); 
                    
                    /*================== Login success ================*/
                    $response = ['status' => 'success',
                                'code' => Exception::E_LOGIN_OK,
                                'message' => Exception::getMessage(Exception::E_LOGIN_OK),
                                'data' => $user_info];
                }else{
                    $response = ['status' => 'error',
                                'code' => Exception::E_VALIDATE_ERR,
                                'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                                'error' => ['msg_error' => \Auth::get_error()]];
                }
            }else{
                $response = ['status' => 'error',
                            'code' => Exception::E_VALIDATE_ERR,
                            'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                            'error' => ['msg_error' => 'ユーザーIDまたはパスワードを入力してください。']];

            }
        }else{
            /*================== Exist Session User ================*/
            $response = ['status' => 'success',
                        'code' => Exception::E_LOGIN_EXIST,
                        'message' => Exception::getMessage(Exception::E_LOGIN_EXIST),
                        'data' => $user_info];
        }
        

        /*==================================================
         * Response Data
         *==================================================*/
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function logout user
     * Method GET
     * Input: null
     * Destroy session and cookie
     * Response data: status[success|error]
     *=============================================================*/
    public function get_logout(){
        //Save log t_op_history
        $hostname = null;
        $ip = \Input::server('HTTP_X_FORWARDED_FOR')?:\Input::server('REMOTE_ADDR');
        $hostname = gethostbyaddr($ip);
        if(\Auth::get('id')){
            \Model_TLogHistory::forge()->set([
                'm_user_id' => \Auth::get('id'),
                'ip_address' => $ip,
                'host_name' => $hostname,
                'date_time' => date('Y-m-d H:i:s'),
                'operation' => 'ログアウト'
            ])->save();
        }
       
        \Auth::logout();
        \Auth::dont_remember_me();

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_LOGOUT,
                    'message' => Exception::getMessage(Exception::E_LOGOUT)];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function clear session user
     * Method GET
     * Input: null
     * Destroy session and cookie
     * Response data: status[success|error]
     *=============================================================*/
    public function get_clear_session(){
        \Auth::logout();
        \Auth::dont_remember_me();

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED)];
        return $this->response($response);
    }

    

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function logout user
     * Method GET
     * Input: null
     * Destroy session and cookie
     * Response data: status[success|error]
     *=============================================================*/
    public function post_check_session_api(){
        $param = \Input::param();
        if(isset($param['current_user_info'])){
            $api_user_info_id = \Auth::get('id');
            $current_user_info = $param['current_user_info'];
            $current_user_info = json_decode($current_user_info);
           
            if($current_user_info->id != $api_user_info_id || empty($api_user_info_id)){
                \Auth::logout();
                \Auth::dont_remember_me();
                \Auth::instance()->force_login($current_user_info->id);
            }
        }else{
            \Auth::logout();
            \Auth::dont_remember_me();
        }

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED)];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function reset password
     * Method POST
     * Input: email
     * Call request send out email active
     *=============================================================*/
    public function post_forgot_password(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('email',__('Email', [], 'Email'),'required');

        if($validation->run()){
            //Check email exist of user
            $user = \Model_MUser::find('first', ['where' => ['email' => $param['email'], 'item_status' => 'active']]);
            if(!empty($user)){
                $random_code = \Vision_Common::randomString(6);
                $confirm_code = \Auth::hash_password($random_code);
                $user->set(['confirm_code' => $confirm_code])->save();

                //open socket send email
                $uri_query = ['m_user_id' => $user->id, 'confirm_code' => $random_code];
                $url_request = '/public/api/v1/system_socket/send_mail_active_password?' . http_build_query($uri_query);
                $this->send_request($url_request);
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => Exception::E_ACCEPTED,
                            'message' => Exception::getMessage(Exception::E_ACCEPTED)];

            }else{
                $validation_errors = ['email' => '正しくメールを記入してくだい。'];
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_VALIDATE_ERR,
                            'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                            'error' => $validation_errors];
            }
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                        'error' => $validation->error_message()];
        }
        
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function change password
     * Method POST
     * Input: password, new_password, re_password
     *=============================================================*/
    public function post_change_password(){
        $param = \Input::param();
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('password',__('Password', [], 'Password'),'required');
        $validation->add_field('new_password',__('New Password', [], 'New Password'),'required');
        $validation->add_field('re_password',__('Re Password', [], 'Re Password'),'required');
        
        if($validation->run()){
            //check current password
            $password = \Auth::hash_password($param['password']);
            $user = \Model_MUser::find('first', ['where' => ['id' => $param['id'], 'password' => $password]]);
            if(!empty($user)){
                $new_password = \Auth::hash_password($param['new_password']);
                $user->set(['password' => $new_password])->save();

                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'success',
                            'code' => Exception::E_ACCEPTED,
                            'message' => Exception::getMessage(Exception::E_ACCEPTED)];

            }else{
                $validation_errors = ['password' => 'パスワードが一致しません。'];
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_VALIDATE_ERR,
                            'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                            'error' => $validation_errors];
            }
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                        'error' => $validation->error_message()];
        }
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get list department of user
     * Method GET
     *=============================================================*/
    public function get_current_user_department(){
        $param = \Input::param();
        $user_info = \Auth::get();
        $enable_date = isset($param['enable_date'])?date('Y-m-d', strtotime($param['enable_date'])):date('Y-m-d');
        $data = [];
        if(!empty($user_info)){

            $query = \DB::select('MUD.id', 'MUD.m_user_id', 'MUD.fullname', 'MUD.staff_no', 'MUD.m_department_id', 'MUD.m_position_id', 'MUD.concurrent_post_flag', 'MUD.enable_start_date', 'MUD.enable_end_date',
                                \DB::expr('DEP.code AS department_code'), \DB::expr('DEP.sub_code AS department_sub_code'), \DB::expr('DEP.name AS department_name'),
                                \DB::expr('DIV.code AS division_code'), \DB::expr('DIV.name AS division_name'))
                        ->from(['m_user_department', 'MUD'])
                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                        ->where('m_user_id', '=', $user_info['id'])
                        ->and_where('MUD.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        ->order_by('MUD.concurrent_post_flag', 'ASC')
                        ->order_by('MUD.enable_start_date', 'ASC');

             // Filter concurrent_post_flag
            if(isset($param['concurrent_post_flag']) && !is_null($param['concurrent_post_flag'])){         
                $query->where('MUD.concurrent_post_flag', '=', $param['concurrent_post_flag']);
            }   


            $data = $query->execute()->as_array();
        }

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => count($data),
                    'data' => $data];
        return $this->response($response);
    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get change department and reload current user info
     * Method GET
     *=============================================================*/
    public function get_change_department(){
        $param = \Input::param();
        if(isset($param['m_department_id']) && !empty($param['m_department_id']) 
            && isset($param['m_position_id']) && !empty($param['m_position_id'])
            && isset($param['m_user_id']) && !empty($param['m_user_id'])
            ){
            //Update current department available
            \Model_MUser::find($param['m_user_id'])
                        ->set(['active_m_department_id' => $param['m_department_id'],
                               'active_m_position_id' => $param['m_position_id'],
                               'active_concurrent_post_flag' => $param['concurrent_post_flag']
                            ])->save();

            //Reload user info data
        }
        $user_info = \Model_MUser::getDetailUserInfo($param);


        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $user_info];
        return $this->response($response);
    }

    /*====================================================
     * Author: Nguyen Anh Khoa
     * Function check permission based on current URL
     * Method GET
     * permission_super
     * permission_hr            *
     * permission_general       *
     * permission_keiri         *
     * permission_system        *
     * permission_user
     *====================================================*/
    public function get_routes_permission(){
        $param = \Input::param();
        $user_info = \Auth::get();
        $route_url      = isset($param['route_url'])?$param['route_url']:null;
        // echo '<pre>';
        // print_r($param);
        // echo '</pre>';
        // echo '<pre>';
        // print_r($route_param);
        // echo '</pre>';
        // echo '<pre>';
        // print_r($route_query_param);
        // echo '</pre>';
        $route_permission = false;
        switch (true) {
            //System Area - Keiri Role - General Role - HR Role
            case preg_match('#^\/system\/menu-master(\/?|(\?.*)?)#imsU', $route_url):
                if($user_info['permission_general']){
                    $route_permission = true;
                    break;
                }
                if($user_info['permission_hr']){
                    $route_permission = true;
                    break;
                }
            case preg_match('#^\/system\/menu-payment(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/user(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/user\/create$#imsU', $route_url):
                if($user_info['permission_hr']){
                    $route_permission = true;
                    break;
                }
            case preg_match('#^\/system\/check\-routes(\/?|(\?.*)?)$#imsU', $route_url):
                if($user_info['permission_general']){
                    $route_permission = true;
                    break;
                }
                if($user_info['permission_hr']){
                    $route_permission = true;
                    break;
                }  
            case preg_match('#^\/management\/list\-form\-payment(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/trip\-benefits(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/expense(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/type\-finalization(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/obic(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/credit\-account(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/system\/user\/update#imsU', $route_url):  
                if($user_info['permission_keiri']) $route_permission = true;
                if($user_info['permission_system']) $route_permission = true;
                if($user_info['permission_hr']) $route_permission = true;
                break;

            //System Area - General Role - HR Role    
            case preg_match('#^\/system\/department(\/?|(\?.*)?)$#imsU', $route_url):    
            case preg_match('#^\/system\/department\/create$#imsU', $route_url):    
            case preg_match('#^\/system\/department\/update#imsU', $route_url):    
            case preg_match('#^\/system\/approval\-department(\/?|(\?.*)?)$#imsU', $route_url):    
            case preg_match('#^\/system\/approval\-menu(\/?|(\?.*)?)$#imsU', $route_url):    
            case preg_match('#^\/system\/approval\-department\-menu(\/?|(\?.*)?)$#imsU', $route_url):    
            case preg_match('#^\/system\/company(\/?|(\?.*)?)$#imsU', $route_url):    
            case preg_match('#^\/system\/bank(\/?|(\?.*)?)$#imsU', $route_url):  
            case preg_match('#^\/system\/change\-user\-department(\/?|(\?.*)?)$#imsU', $route_url):  
            case preg_match('#^\/system\/import\-user\-department(\/?|(\?.*)?)$#imsU', $route_url): 
                if($user_info['permission_hr']){
                    $route_permission = true;
                    break;
                }  
                if($user_info['permission_system']) $route_permission = true;
                break; 

            //System Area - System Role
            case preg_match('#^\/system(\/?|(\?.*)?|(\/.*)?)$#imsU', $route_url):
                if($user_info['permission_system']) $route_permission = true;
                break;

            //Management Area - System Role - Keiri Role - General Role - HR Role
            case preg_match('#^\/management/list\-form(\/?|(\?.*)?)$#imsU', $route_url):
                $route_permission = true;
                break;

            //Home Area - System Role - Keiri Role - General Role - HR Role
            case preg_match('#^\/list\-form(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/check\-routes(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/proposal\/form\/(\/?|(\?.*)?)$#imsU', $route_url):
            case preg_match('#^\/payment\/form\/(\/?|(\?.*)?)$#imsU', $route_url):
                $route_permission = true;
                if($user_info['permission_hr']) $route_permission = false;
                if($user_info['permission_general']) $route_permission = false;
                if($user_info['permission_keiri']) $route_permission = false;
                if($user_info['permission_system']) $route_permission = false;
                break;

            default:
                $route_permission = true;
                break;
        }

        $data['route_permission'] = $route_permission;
        
        /*================== Exist Session User ================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];

        /*==================================================
         * Response Data
         *==================================================*/
        return $this->response($response);
    }

     /*=============================================================
     * Author: Hoang Phong Phu
     * Function check identity export OBIC | FB
     * Input: user_id, password, export_type
     * Login with user_id & password
     * Method POST
     *=============================================================*/
    public function post_check_identity(){
        $param = \Input::param();
        $val = \Validation::forge();
        $val->add_field('user_id', __('User ID', [], 'User ID'), 'required');
        $val->add_field('password', __('Password', [], 'Password'), 'required');
        if ($val->run($param)) {
            $user_info = \Auth::validate_user($param['user_id'], $param['password']);

            if($user_info){
                $allow_export = false;
                if(isset($param['export_type']) && !empty($param['export_type'])){
                    switch ($param['export_type']) {
                        case 'obic':
                            if($user_info['permission_export_obic']) $allow_export = true;
                            break;
                        case 'fb':
                            if($user_info['permission_export_fb']) $allow_export = true;
                            break;
                        
                    }
                }

                //Check Permission
                if($allow_export){
                    $response = [
                        'status' => 'success',
                        'code' => Exception::E_LOGIN_OK,
                        'message' => Exception::getMessage(Exception::E_LOGIN_OK),
                        'data' => $user_info
                    ];
                }else{
                    $response = [
                        'status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                        'error' => ['msg_error' => 'このファイルにアクセスする権限がありません']
                    ];
                }
                
            }else{
                $response = [
                    'status' => 'error',
                    'code' => Exception::E_VALIDATE_ERR,
                    'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                    'error' => ['msg_error' => 'ログインエラーユーザーIDまたはパスワードに誤りがあります。']
                ];
            }
        }else{
            $response = [
                'status' => 'error',
                'code' => Exception::E_VALIDATE_ERR,
                'message' => Exception::getMessage(Exception::E_VALIDATE_ERR),
                'error' => ['msg_error' => 'ユーザーIDまたはパスワードを入力してください。']
            ];
        }

        /*==================================================
         * Response Data
         *==================================================*/
        return $this->response($response);
    }
    
}