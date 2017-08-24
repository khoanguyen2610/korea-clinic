<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:24:17
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-14 16:38:14
 */
namespace Client;
use \Controller\Exception;

class Controller_Download extends \Controller_Common {
	public function before() {
        parent::before();
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Action download form file
     * input: attachment_id, attachment_type(attachment - form_input), m_user_id
     *=============================================================*/
    public function action_form_attachment(){

        $param = \Input::param();
        if(isset($param['p'])){
            parse_str(base64_decode($param['p']), $param);
        }
        if(isset($param['attachment_id']) && !empty($param['attachment_id'])){
            $attachment_id = $param['attachment_id'];
            $filepath = $filename = $storage_path = null;
            switch ($param['attachment_type']) {
                case 'form_attachment':
                    $files = \Model_TFormAttachment::find($attachment_id);
                    $filepath = $files->filepath;
                    $filename = $files->filename;

                    switch ($files->petition_type) {
                        case 1:
                            $storage_path = FTPPROPOSALPATH;
                            break;
                        case 2:
                            $storage_path = FTPPAYMENTPATH;
                            break;
                    }
                    break;
                case 'form_input':
                    $files = \Model_TProposalInput::find($attachment_id); 
                    if(!empty($files->value)){
                        $files = json_decode($files->value);
                        $filepath = $files->filepath;
                        $filename = $files->filename;
                        $storage_path = FTPPROPOSALPATH;
                    }
                    break;
                
            }

            if($filepath && $filename){
                $direct_view = isset($param['direct_view'])?$param['direct_view']:false;     
                //get link connect to ftp
                $ftp_config = \Config::load('ftp');
                $ftp = array_shift($ftp_config);
                $link = 'ftp://'.$ftp['username'].':'.$ftp['password'].'@'.$ftp['hostname'].'/';
                
                //================== Init Class Download ===============
                $args = [
                    'download_path'     =>  $link.$storage_path,
                    'file'              =>  $filepath,      
                    'origin_file_name'  =>  $filename,      
                    'direct_view'       =>  $direct_view,
                ];
                
                $download = new \Vision_Download($args);
                $download_hook = $download->get_download_hook();
               
                    $download->get_download();
                if( $download_hook['download'] == TRUE ) {

                }else{
                    // \Response::redirect('system/default/response');
                }
            }
        }
        exit;
    }

}