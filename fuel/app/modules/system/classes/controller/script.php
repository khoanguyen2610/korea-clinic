<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 2, 2016 02:23:19 PM
 */

namespace System;

class Controller_Script extends \Controller_Common {
	public function action_test(){
		$tem = \DB::select()
	             ->from('users')->execute('old_system')->as_array();
	             echo '<pre>';
	             print_r($tem);
	             echo '</pre>';
		die;
	}
	/*===================================================
	 * Change language
	 *===================================================*/
	public function action_change_language($lang_code){
        if(!empty($lang_code)){
            /*=============== Set Cookie Lang Code 60 Days =====================*/
            \Cookie::set('lang_code', $lang_code, 86400 * 60);
            \Response::redirect($_GET['call_back_uri']);
        }
        return \Response::forge();
    }

	/*===================================================
	 * Scan And Upload List Module - Controller - Action
	 *===================================================*/
	public function action_update_mca(){
		$arrExceptModule = ['api_v1', 'api_v2'];
		$mpath = APPPATH.'modules';
		try{
			$module = \File::read_dir($mpath,2);
			
			foreach($module as $k => $v){
				$module_name = str_replace('\\', '', $k);
				$module_name = str_replace('/', '', $k);
				$module_name = trim($module_name);
				if(in_array($module_name, $arrExceptModule))
					continue;

				$files_name = [];
				if(is_string($k)){
					if(preg_match('#[a-z_A-Z0-9]+#i',$k,$m)){
						$mn = array_shift($m);
						$mid = \Model_VsvnListMca::find('first', ['where' => ['name' => $mn, 'type' => 'module']]);
						$mid = !empty($mid)?$mid->id:0;
						if(empty($mid)){
							$obj = \Model_VsvnListMca::forge()->set(['name' => $mn, 'type' => 'module', 'parent' => 0]);
							$obj->save();
							$mid = $obj->id;
						}
						
						$path = $mpath.DS.$mn.DS.'classes'.DS.'controller';
						$files = \File::read_dir($path);
						$this->recursiveFile($files, $files_name);
						
						foreach($files_name as $file){
							$cn = substr($file,0,strpos($file,'.'));
							$cn = str_replace('|', '_', $cn);
							$cid = \Model_VsvnListMca::find('first', ['where' => ['name' => $cn, 'type' => 'controller', 'parent' => $mid]]);
							$cid = !empty($cid)?$cid->id:0;
							if(empty($cid)){
								$obj = \Model_VsvnListMca::forge()->set(['name' => $cn, 'type' => 'controller', 'parent' => $mid]);
								$obj->save();
								$cid = $obj->id;
							}
							
							$file_path = str_replace('|', DS, $file);
							$content = fopen($path . DS . $file_path,'r');
							
							while(!feof($content)){
								$line = fgets($content);
										
								if(strpos($line,'public')){
									if(preg_match('/action_(.*)\(.*\)\s*\{/',$line,$matches)){
										$aid = \Model_VsvnListMca::find('first', ['where' => ['name' => $matches[1], 'type' => 'action', 'parent' => $cid]]);
										$aid = !empty($aid)?$aid->id:null;
										if(empty($aid)){ 
											\Model_VsvnListMca::forge(['name' => $matches[1], 'type' => 'action', 'parent' => $cid])->save();
										}
									}
								}
							}
							fclose($content);
						}
					}
				}
			}
		}catch(\FileAccessException $e){
			$response = array('status' => 'error', 'msg' => __('An unexpected error occurred', array(), 'An unexpected error occurred'));
		}
		$response = array('status' => 'success', 'msg' => __('Record Updated Successfully', array(), 'Record Updated Successfully'));
		return \Response::forge(json_encode($response));
	}

	protected function recursiveFile($files, &$files_name = '', $key_arr = '', &$str_file_name = ''){
		if(!empty($files)){
			end($files);         
			$end_key = key($files);
			foreach($files as $key => $value){
				if(is_array($value)){
					$str_file_name .= !empty($key)?str_replace('\\', '', $key) . '|':'';
					$this->recursiveFile($files[$key], $files_name, $key, $str_file_name);
				}else{
					if(empty($str_file_name))
						$str_file_name .= !empty($key_arr)?str_replace('\\', '', $key_arr) . '|':'';
					$files_name[] = $str_file_name . $value;
					unset($files[$key]);
					if(empty($files) || $key == $end_key){
						$str_file_name = '';
					}
				}
			}
		}
	}	

