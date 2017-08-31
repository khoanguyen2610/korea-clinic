<?php

class Vision_Common {
	static function convertDateTimeFormat($sDateTime, $sFromFormat, $sToFormat = 'Y-m-d H:i:s') {
		$dr= date_create_from_format($sFromFormat, $sDateTime);
		if($dr)
			return $dr->format($sToFormat);
		return '';
	}

	static function coverArrToString($arrInput,$sKey="id"){
		$sResult = "";
		foreach ($arrInput as $item){
			$sResult .= "'".$item[$sKey]."',";

		}
		$sResult = substr($sResult, 0, -1);

		return !$sResult?"0":$sResult;
	}

	static function extractArr($arrInput,$sKey="id"){
		$arrResult = array();
		foreach ($arrInput as $item){
			$arrResult[] = $item[$sKey];
		}
		return $arrResult;
	}

	static function groupArrBykey($arrInput,$sField='id'){
		$arrResult = array();
		foreach ($arrInput as $item){
			$arrResult[$item[$sField]][] = $item;
		}
		return $arrResult;
	}

	/*==================================================================
	 * Author: Nguyen Anh Khoa
	 * Function clone function "trim()" of php
	 * Trim space 2byte of JP, tabspace, etc...
	 * Input: string
	 * Output: string
	 *==================================================================*/
	static function trim($str){
		return preg_replace('/(^(\s|\t|　)*|(\s|\t|　)*$)/', '', $str);
	}

	/*==================================================================
	 * Author: Nguyen Anh Khoa
	 * Function clone function "as_array()" of model, using for ORM
	 * Input: data(array|object|single|multiple)
	 * key = key of array expected
	 * value = value of array expected
	 *==================================================================*/
	static function as_array($object, $key = null, $value = null){
		$result = [];
		if ($key === null and $value === null){
			if(is_array($object)){
				foreach ($object as $k => $v) {
					$result[$k] = $v->to_array();
				}
			}elseif(!empty($object)){
				$result = $object->to_array();
			}else{
				$result = $object;
			}
		}elseif($key === null){
			if(is_array($object)){
				foreach ($object as $k => $v) {
					$result[] = $v->$value;
				}
			}else{
				$result[] = $object->$value;
			}
		}elseif($value === null){
			if(is_array($object)){
				foreach ($object as $k => $v) {
					$result[$v->$key] = $v->to_array();
				}
			}else{
				$result[$object->$key] = $object->to_array();
			}
		}else{
			if(is_array($object)){
				foreach ($object as $k => $v) {
					$result[$v->$key] = $v->$value;
				}
			}else{
				$result[$object->$key] = $object->$value;
			}
		}
		return $result;
	}

	/*==================================================================
	 * Author: Nguyen Anh Khoa
	 * Function create number with prefix zero
	 * Input: number
	 * Output: string number
	 * Example: Input 60, 6 => Output: 000060
	 *==================================================================*/
	static function create_number($value,$max_length = 6){
		$code = '';
		if($remain = $max_length - strlen($value)){
			while($remain>0){
				$code .= '0';
				$remain--;
			}
		}
		$value = (string) $value;
		return $code.$value;
	}

	/*=============================================
	 * Global Display Date Based On Format
	 *=============================================*/
	static function system_format_date($strDate, $time = false, $hour = true, $minute = true, $second = true){
		$system_format = 'Y/m/d';
		if($time){
			if($hour && $minute && $second){
				$system_format .= ' H:i:s';
			}elseif($hour && $time && !$second){
				$system_format .= ' H:i';
			}elseif($hour && !$time && !$second){
				$system_format .= ' H';
			}elseif(!$hour && $time && $second){
				$system_format .= ' i:s';
			}elseif(!$hour && !$time && $second){
				$system_format .= ' s';
			}else{
				$system_format .= ' H:i:s';
			}
		}
		return date($system_format, $strDate);
	}

	/*=============================================
	 * create random string
	 *=============================================*/
	public static function randomString($len = 10) {
	    $str = substr( str_shuffle( 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' ) , 0 , $len );
	    return $str;
	}

	/*=============================================
	 * create random string
	 *=============================================*/
	public static function randomItemKey($params = null) {
	    return strtotime('now') . rand(1, 99999);
	}

	/*===================================================
	 * Author : k_nguyen
	 * Class generate image
	 * path & file name encode by base64_encode();
	 * @Param:
	 *		+ @filepath | path of image, ex: user/origin
	 *		+ @filename | name of image, ex: sample.jpg
	 *		+ @width, @height | resize image, ex: width=200&height=200
	 *		+ @scale | resize image based on percent, ex: scale=50
	 *		+ @square | resize image to square, ex: square=50
	 *===================================================*/
	public static function generate_image(){
		$param = \Input::param();
		$path = isset($param['filepath'])?base64_decode($param['filepath']):null;
		$file = isset($param['filename'])?base64_decode($param['filename']):null;
		$full_file = FILESPATH . $path . $file;
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
