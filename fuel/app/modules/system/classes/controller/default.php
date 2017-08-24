<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */


namespace System;
    
class Controller_Default extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');
    }

   
    public function action_login(){
        $call_back_uri = \Input::param('call_back_uri');
        $url_redirect = !empty($call_back_uri)?\Uri::create($call_back_uri):\Uri::create('system/index/index');
        if (\Auth::check()) {
            \Response::redirect($url_redirect);
        }

        if(\Input::is_ajax()){
            $val = \Validation::forge('validate_login');
            $val->add_field('email', 'Email', 'required|valid_email');
            $val->add_field('password', 'Password', 'required');
            if ($val->run(array())) {
                if (\Auth::instance()->login(\Input::param('email'), \Input::param('password'))) {
                    if (\Input::param('remember', false)) {
                        \Auth::remember_me();
                    } else {
                        \Auth::dont_remember_me();
                    }
                    $response = array('status' => 'success', 'url' => $url_redirect);
                }else{
                    $messages = \Auth::get_error();
                    $response = array('status' => 'error', 'msg' => $messages);
                }
            }else{
                $messages = $val->error_message();
                $response = array('status' => 'error', 'msg' => $messages);
            }
            return \Response::forge(json_encode($response));
        }
         
        $this->theme->set_template('login');
		$this->theme->get_template()->set('content', \view::forge('default/login', $this->_arrParam));
    }

    public function action_logout(){
        \Auth::logout();
        \Auth::dont_remember_me();
        \Response::redirect('system/default/login');
        $this->no_layout();
        $this->no_view();   
    }

    public function action_response($code){
        $this->_arrParam['response_code'] = $code;
        switch ($code) {
            case '403':
                $this->_arrParam['response_content'] = __('Oops, an error has occurred. Forbidden!', array(), 'Oops, an error has occurred. Forbidden!');
                break;
            case '500':
                $this->_arrParam['response_content'] = __('Oops, an error has occurred. Internal server error!', array(), 'Oops, an error has occurred. Internal server error!');
                break;
            case '503':
                $this->_arrParam['response_content'] = __('Oops, an error has occurred. Service unavailable!', array(), 'Oops, an error has occurred. Service unavailable!');
                break;
            case 'Offline':
                $this->_arrParam['response_content'] = __('Sorry, our website is temporary offline!', array(), 'Sorry, our website is temporary offline!');
                break;
            default:
                $this->_arrParam['response_code'] = '404';
                $this->_arrParam['response_content'] = __('Oops, an error has occurred. Page not found!', array(), 'Oops, an error has occurred. Page not found!');
                break;
        }
        $this->theme->get_template()->set('content', \view::forge('default/response', $this->_arrParam));
    }
}