	public function action_export_language($sLangCode){
		header('Pragma: public');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Content-Description: File Transfer');
		header('Content-Transfer-Encoding: binary');
		header('Content-Type: text/csv');
		$fp = fopen('php://output', 'w');
		fputcsv($fp, array('Origin Content','Translate Content','Language Code'));
		$arrTranslateResult = \Model_VsvnTranslate::find('all', ['where' => [['language_code', '=', $sLangCode]]]);
		$arrTranslateResult = \Vision_Common::as_array($arrTranslateResult);
		$arrTranslateTemp = array();
		foreach ($arrTranslateResult as $arrTranslateItem){
			$arrTranslateTemp[trim($arrTranslateItem['key'])] = $arrTranslateItem['value']; 
		}
		
		$arrPathFile = array();
		
		/**
		 * scan one path :  'type' => 'path'  
		 * scan multi path :'type'=> array('path1','path2')  
		 * */
		
		$arrPathScan = array(
				'php' => array(APPPATH.'modules',APPPATH.'classes', APPPATH . '..' . DS . 'themes'),
				'js'  => substr(DOCROOT,0,-1)
		);
		
		foreach ($arrPathScan as $sType => $sPathScan){ 
			
			$arrPath = array();
			if(is_string($sPathScan)){
				$arrPath [] = $sPathScan; 				
			}elseif(is_array($sPathScan)){
				$arrPath = $sPathScan;
			}
			foreach ($arrPath as $sPath){
				$di = new \RecursiveDirectoryIterator($sPath,\RecursiveDirectoryIterator::SKIP_DOTS);
				foreach (new \RecursiveIteratorIterator($di) as $filename) {
					if (pathinfo($filename, PATHINFO_EXTENSION) != $sType) {
						continue;
					}
					$dir = str_replace($sPath, '', dirname($filename));
					$dir = str_replace('/', '/', substr($dir,1));
					$sPathFile = $sPath.DS.trim($dir).DS.basename($filename);
					$arrPathFile[] = $sPathFile;
				}
			}
		}
		
		$arrExportTemp= array();
	    /**write file**/
	    foreach ($arrPathFile as $sPathFile){
	    	$content = fopen($sPathFile,'r');
	    	while(!feof($content)){
	    		$line = fgets($content);
	    		$sPatent = "";
	    		$sTypeFile = pathinfo($sPathFile, PATHINFO_EXTENSION);
	    		if(preg_match("/__\(([^,]*),([^,]*),([^)]*)\)/",$line,$matches)){
	    			$sKey = trim(str_replace(array('"',"'"), array('',''), $matches[1]));
	    			if(array_key_exists($sKey,$arrTranslateTemp )){
	    				$sValue = $arrTranslateTemp[$sKey];
	    			}else{
	    				$sValue = "";
	    			}
	    			if(in_array($sKey, $arrExportTemp)){
	    				continue;
	    			}
	    			fputcsv($fp, array($sKey,$sValue,$sLangCode));
	    			$arrExportTemp[] = $sKey;
	    		}
	    	}	    	
	    }
	    
	    $arrLang = \Model_VsvnLanguage::find('first', ['where' => ['code' => $sLangCode]]);
		$arrLang = \Vision_Common::as_array($arrLang);
	    $sFileName = strtolower($arrLang['name']).'_'.date("Ymd").'.csv';
	    
		header("Content-Disposition: attachment; filename=$sFileName"); 
		exit;
	}

    /*===================================================
	 * Author : k_nguyen
	 * Class generate image
	 * path & file name encode by base64_encode();
	 * @Param: 
	 *		+ @path | path of image, ex: user/origin
	 *		+ @file | name of image, ex: sample.jpg
	 *		+ @width, @height | resize image, ex: width=200&height=200
	 *		+ @scale | resize image based on percent, ex: scale=50
	 *		+ @square | resize image to square, ex: square=50
	 *===================================================*/
	public function action_image(){
		$param = \Input::param();
		$path = isset($param['path'])?base64_decode($param['path']):null;
		$file = isset($param['path'])?base64_decode($param['file']):null;
		$full_file = STORAGE_PATH . $path . $file;
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

    /*===================================================
	 * Author : k_nguyen
	 * Class download file
	 * path & file name encode by base64_encode();
	 * @Param: 
	 *		+ @path | path of image, ex: user/origin
	 *		+ @file | name of image, ex: sample.jpg
	 *		+ @direct_view | can view direct file image, txt, pdf on browser
	 *===================================================*/
	public function action_download(){
		$param = \Input::param();
		$path 			= isset($param['path'])?base64_decode($param['path']):null;
		$file 			= isset($param['path'])?base64_decode($param['file']):null;
		$direct_view 	= isset($param['direct_view'])?$param['direct_view']:false;
		$full_file 		= STORAGE_PATH . $path . $file;
		//================== Check File Exist ===============
		if(!file_exists($full_file) || empty($file)){
            // \Response::redirect('system/default/response');
        }
		//================== Init Class Download ===============
        $args = array(
                    'download_path'     =>  STORAGE_PATH . $path,
                    'file'              =>  $file,      
                    'direct_view'       =>  $direct_view,
                    );
        $download = new \Vision_Download($args);
        $download_hook = $download->get_download_hook();
       
            $download->get_download();
        if( $download_hook['download'] == TRUE ) {
        }else{
        	// \Response::redirect('system/default/response');
        }
        return \Response::forge();
    }
	
	
}