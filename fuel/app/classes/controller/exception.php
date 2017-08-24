<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */

namespace Controller;
class Exception{
	/*==========================================================
	 * Response Exception Code
	 *==========================================================*/

    //================== Query Database 1xxx | System ==================
    const E_LOGIN_OK        = 1000;
    const E_LOGIN_EXIST     = 1001;
    const E_LOGOUT          = 1002;

	//================== Query Database 22xx | Success ==================
    const E_ACCEPTED 		= 2200;
    const E_CREATE_SUCCESS 	= 2201;
    const E_UPDATE_SUCCESS 	= 2202;
    const E_DELETE_SUCCESS 	= 2203;

    //================== Query Database 24xx | False ==================
    const E_PK_MISS 		= 2401;
    const E_NO_RECORD 		= 2402;

    //================== Query Database 3xxx | Validate Err ==================
    const E_VALIDATE_ERR    = 3000;
    const E_EXISTED_ERR     = 3001;
    const E_INVALID_PARAM	= 3002;

    //================== Query Database 4xxx | Authoriy ==================
    const E_INVALID_TOKEN   = 4000;


    //================== Query Database 10xxx | Unexpected ==================
    const E_UNEXPECTED_ERR 	= 10000;



    /*==========================================================
	 * Response Exception Text
	 *==========================================================*/
    public static function getMessage($code){
    	//================ Define Array Code & Message ================
    	$code_message = ['1000' => __('Login success!', [], 'Login success!'),
                        '1001' => __('Exist other session! Please logout before login other account!', [], 'Exist other session! Please logout before login other account!'),
                        '1002' => __('Logout success!', [], 'Logout success!'),
                        '2200' => __('Accepted', [], 'Accepted'),
						'2201' => __('Record Created Successfully', [], 'Record Created Successfully'),
						'2202' => __('Record Updated Successfully', [], 'Record Updated Successfully'),
						'2203' => __('Record Deleted Successfully', [], 'Record Deleted Successfully'),
						'2401' => __('Missing Primary Key', [], 'Missing Primary Key'),
						'2402' => __('Can Not Find This Record', [], 'Can Not Find This Record'),
                        '3000' => __('Validation Errors', [], 'Validation Errors'),
                        '3001' => __('This key has been existed in database.', [], 'This key has been existed in database.'),
						'3002' => __('Invalid request parameters.', [], 'Invalid request parameters.'),
						'4000' => __('Invalid or expired token', [], 'Invalid or expired token')];
    	$message = __('An unexpected error occurred', [], 'An unexpected error occurred');
    	if(array_key_exists($code, $code_message)){
    		$message = $code_message[$code];
    	}
    	return $message;
    }
}
