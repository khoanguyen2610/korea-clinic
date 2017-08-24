<?php

/**
 * PHP Class
 *
 * LICENSE
 *
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Mar 21, 2016 04:41:31 PM
 */

class Vision_Rest {
	protected $_url_user = 'koreaclinic';
	protected $_url_pass = 'system_korea_clinic_svn';
	protected $_X_Vision_Username   = 'visionvn';
    protected $_X_Vision_API_Token  = 'system_vsvn';
    protected $_api_url;

    public function __construct(){
    	$this->_api_url = API_URL . 'v1/';
    }
    /*===================================================
	 * Send Request To API
	 *===================================================*/
	public function request($url, $method, $arrParam = null, $options = null){
		$url = $this->_api_url . $url;
		$method = strtoupper($method);
		$response = $this->curl($url, $method, $arrParam);
		return $response['content'];
	}

	/*===================================================
	 * Using Curl To Send Request
	 *===================================================*/
	protected function curl($url, $method, $arrParam = null, $options = null) {
		// echo $url;
		$field_string = !empty($arrParam)?http_build_query($arrParam):null;
		$user_agent='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
		$options = array(
				CURLOPT_CUSTOMREQUEST  	=> $method,        //set request type post or get
				CURLOPT_USERAGENT      	=> $user_agent, //set user agent
				CURLOPT_RETURNTRANSFER 	=> true,     // return web page
				CURLOPT_HEADER         	=> false,    // don't return headers
				CURLOPT_FOLLOWLOCATION 	=> true,     // follow redirects
				CURLOPT_ENCODING       	=> "",       // handle all encodings
				CURLOPT_AUTOREFERER    	=> true,     // set referer on redirect
				CURLOPT_CONNECTTIMEOUT 	=> 300,      // timeout on connect
				CURLOPT_TIMEOUT        	=> 300,      // timeout on response
				CURLOPT_MAXREDIRS      	=> 10,       // stop after 10 redirects
				CURLOPT_SSL_VERIFYPEER 	=> false,
				CURLOPT_SSL_VERIFYHOST 	=> false,
				CURLOPT_USERPWD 		=> "$this->_url_user:$this->_url_pass",
				CURLOPT_HTTPAUTH 		=> CURLAUTH_ANY,
				CURLOPT_POSTFIELDS 		=> $field_string,
				CURLOPT_HTTPHEADER		=> array('X-Vision-Username: ' . $this->_X_Vision_Username,
													'X-Vision-API-Token: ' . $this->_X_Vision_API_Token)
		);
		$ch      = curl_init($url);

		curl_setopt_array( $ch, $options );
		$content = curl_exec($ch);

		$err     = curl_errno($ch);
		$errmsg  = curl_error($ch);
		$header  = curl_getinfo($ch);
		curl_close( $ch );
		$header['errno']   = $err;
		$header['errmsg']  = $errmsg;
		$header['content'] = $content;
		return $header;
	}
}
