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

class Controller_System_Socket extends \Controller_API {
	public function before() {
        parent::before();
        ini_set("memory_limit", -1);
        set_time_limit(0);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function send out email activate new password
     *=============================================================*/
    public function get_send_mail_contact(){
        $param = \Input::param();
        $arrMails = ['fullname' => $param['fullname'],
                    'email' => $param['email'],
                    'subject' => $param['subject'],
                    'content' => $param['content']
                    ];

        //=============== Send email activate to user ====================
        $result = \Vision_Mail::mailContact($arrMails);
        exit;
    }
}
