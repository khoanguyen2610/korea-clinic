<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 16:11:21
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-13 10:37:39
 */

namespace Main;
    
class Controller_Sync extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');
    }

 	public function action_index(){
        return \Response::forge();
    }
}
