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

class Controller_System_General extends \Controller_API {
	public function before() {
        parent::before();
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function generate key
     * Method GET
     *=============================================================*/
    public function get_generate_data(){
        //Generate Item Key
        $data['item_key'] = \Vision_Common::randomItemKey();


        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => count($data),
                    'data' => $data];
        return $this->response($response);
    }


    /*===================================================
     * Author : k_nguyen
     * Class generate image
     * path & file name encode by base64_encode();
     * @Param:
     *      + @path | path of image, ex: user/origin
     *      + @file | name of image, ex: sample.jpg
     *      + @width, @height | resize image, ex: width=200&height=200
     *      + @scale | resize image based on percent, ex: scale=50
     *      + @square | resize image to square, ex: square=50
     *===================================================*/
    public function action_image(){
        $param = \Input::param();
        $path = isset($param['filepath'])?base64_decode($param['filepath']):null;
        $file = isset($param['filename'])?base64_decode($param['filename']):null;
        $full_file = FILESPATH . $path;
        //================== Check File Exist ===============
        if(!file_exists($full_file) || empty($file)){
            $full_file = IMG_PLACEHOLDER_URL;
        }
        //================== Init Class Image ===============
        $image = new \Vision_Image($full_file);
        //================== Resize Image ===================
        if(isset($param['width']) && isset($param['height'])){
            $image->resize((float)$param['width'], (float)$param['height']);
        }else if(isset($param['width']) && !isset($param['height'])){
            $image->resizeToWidth((float)$param['width']);
        }else if(!isset($param['width']) && isset($param['height'])){
            $image->resizeToHeight((float)$param['height']);
        }

        //=================== Scale Image ====================
        if(isset($param['scale'])){
            $image->scale((float)$param['scale']);
        }

        //=================== Resize to Square Image ====================
        if(isset($param['square'])){
            $image->square((float)$param['square']);
        }
        $image->output();
        return \Response::forge();
    }
}