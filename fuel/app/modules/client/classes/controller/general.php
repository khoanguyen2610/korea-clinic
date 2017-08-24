<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-09 15:29:25
 */
namespace Client;
use \Controller\Exception;

class Controller_General extends \Controller_Common {
	public function before() {
        parent::before();
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Action active new password
     *=============================================================*/
    public function action_active(){
        $param = \Input::param();
        $u      = $param['u'];
        $k      = $param['k'];
        $type   = $param['type'];

        switch ($type) {
            case 'forgot':
                $msgTitle = 'パスワードをリセットしました。';
                $user = \Model_MUser::find('first', ['where' => ['id' => $u, 'item_status' => 'active']]);
                if($user->confirm_code == $k){
                    $user->set(['password' => $k, 'confirm_code' => null])->save();
                    $message = 'パスワードをリセットしました。';
                    \Response::redirect(CLIENT_URL);
                }else{
                    $message = 'URLを無効しましたので、パスワードをリセットできませんでた。';
                }
                break;
        }

        return \Response::forge($message);
    }

}