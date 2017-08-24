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
    
class Controller_Index extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');
    }

    public function action_index(){
		$this->theme->get_template()->set('content', \view::forge('index/index', $this->_arrParam));
    }

}
