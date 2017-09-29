<?php
class Vision_Mail {
    static $_email = 'whiteclinic93vvt@gmail.com';


    /*============================================
     * Email Reset Password Send To User
     *============================================*/
    public static function mailContact($arrParam, $options = null){
        $mail = \Email::forge();
        $mail->from(self::$_email, self::$_email);
        $mail->to('whiteclinic93@gmail.com');
        $mail->subject('Thông tin liên hệ');


        $contents = file_get_contents(MAILTEMPLATE_PATH . 'contact.html');
        $params = [
            '{fullname}' => $arrParam['fullname'],
            '{email}' => $arrParam['email'],
            '{subject}' => $arrParam['subject'],
            '{content}' => $arrParam['content'],
        ];
        $bodyHtml = str_replace(array_keys($params), array_values($params), $contents);


        $mail->html_body($bodyHtml);
        $mail->priority(\Email::P_HIGH);


        try{
            $mail->send();
            return true;
        } catch(Exception $e){
            return false;
        }
    }

}
