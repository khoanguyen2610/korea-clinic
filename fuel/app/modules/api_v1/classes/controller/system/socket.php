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
    public function get_send_mail_active_password(){
        $param = \Input::param();
        if(!empty($param['m_user_id'])){
            $m_user_id = $param['m_user_id'];
            $confirm_code = $param['confirm_code'];
            $user = \Model_MUser::find('first', ['where' => ['id' => $m_user_id]]);

            if(!empty($user)){
                $linkActive = \Uri::create('client/general/active?type=forgot&u=' . $user->id . '&code=' . md5($user->id) . '&k=' . $user->confirm_code);

                $arrMails = ['request_user_id' => $m_user_id,
                            'user_id' => $user->user_id,
                            'fullname' => $user->fullname,
                            'email' => $user->email,
                            'confirm_code' => $confirm_code,
                            'link_active' => $linkActive
                            ];

                //=============== Send email activate to user ====================
                $result = \Vision_Mail::mailForgotPass($arrMails);
                if($result){
                    //=============== Send email notify to system ====================
                    $arrMails = ['request_user_id' => $m_user_id,
                                    'user_id' => $user->user_id];
                    \Vision_Mail::mailForgotPassToSystem($arrMails);
                }
            }
        }
        exit;
    }

    public function get_test_talknote(){
        die('function closed');
        //send mail to talknote
        //  7095 7509 7535 7521 7619 7580 |||| 7578 7540 7530 7616 7585
        //7562 user-id = 2 | //中本　新一
        $arrIds = [7095, 7509, 7535, 7521, 7619, 7580];
        $arrIdsSecond = [7578, 7540, 7530, 7616, 7585];
        $arrIdsNakamoto = [7562];
        foreach ($arrIdsSecond as $value) {
            echo '<br>' . $petition_id =  $value;
            $item = \Model_TProposal::get_detail(['id' => $petition_id]);
            $query = \DB::select('SM.id', 'SM.m_input_id', 'SM.value', \DB::expr('MI.name AS m_input_name'), 'MI.m_input_type_id', \DB::expr('MIT.name_e AS input_type_name_e'))
                         ->from(['t_proposal_input', 'SM'])
                         ->join(['m_input', 'MI'], 'left')->on('MI.id', '=', 'SM.m_input_id')
                         ->join(['m_input_type', 'MIT'], 'left')->on('MIT.id', '=', 'MI.m_input_type_id')
                         ->where('SM.t_proposal_id', '=', $petition_id)
                         ->and_where('SM.item_status', '=', 'active');
            $result = $query->execute()->as_array('m_input_id');
            $item['inputs'] = $result;

            //Get file attachment
            $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath')
                         ->from(['t_form_attachment', 'SM'])
                         ->where('SM.petition_id', '=', $petition_id)
                         ->and_where('SM.petition_type', '=', 1)
                         ->and_where('SM.item_status', '=', 'active');
            $result = $query->execute()->as_array('id');
            $item['files_attach'] = $result;

            // $m_user_id = 2; //中本　新一
            $m_user_id = 4; //大田　健司
            $list_mail = [ 'fullname' => '大田　健司',
                            'to_email' => 'g-9734-68033@mail.talknote.com', //g-9734-112501@mail.talknote.com (test) | g-9734-68033@mail.talknote.com(real)
                            'm_approval_status_name' => '承認'
                            ];
            $mail_talknote_content = \View::forge('mail_template/talk_note', ['item' => $item, 'mail_info' => $list_mail])->render();

            $mailParam = ['request_user_id' => $m_user_id,
                        'fullname' => $list_mail['fullname'],
                        'receiver_email' => $list_mail['to_email'],
                        'menu_name' => $item['menu_name'],
                        'approval_status_name' => $list_mail['m_approval_status_name'],
                        'code' => $item['code'],
                        'content' => $mail_talknote_content];
            // \Vision_Mail::mail_to_talknote($mailParam);
            sleep(30);
        }
        die('test');
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function send out email when user process form
     * approval - deni - last_approve etc.
     *=============================================================*/
    public function get_send_mail_process_form(){
        $param = \Input::param();
        if(!empty($param['m_user_id']) && !empty($param['petition_id'])){
            $petition_id = $param['petition_id'];
            $petition_type = $param['petition_type'];
            $m_user_id = $param['m_user_id'];
            $request_m_user_id = isset($param['request_m_user_id'])?$param['request_m_user_id']:null;
            $process_type = $param['process_type'];
            $current_approval_status_id = isset($param['current_approval_status_id'])?$param['current_approval_status_id']:null;

            //Get form detail
            if($petition_type == 1){
                $item = \Model_TProposal::get_detail(['id' => $petition_id]);
                if(!empty($item)){
                    //Get form inputs
                    $query = \DB::select('SM.id', 'SM.m_input_id', 'SM.value', \DB::expr('MI.name AS m_input_name'), 'MI.m_input_type_id', \DB::expr('MIT.name_e AS input_type_name_e'))
                                 ->from(['t_proposal_input', 'SM'])
                                 ->join(['m_input', 'MI'], 'left')->on('MI.id', '=', 'SM.m_input_id')
                                 ->join(['m_input_type', 'MIT'], 'left')->on('MIT.id', '=', 'MI.m_input_type_id')
                                 ->where('SM.t_proposal_id', '=', $petition_id)
                                 ->and_where('SM.item_status', '=', 'active');
                    $result = $query->execute()->as_array('m_input_id');
                    $item['inputs'] = $result;

                    //Get file attachment
                    $query = \DB::select('SM.id', 'SM.filename', 'SM.filepath')
                                 ->from(['t_form_attachment', 'SM'])
                                 ->where('SM.petition_id', '=', $petition_id)
                                 ->and_where('SM.petition_type', '=', 1)
                                 ->and_where('SM.item_status', '=', 'active');
                    $result = $query->execute()->as_array('id');
                    $item['files_attach'] = $result;
                }
                $petition_url = CLIENT_URL . "/proposal/detail/$petition_id";
            }else{
                $item = \Model_TRequest::get_detail(['id' => $petition_id]);
                $item['menu_name'] = $item['request_menu_name'];
                $item['m_menu_id'] = $item['m_request_menu_id'];
                $petition_url = CLIENT_URL . "/payment/detail/$petition_id";
            }

            //Get next approval user
            if(!empty($current_approval_status_id)){
                $query = \DB::select('SM.*', 'MU.fullname', 'MU.email')
                             ->from(['t_approval_status', 'SM'])
                             ->join(['m_user', 'MU'], 'left')->on('SM.m_user_id', '=', 'MU.id')

                             ->where('SM.petition_id', '=', $petition_id)
                             ->and_where('SM.petition_type', '=', $petition_type)
                             ->and_where('SM.m_authority_id', 'IN', [2, 3]) //get user has authority code = 02, 03
                             ->and_where('SM.order', '>', \DB::expr("(SELECT `order` FROM t_approval_status WHERE id = {$current_approval_status_id})")) //get user has authority code = 02, 03
                             ->and_where('SM.item_status', '=', 'active')
                             ->order_by('SM.order', 'ASC');
                $next_approval = $query->execute()->current();
            }
            $param_back_management_list = ['previous_page' => '/management/list-form'];
            switch ($process_type) {
                case 'apply':
                    /*=============================================
                     * Case Form Is Approve.
                     * Send Email To Next User Has Aprroval Permission
                     * Approval Code = 02 | 03
                     *=============================================*/
                    $mailParam = ['request_user_id' => $m_user_id,
                                    'code' => $item['code'],
                                    'receiver_name' => $next_approval['fullname'],
                                    'receiver_email' => $next_approval['email'],
                                    'applicant_name' => $item['fullname'],
                                    'menu_name' => $item['menu_name'],
                                    'petition_url' => $petition_url . '?' . http_build_query($param_back_management_list)];
                    /*=============================================
                     * Send Email To First Aprroval - 最終審議
                     *=============================================*/
                    \Vision_Mail::apply_form_approval($mailParam);

                    break;
                case 'approve':
                    /*=============================================
                     * Case Form Is Approve.
                     * Send Email To Next User Has Aprroval Permission
                     * Approval Code = 02 | 03
                     *=============================================*/
                    if(!empty($next_approval)){
                        $mailParam = ['request_user_id' => $m_user_id,
                                        'code' => $item['code'],
                                        'receiver_name' => $next_approval['fullname'],
                                        'receiver_email' => $next_approval['email'],
                                        'applicant_name' => $item['fullname'],
                                        'menu_name' => $item['menu_name'],
                                        'petition_url' => $petition_url . '?' . http_build_query($param_back_management_list)];

                        \Vision_Mail::approve_form_to_next_approval($mailParam);
                    }


                    /*=============================================
                     * Send Email to talknote
                     * Check data from table t_mail_cooperation
                     * Condition: m_user_id, m_menu_id, petition_type, m_approval_status_id = 2
                     *=============================================*/

                    if(!empty($m_user_id)){
                        $query = \DB::select('SM.*', 'MU.fullname', 'MU.email', \DB::expr('name AS m_approval_status_name'))
                                     ->from(['t_mail_cooperation', 'SM'])
                                     ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                                     ->join(['m_approval_status', 'MAS'], 'left')->on('MAS.id', '=', 'SM.m_approval_status_id')
                                     ->where('SM.m_user_id', '=', $m_user_id)
                                     ->and_where('SM.m_menu_id', '=', $item['m_menu_id'])
                                     ->and_where('SM.petition_type', '=', $petition_type)
                                     ->and_where('SM.m_approval_status_id', '=', 2) //approval status code = 02 |approve
                                     ->and_where('SM.item_status', '=', 'active');
                        $arr_list_mail = $query->execute()->as_array();


                        if(!empty($arr_list_mail)){
                            foreach ($arr_list_mail as $list_mail) {
                                $mail_talknote_content = \View::forge('mail_template/talk_note', ['item' => $item, 'mail_info' => $list_mail])->render();

                                $mailParam = ['request_user_id' => $m_user_id,
                                            'fullname' => $list_mail['fullname'],
                                            'receiver_email' => $list_mail['to_email'],
                                            'menu_name' => $item['menu_name'],
                                            'approval_status_name' => $list_mail['m_approval_status_name'],
                                            'code' => $item['code'],
                                            'content' => $mail_talknote_content];
                                \Vision_Mail::mail_to_talknote($mailParam);
                            }
                        }
                    }
                    break;
                case 'last_approve':
                    /*=============================================
                     * Case Form Is Returned | Denied.
                     * Send Email To User Create Form
                     *=============================================*/
                    $mailParam = ['request_user_id' => $m_user_id,
                                    'code' => $item['code'],
                                    'receiver_name' => $item['fullname'],
                                    'receiver_email' => $item['email'],
                                    'menu_name' => $item['menu_name'],
                                    'petition_url' => $petition_url];
                    \Vision_Mail::last_approve_form_to_creator($mailParam);
                    break;
                case 'deny':
                case 'return':
                    /*=============================================
                     * Case Form Is Returned | Denied.
                     * Send Email To User Create Form
                     *=============================================*/
                    $mailParam = ['request_user_id' => $m_user_id,
                                    'code' => $item['code'],
                                    'receiver_name' => $item['fullname'],
                                    'receiver_email' => $item['email'],
                                    'menu_name' => $item['menu_name']];

                    \Vision_Mail::return_deny_form_to_creator($mailParam);

                    /*=============================================
                     * Case Form Is Returned | Denied.
                     * Send Email To Next User Has Aprroval Permission
                     * Approval Code = 02 | 03
                     *=============================================*/
                    if(!empty($next_approval)){
                        $mailParam = ['request_user_id' => $m_user_id,
                                        'code' => $item['code'],
                                        'receiver_name' => $next_approval['fullname'],
                                        'receiver_email' => $next_approval['email'],
                                        'menu_name' => $item['menu_name'],
                                        'petition_url' => $petition_url . '?' . http_build_query($param_back_management_list)];

                        \Vision_Mail::return_deny_form_to_next_approval($mailParam);
                    }

                    break;
                case 'waiting_confirm':
                    /*=============================================
                     * Case Form Is waiting confirm.
                     * Send Email To Next User Has Aprroval Permission
                     * Approval Code = 02
                     *=============================================*/
                    if(!empty($next_approval)){
                        $mailParam = ['request_user_id' => $request_m_user_id,
                                        'code' => $item['code'],
                                        'receiver_name' => $next_approval['fullname'],
                                        'receiver_email' => $next_approval['email'],
                                        'applicant_name' => $item['fullname'],
                                        'menu_name' => $item['menu_name'],
                                        'petition_url' => $petition_url];
                        \Vision_Mail::waiting_confirm_form_to_next_approval($mailParam);
                    }
                    break;
                case 'waiting_confirm_skipped':
                    $skipped_user_info = \Model_MUser::getDetailUserInfo(['m_user_id' => $m_user_id]);
                    $request_user_info = \Model_MUser::getDetailUserInfo(['m_user_id' => $request_m_user_id]);
                    /*=============================================
                     * Case Form Is Approve With Overpermission.
                     * Send email to user is skipped
                     *=============================================*/
                    $mailParam = ['request_user_id' => $request_m_user_id,
                                    'code' => $item['code'],
                                    'receiver_name' => $skipped_user_info['fullname'],
                                    'receiver_email' => $skipped_user_info['email'],
                                    'sender_name' => $request_user_info['fullname'],
                                    'menu_name' => $item['menu_name'],
                                    'petition_url' => $petition_url];
                    \Vision_Mail::waiting_confirm_form_to_approval($mailParam);
                    break;
                default:
                    # code...
                    break;
            }
        }
        exit;
    }



    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function send out email when user comment
     *=============================================================*/
    public function get_send_mail_when_user_comment(){
        $param = \Input::param();
        if(!empty($param['comment_id']) && !empty($param['petition_type']) && !empty($param['m_user_id']) ){
			$query = \DB::select('SM.*', 'MU.fullname')
                         ->from(['t_comment', 'SM'])
                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                         ->where('SM.id', '=', $param['comment_id']);
            $commentDetail = $query->execute()->current();

			if(!empty($commentDetail)){
	            switch ($param['petition_type']) {
	            	case '1':
						$item = \Model_TProposal::get_detail(['id' => $commentDetail['petition_id']]);
						$petition_url = CLIENT_URL . "/proposal/detail/{$commentDetail['petition_id']}";
	            		break;
	            	// case '2':
					// 	$item = \Model_TRequest::get_detail(['id' => $commentDetail['petition_id']]);
					// 	$petition_url = CLIENT_URL . "/payment/detail/$commentDetail['petition_id']";
	            	// 	break;
	            }
			}
			/* 57 | 購入稟議書（基本契約なし）
			 * 44 | 代理店契約締結稟議
			 * 52 | 汎用（その他）稟議
			 */
			$allowSendMailInMenuIDS = [44, 52, 57];

            if(!empty($commentDetail) && !empty($item) && in_array($item['m_menu_id'], $allowSendMailInMenuIDS)){
				$userReceive = [];
				if($commentDetail['m_user_id'] == $item['m_user_id']){
					//send only to user [sano]
				}else{
					//send to user [sano] & user create_form
					$userReceive = [$item['m_user_id']];
				}

				//Check user [sano] exist in routes
				$query = \DB::select('MU.staff_no', 'MU.fullname', 'MU.email')
	                         ->from(['t_approval_status', 'SM'])
	                         ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
	                         ->where('SM.petition_id', '=', $item['id'])
	                         ->and_where('SM.petition_type', '=', $param['petition_type'])
	                         ->and_where('SM.item_status', '=', 'active')
	                         ->and_where('SM.m_user_id', '=', 1)
	                         ->order_by('SM.order', 'ASC');
	            $resultCheck = $query->execute()->current();

				if(!empty($resultCheck) && $commentDetail['m_user_id'] != 1){
					$userReceive[] = 1;
				}

				if(!empty($userReceive)){
					foreach ($userReceive as $val) {
						$objUser = \Model_MUser::find($val);
						$mailParam = ['request_user_id' => $param['m_user_id'],
									   'code' => $item['code'],
									   'receiver_name' => $objUser->fullname,
									   'receiver_email' => $objUser->email,
									   'applicant_name' => $item['fullname'],
									   'user_comment_name' => $commentDetail['fullname'],
									   'menu_name' => $item['menu_name'],
									   'comment_content' => $commentDetail['content'],
									   'petition_url' => $petition_url . '??access_area=user-list-form&previous_page=%2Flist-form%3Fcomment%3Dunread'];
					   \Vision_Mail::mailWhenUserComment($mailParam);
					}
			   }
            }
        }
        exit;
    }
}
