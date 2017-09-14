<?php

/**
 * PHP Class
 *
 * LICENSE
 *
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */

class Controller_Common extends Controller_Template {

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

        $QUERY_STRING = !empty($_SERVER['QUERY_STRING'])?'?' . $_SERVER['QUERY_STRING']:'';
        $this->_arrParam['path_uri'] = \Uri::string() . $QUERY_STRING;

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

        /*===================================================
         * Create theme variable
         *===================================================*/
        $this->theme = Theme::instance();
        $this->theme->asset->add_path(DOCROOT);

        /*===================================================
         * Create Vision Rest And Variable
         *===================================================*/
        $this->rest = new \Vision_Rest();
    }

    public function get_permission($arrParam = null){
        $module     = empty($arrParam['module'])?$this->_arrParam['module']:$arrParam['module'];
        $controller = empty($arrParam['controller'])?$this->_arrParam['controller']:$arrParam['controller'];
        $action     = empty($arrParam['action'])?$this->_arrParam['action']:$arrParam['action'];

        return \Auth::has_access('module_' . $module  . '.'
                                 . $controller
                                 . '.[' . $action . ']');
    }

    public function set_meta($meta = null) {
        echo Html::meta($meta);
    }

    public function no_view() {
        $theme = \Theme::instance();
        $theme->get_template()->set('content', '');
    }

    public function no_layout() {
        $theme = \Theme::instance();
        $theme->set_template('no_layout');
    }

    public function send_request($host,$port,$path){
        $fileDir = DOCROOT . 'files' . DS . 'system-logs' . DS . 'socket-' . date('Y-m-d-H-i-s') . '.log';
        $fp = fsockopen($host, $port, $errno, $errstr, 30);
        if (!$fp) {
            // @file_put_contents($fileDir, "$errstr ($errno)<br />\n", FILE_APPEND | LOCK_EX);
        }else {
            $out = "GET ".$path." HTTP/1.1\r\n";
            $out .= "Host: ".$host."\r\n";
            $out .= "Connection: Close\r\n\r\n";
            fwrite($fp, $out);
            sleep(1); //delay 1s
            fclose($fp);
            return true;
        }
    }

    public function after($response) {
        if (empty($response) or !$response instanceof Response) {
            $response = \Response::forge(\Theme::instance()->render());
        }
        return parent::after($response);
    }
}
