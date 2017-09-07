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
     * Login with username & password
     * Method POST
     *=============================================================*/
    public function post_login(){
        $param = \Input::param();
        $user_info = \Auth::get();

        if(empty($user_info)){
            $val = \Validation::forge();
            $val->add_field('username', __('Username', [], 'Username'), 'required');
            $val->add_field('password', __('Password', [], 'Password'), 'required');
            if ($val->run($param)) {
                if (\Auth::instance()->login($param['username'], $param['password'])) {
                    $user_info = \Auth::get();
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
                            'error' => ['msg_error' => 'Enter any username and password.']];

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

}
