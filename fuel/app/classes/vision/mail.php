<?php
class Vision_Mail {
    static $_env = 'live'; //live - dev
    static $_receiver_email_dev = ['m_luu@vision-net.co.jp', 'k_nguyen@vision-net.co.jp', 'p_hoang@vision-net.co.jp'];
    static $_email = 'system_info@vision-net.co.jp';
    static $_system_email = 'system@vision-net.co.jp';


    /*============================================
     * Email Reset Password Send To User
     *============================================*/
    public static function mailForgotPass($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);
        $mail->to($arrParam['email']);
        $mail->subject('【VWS】パスワードリセット通知');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        　返信しても回答はありませんのでご了承ください。<br/><br/>
                        <strong>" . $arrParam['fullname'] . "</strong>　さん<br/><br/>
                        VWSのログインパスワードをリセットしました。<br/>
                        パスワードは<br/><br/>
                        " . $arrParam['confirm_code'] . "<br/><br/>
                        になります。下記のURLでパスワードを有効してくだい、<br/><br/>
                        <a href=" . $arrParam['link_active'] . " >" . $arrParam['link_active'] . "</a><br/>
                        このパスワードでログインし、パスワード変更を行ってください。<br/>
                        よろしくお願いいたします。";
        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);


        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'forgot_password',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => $arrParam['email'],
                'status' => 'success'
                ];
        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*========================================================
     * Email Notify User Reset Password Send To System
     *========================================================*/
    public static function mailForgotPassToSystem($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);
        $mail->to(self::$_system_email);
        $mail->subject('【VWS】パスワードリセット通知(システム管理向け)');
        $bodyHtml   = "ログインユーザ　<strong>" . $arrParam['user_id'] . "</strong>　がパスワードリセットを行いました。";
        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);


        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'forgot_password_to_system',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => self::$_system_email,
                'status' => 'success'
                ];
        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*====================================================================
     * Email Notify Next Approval User When Form is approved
     * Approval Type = approve
     * Approval Type = 承認
     *====================================================================*/
    public static function approve_form_to_next_approval($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 決裁・審議依頼連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        " . $arrParam['applicant_name'] . " さんから、以下の申請がありました。<br/><br/>
                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/><br/>
                        現在、" . $arrParam['receiver_name'] . " さんの審議・決裁待ちの状態です。<br/>
                        VWSにログインし、審議・決裁一覧から審議・決裁を行ってください<br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";

        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);


        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'approve_form_to_next_approval',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];
        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*=====================================================================================================
     * Email Notify User When User Has Aprroval - 審議 Permission
     * Notice: Just send the first one who has Aprroval - 審議 Permission [*]
     * Approval Code = 02[*]
     *====================================================================================================*/
    public static function apply_form_approval($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 決裁・審議依頼連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        " . $arrParam['applicant_name'] . " さんから、以下の申請がありました。<br/><br/>
                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/><br/>
                        現在、" . $arrParam['receiver_name'] . "さんの審議・決裁待ちの状態です。<br/>
                        VWSにログインし、審議・決裁一覧から審議・決裁を行ってください<br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";
        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'apply_form_approval',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*====================================================================
     * Email Notify User When Form is last approved
     * Approval Type = last_approve
     * Approval Type = 最終承認
     *====================================================================*/
    public static function last_approve_form_to_creator($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 最終承認連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/><br/>
                        こちらの稟議・申請が最終承認されました。<br/>
                        VWSにログインし、内容をご確認ください。<br/><br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";

        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'last_approve_form_to_creator',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*====================================================================
     * Email Notify User When Form is returned or denied
     * Approval Type = return | deny
     * Approval Type = 差戻 | 否認
     *====================================================================*/
    public static function return_deny_form_to_creator($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 差戻/否認 連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        以下の申請が差戻/否認されました。<br/><br/>

                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/><br/>
                        VWSにログインし、内容をご確認ください<br/>
                        よろしくお願いいたします。";

        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'return_deny_form_to_creator',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*====================================================================
     * Email Notify Next Approval User When Form is returned or denied
     * Approval Type = return | deny
     * Approval Type = 差戻 | 否認
     *====================================================================*/
    public static function return_deny_form_to_next_approval($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 差戻/否認 連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        以下の申請が差戻/否認されました。<br/><br/>
                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";

        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'return_deny_form_to_next_approval',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }



    /*====================================================================
     * Email Notify current Approval User When Form is waiting confirm
     * Approval Type = waiting_confirm
     * Approval Type = 後閲
     *====================================================================*/
    public static function waiting_confirm_form_to_approval($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 後閲連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        以下の申請にて " . $arrParam['receiver_name'] . " さんが" . $arrParam['sender_name'] . "さんに後閲されました。<br/>
                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/><br/>
                        後ほどVWSにログインし、該当の申請の後閲確認をお願いいたします。<br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";
        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'waiting_confirm_form_to_approval',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*====================================================================
     * Email Notify Next Approval User When Form is waiting confirm
     * Approval Type = waiting_confirm
     * Approval Type = 後閲
     *====================================================================*/
    public static function waiting_confirm_form_to_next_approval($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID: ' . $arrParam['code'] . ' 決裁・審議依頼連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        " . $arrParam['applicant_name'] . " さんから、以下の申請がありました。<br/><br/>
                        申請ID： " . $arrParam['code'] . "<br/>
                        様式： " . $arrParam['menu_name'] . "<br/><br/>
                        現在、" . $arrParam['receiver_name'] . " さんの審議・決裁待ちの状態です。<br/>
                        VWSにログインし、審議・決裁一覧から審議・決裁を行ってください<br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";
        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'waiting_confirm_form_to_next_approval',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    /*====================================================================
     * Email to talknote
     *====================================================================*/
    public static function mail_to_talknote($arrParam){
        $mail = \Email::forge();
        $to_email = $arrParam['receiver_email'];
        $mail->from(self::$_email, self::$_email);
        $mail->to($arrParam['receiver_email']);
        $mail->subject('【VWS】申請No： '.$arrParam['code']);
        $mail->html_body($arrParam['content']);
        $mail->priority(\Email::P_HIGH);


        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'mail_to_talknote',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];

        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
        return true;
    }

    /*============================================
     * Email Comment To User
     *============================================*/
     public static function mailWhenUserComment($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);

        if(self::$_env == 'dev'){
            $to_email = self::$_receiver_email_dev;
            $mail->to(self::$_receiver_email_dev);
        }else if(self::$_env == 'live'){
            $to_email = $arrParam['receiver_email'];
            $mail->to($arrParam['receiver_email']);
        }

        $mail->subject('【VWS】申請ID： ['.$arrParam['code'] . '] コメント確認連絡');
        $bodyHtml   = "※このメールは送信専用のメールアドレスから送信しています。<br/>
                        返信しても回答はありませんのでご了承ください。<br/><br/>
                        " . $arrParam['receiver_name'] . " さん<br/><br/>
                        " . $arrParam['user_comment_name'] . " さんから、以下のコメントがありました。<br/><br/>
                        起案番号：" . $arrParam['code'] . "<br/>
                        件名：" . $arrParam['menu_name'] . "<br/>
                        起案者: " . $arrParam['applicant_name'] . "<br/>
                        コメント: " . $arrParam['comment_content'] . "<br/><br/>

                        VWSにログインし、審議・決裁一覧からコメント確認を行ってください<br/>
                        " . \Html::anchor($arrParam['petition_url'], $arrParam['petition_url']) . "<br/><br/>
                        よろしくお願いいたします。";
        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);

        //process send mail & save history
        $arr = ['date' => date('Y-m-d H:i:s'),
                'type' => 'when_user_comment',
                'request_user_id' => $arrParam['request_user_id'],
                'to_email' => is_array($to_email)?json_encode($to_email):$to_email,
                'data' => json_encode($arrParam),
                'status' => 'success'
                ];
        try{
            $mail->send();
            self::mail_history($arr);
            return true;
        } catch(Exception $e){
            $arr['status'] = 'fail';
            self::mail_history($arr);
            return false;
        }
    }

    //save history
    private static function mail_history($data){
        $hostname = null;
        $ip = \Input::server('HTTP_X_FORWARDED_FOR')?:\Input::server('REMOTE_ADDR');
        $hostname = gethostbyaddr($ip);
        $data['ip'] = $ip;
        $data['host_name'] = $hostname;
        \Model_System_VsvnMailHistory::forge()->set($data)->save();
    }
}
