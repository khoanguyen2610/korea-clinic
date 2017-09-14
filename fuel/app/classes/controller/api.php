<?php

/**
 * PHP Class
 *
 * LICENSE
 *
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 29, 2016 01:59:33 PM
 */

use \Controller\Exception;
class Controller_API extends Controller_Rest {

    protected $_arrParam;

    public function before() {
        parent::before();
        set_time_limit(0);
        ini_set('memory_limit', '-1');
        $module = isset($this->request->module) ? $this->request->module : 'none';
        $controller = preg_match('#^(.*\\\)?Controller_(.*)#', $this->request->controller, $matches);
        $controller = strtolower($matches[2]);
        $action = $this->request->action;

        $this->_arrParam = array(
            'module' => $module,
            'controller' => $controller,
            'action' => $action
        );

        /*====================================
         * Set global parameters
         *====================================*/
        $this->_arrParam['named_params'] = $this->request->named_params;
        $this->_arrParam['post_params'] = \Input::param();
        $this->_arrParam['request_header'] = getallheaders();

        /*====================================
         * Set parameter of fuelphp pagination
         *====================================*/
        $this->_arrParam['pagination'] = array(
                                            'per_page' => 5,
                                            'uri_segment' => 'page',
                                            'num_links' => 5,
                                            'name' => 'default'
        );

        /*====================================
         * Get & set language
         *====================================*/
        $lang_code = \Cookie::get('lang_code');
        $lang_code = (isset($lang_code) && !empty($lang_code))?$lang_code:\Config::get('language');
        $this->_arrParam['default_lang_code'] = $lang_code;
        \Cookie::set('lang_code', $lang_code);
        \Config::set('language', $lang_code);
        \Lang::load(APPPATH . DS . 'lang' . DS . $lang_code . DS . 'language.json');

        /*===========================================
         * Load REST configuration
         *===========================================*/
        \Config::load('rest', true);

        /*===================================================
         * Create Vision Rest And Variable
         *===================================================*/
        $this->rest = new \Vision_Rest();

        /*===========================================
         * Check Header API Token
         *===========================================*/
        $api_token = self::auth_token_api();
        $api_token = true;
        if($api_token != true){
            $response = json_encode(['status' => 'error',
                                    'code' => Exception::E_INVALID_TOKEN,
                                    'message' => Exception::getMessage(Exception::E_INVALID_TOKEN),
                                    ]);
            exit($response);
        }
    }

    public function get_permission($arrParam = null){
        $module     = empty($arrParam['module'])?$this->_arrParam['module']:$arrParam['module'];
        $controller = empty($arrParam['controller'])?$this->_arrParam['controller']:$arrParam['controller'];
        $action     = empty($arrParam['action'])?$this->_arrParam['action']:$arrParam['action'];


        return \Auth::has_access('module_' . $module  . '.'
                                 . $controller
                                 . '.[' . $action . ']');
    }

    /*===========================================
     * Check account access API
     * Sample account: k_nguyen/123
     *===========================================*/
    protected function auth_token_api($arrParam = null){
        $request_header = $this->_arrParam['request_header'];
        $x_vision_username = (isset($request_header['X-Vision-Username']) && !empty($request_header['X-Vision-Username']))?$request_header['X-Vision-Username']:null;
        $x_vision_api_token = (isset($request_header['X-Vision-API-Token']) && !empty($request_header['X-Vision-API-Token']))?$request_header['X-Vision-API-Token']:null;

        if(!empty($x_vision_username) && !empty($x_vision_api_token)){
            if($x_vision_username == 'visionvn' && $x_vision_api_token == 'system_vsvn'){
                return true;
            }
        }
        return false;
    }

    public function send_request($path){
        $path = DIRECTORY_NAME . $path;
        $fp = fsockopen(HOST, PORT, $errno, $errstr, 30);
        if (!$fp) {

        }else {
            $basic_auth = \Config::get('rest.valid_logins');

            $username = !empty($basic_auth)?current(array_keys($basic_auth)):null;
            $password = !empty($basic_auth)?current(array_values($basic_auth)):null;
            $auth = base64_encode("{$username}:{$password}");
            $out = "GET " . $path . " HTTP/1.1\r\n";
            $out .= "Host: " . HOST . "\r\n";
            $out .= "Authorization: Basic " . $auth . "\r\n";
            $out .= "Connection: Close\r\n\r\n";
            fwrite($fp, $out);
            sleep(1); //delay 1s
            fclose($fp);
            return true;
        }
    }
}
