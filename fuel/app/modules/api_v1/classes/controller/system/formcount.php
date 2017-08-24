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

class Controller_System_FormCount extends \Controller_API {
    public function before() {
        parent::before();
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get all menu master 0.2 & 0.4
     * Count data based on each menu master
     * Method GET
     *=============================================================*/
    public function get_form_approved(){
        $user_info = \Auth::get();
        $param = \Input::param();
        $data = [];

        //filter authority id, authority code = 02 || 03
        $authorityIds = [2, 3];
        //filter authority id, petition status code = 01
        $petitionStatusIds = [2];

        //Query table count total data
        $queryCountMenu = \DB::select(\DB::expr('COUNT(DISTINCT(SSM.id))'))
                            ->from(['t_proposal', 'SSM'])
                            ->join(['t_approval_status', 'TAS'], 'left')->on('TAS.petition_id', '=', 'SSM.id')->on('TAS.petition_type', '=', \DB::expr('1'))
                            ->where('SSM.item_status', '=', 'active') //get petition active
                            ->and_where('SSM.m_petition_status_id', 'IN', $petitionStatusIds) //m_petition_status_code = 01
                            ->and_where('SSM.m_menu_id', '=', \DB::expr('SM.id'))
                            ->and_where('TAS.item_status', '=', 'active') //check t_approval_status is active
                            ->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', $authorityIds)
                            ->and_where('TAS.m_approval_status_id', '=', 1) //m_approval_status = 0 -> turn to approve form
                            ;


        $queryCountRequestMenu = \DB::select(\DB::expr('COUNT(DISTINCT(SSM.id))'))
                            ->from(['t_request', 'SSM'])
                            ->join(['t_approval_status', 'TAS'], 'left')->on('TAS.petition_id', '=', 'SSM.id')->on('TAS.petition_type', '=', \DB::expr('2'))
                            ->where('SSM.item_status', '=', 'active') //get petition active
                            ->and_where('SSM.m_petition_status_id', 'IN', $petitionStatusIds) //m_petition_status_code = 01
                            ->and_where('SSM.m_request_menu_id', '=', \DB::expr('SM.id'))
                            ->and_where('TAS.item_status', '=', 'active') //check t_approval_status is active
                            ->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', $authorityIds)
                            ->and_where('TAS.m_approval_status_id', '=', 1) //m_approval_status = 0 -> turn to approve form
                            ;


        $select = ['SM.id', 'SM.name', 'SM.order'];

        $select_menu = array_merge($select, [\DB::expr('CONCAT("menu_",id) AS _id'), \DB::expr('(' . $queryCountMenu . ') AS total')]);
        $select_request_menu = array_merge($select, [\DB::expr('CONCAT("payment_",id) AS _id'), \DB::expr('(' . $queryCountRequestMenu . ') AS total')]);

        //Query table m_menu - form 0.2       
        $queryMMenu = \DB::select_array($select_menu)
                                ->from(['m_menu', 'SM'])
                                ->where('SM.item_status', '=', 'active');

        //Query table m_request_menu - form 0.4                              
        $queryMMenuPayment = \DB::select_array($select_request_menu)
                                ->from(['m_request_menu', 'SM'])
                                ->where('SM.item_status', '=', 'active');  

        //Union query table 0.2 & 0.4                     
        $query = \DB::select()
                    ->from(\DB::expr('(('.$queryMMenu.') UNION ('.$queryMMenuPayment.')) UQ'))
                    ->order_by('UQ.order', 'ASC');

        if(isset($param['has_total']) && $param['has_total']){
            $query->where('UQ.total', '>', 0);
        }

        $data = $query->execute()->as_array();        


        /*==================================================
         * Count form was approved by current user
         *==================================================*/
        $queryApproved = \DB::select(\DB::expr('COUNT(TAS.id) AS total'))
                            ->from(['t_approval_status', 'TAS'])
                            ->join(['t_proposal', 'TP'], 'left')->on('TP.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('1'))->on('TP.item_status', '=', \DB::expr('"active"'))
                            ->join(['t_request', 'TR'], 'left')->on('TR.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('2'))->on('TR.item_status', '=', \DB::expr('"active"'))
                            ->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', $authorityIds)
                            ->and_where('TAS.m_approval_status_id', '=', 2) //m_approval_status = 01 -> approved form
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [2, 3]) //m_petition_status_code = 01, 02
                                ->or_where('TR.m_petition_status_id', 'IN', [2, 3, 10, 11]) //m_petition_status_code = 01, 02, 11, 12
                            ->and_where_close()
                            ;
        
        $result = $queryApproved->execute()->current();     
        if($result['total']){
            $query_params = ['m_petition_status_id' => '2,3',
                            'authority_id' => '2,3',
                            'approval_status_id' => '2'
                            ];
            $data[] = ['id' => 'approved', 'name' => '承認済み', 'total' => $result['total'], 'query_params' => $query_params];
        }


        //Generate query params to link page list form
        if(!empty($data)){
            foreach ($data as $key => $value) {
                if($value['id'] == 'approved'){
                    $query_params = ['m_petition_status_id' => '2,3',
                                        'authority_id' => '2,3',
                                        'approval_status_id' => '2'
                                        ];
                }else{
                    $query_params = ['m_menu_id' => $value['_id'],
                                        'm_petition_status_id' => '2',
                                        'authority_id' => '2,3',
                                        'approval_status_id' => '1'
                                        ];
                }
                $data[$key]['query_params'] = $query_params;
            }
        }

        $more_query_params = ['m_petition_status_id' => '2,3',
                                'authority_id' => '2,3',
                                'approval_status_id' => '2'
                                ];
        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => count($data),
                    'more_query_params' => $more_query_params,
                    'data' => $data];
        return $this->response($response);
    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get form based on condition
     *   'label' => '承認予定', //count intendApprove
     *   'label' => '最終承認予定', //count lastApprove
     *   'label' => '同報確認依頼', //count broadcast
     *   'label' => '後閲依頼', //count waiting_reading
     *   'label' => '申請コメントがあります', //count unread comment
     *   'label' => '決裁コメントがあります', //count unread comment staff
     *   'label' => '最終承認通知', //count notify last approved
     *   'label' => '申請者の差戻通知', //count notify return
     *   'label' => '承認者の差戻通知', // notify_return_approved
     *   'label' => '申請者の否認通知', //count notify denial
     *   'label' => '承認者の否認通知', // notify_denial_approved
     *   'label' => '取下通知', //count notify withdrawal
     * Method GET
     *=============================================================*/
    public function get_form_status(){
        $user_info = \Auth::get();
        $param = \Input::param();
        $data = [];

        $basic_query = \DB::select(\DB::expr('COUNT(DISTINCT(TAS.id)) AS total'))
                            ->from(['t_approval_status', 'TAS'])
                            ->join(['t_proposal', 'TP'], 'left')->on('TP.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('1'))->on('TP.item_status', '=', \DB::expr('"active"'))
                            ->join(['t_request', 'TR'], 'left')->on('TR.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('2'))->on('TR.item_status', '=', \DB::expr('"active"'))
                            ->where('TAS.item_status', '=', 'active')
                            ;
        /*=============================================
         * Case Intend Approve - m_approval_status_id IS null
         * Label: 承認予定
         *=============================================*/
        $intend_approve_query = clone $basic_query;
        $intend_approve_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 2) //authority code = 02
                            ->and_where_open()
                                ->and_where('TAS.m_approval_status_id', '=', '')
                                ->or_where('TAS.m_approval_status_id', 'IS', \DB::expr('NULL'))
                            ->and_where_close()
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [2]) //petition status code = 01 | 審議中
                                ->or_where('TR.m_petition_status_id', 'IN', [2]) //petition status code = 01 | 審議中
                            ->and_where_close();
        $result = $intend_approve_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '承認予定',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '2', 'authority_id' => '2', 'approval_status_id' => 'intend']
                        ];
        }

        /*=============================================
         * Case Last Approve - m_approval_status_id IS null
         * Label: 最終承認予定
         *=============================================*/
        $last_approve_query = clone $basic_query;
        $last_approve_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 3) //authority code = 03
                            ->and_where_open()
                                ->and_where('TAS.m_approval_status_id', '=', '')
                                ->or_where('TAS.m_approval_status_id', 'IS', \DB::expr('NULL'))
                            ->and_where_close()
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [2]) //petition status code = 01 | 審議中
                                ->or_where('TR.m_petition_status_id', 'IN', [2, 8, 9]) //petition status code = 01|06|07
                            ->and_where_close();
        $result = $last_approve_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '最終承認予定',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '2', 'authority_id' => '3', 'approval_status_id' => 'intend']
                        ];
        }

        /*=============================================
         * Case Broadcast - m_approval_status_id 1 | approval status code 00
         * Label: 同報確認依頼
         *=============================================*/
        $last_approve_query = clone $basic_query;
        $last_approve_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 4) //authority code = 04
                            ->and_where('TAS.m_approval_status_id', '=', 1) //approval status code = 00
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [3]) //petition status code = 02 | 最終承認
                                ->or_where('TR.m_petition_status_id', 'IN', [3, 10, 11]) //petition status code = 02|11|12
                            ->and_where_close();
        $result = $last_approve_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '同報確認依頼',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '3', 'authority_id' => '4', 'approval_status_id' => '1']
                        ];
        }

        /*=============================================
         * Case Waiting Read - m_approval_status_id = 7 | approval status code 30
         * Label: 後閲依頼
         *=============================================*/
        $waiting_reading_query = clone $basic_query;
        $waiting_reading_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 2) //authority code = 02
                            ->and_where('TAS.m_approval_status_id', '=', 7) //approval status code = 30
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [2, 3]) //petition status code = 01|02
                                ->or_where('TR.m_petition_status_id', 'IN', [2, 3]) //petition status code = 01|02
                            ->and_where_close();
        $result = $waiting_reading_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '後閲依頼',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '2,3', 'authority_id' => '2', 'approval_status_id' => '7']
                        ];
        }

        /*=============================================
         * Case Unread Comment
         * Label: 申請コメントがあります
         *=============================================*/
        $unread_comment_query = clone $basic_query;
        $unread_comment_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'NOT IN', [1, 6]) //authority code = 01|06
                            ->and_where('TAS.is_read_comment', '=', 0) //unread comment
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'NOT IN', [1, 4]) //petition status code = 00
                                ->or_where('TR.m_petition_status_id', 'NOT IN', [1, 4]) //petition status code = 00
                            ->and_where_close();
        $result = $unread_comment_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '申請コメントがあります',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['comment' => 'unread']
                        ];
        }

        /*=============================================
         * Case Unread Comment Staff Who Create Form
         * Label: 決裁コメントがあります
         *=============================================*/
        $staff_unread_comment_query = clone $basic_query;
        $staff_unread_comment_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', [1]) //authority code = 01|06
                            ->and_where('TAS.is_read_comment', '=', 0) //unread comment
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'NOT IN', [1]) //petition status code = 00
                                ->or_where('TR.m_petition_status_id', 'NOT IN', [1]) //petition status code = 00
                            ->and_where_close();
        $result = $staff_unread_comment_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '決裁コメントがあります',
                        'total' => $result['total'],
                        'route' => '/list-form',
                        'query_params' => ['comment' => 'unread']
                        ];
        }

        /*=============================================
         * Case Notifity Last Aprove To Creator
         * Label: 最終承認通知
         *=============================================*/
        $staff_notify_last_approve_query = clone $basic_query;
        $staff_notify_last_approve_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 1) //authority code = 01
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notify
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [3]) //petition status code = 02
                                ->or_where('TR.m_petition_status_id', 'IN', [3, 10, 11]) //petition status code = 02|10|11
                            ->and_where_close();
        $result = $staff_notify_last_approve_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '最終承認通知',
                        'total' => $result['total'],
                        'route' => '/list-form',
                        'query_params' => ['m_petition_status_id' => '3', 'notice_confirm_code' => 'no']
                        ];
        }

        /*=============================================
         * Case Notifity Return To Creator
         * Label: 申請者の差戻通知
         *=============================================*/
        $staff_notify_return_query = clone $basic_query;
        $staff_notify_return_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 1) //authority code = 01
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notify
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [4]) //petition status code = 03
                                ->or_where('TR.m_petition_status_id', 'IN', [4]) //petition status code = 03
                            ->and_where_close();
        $result = $staff_notify_return_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '申請者の差戻通知',
                        'total' => $result['total'],
                        'route' => '/list-form',
                        'query_params' => ['m_petition_status_id' => '4', 'notice_confirm_code' => 'no']
                        ];
        }

        /*=============================================
         * Case Notifity Return To List Approve User
         * Label: 承認者の差戻通知
         *=============================================*/
        $notify_return_query = clone $basic_query;
        $notify_return_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', [2, 3]) //authority code = 02|03
                            ->and_where('TAS.m_approval_status_id', 'IN', [2, 7, 8]) //approval status code = 01|30|31
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notify
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [4]) //petition status code = 03
                                ->or_where('TR.m_petition_status_id', 'IN', [4]) //petition status code = 03
                            ->and_where_close();
        $result = $notify_return_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '承認者の差戻通知',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '4', 'authority_id' => '2,3', 'approval_status_id' => '2,7,8', 'notice_confirm_code' => 'no']
                        ];
        }

        /*=============================================
         * Case Notifity Deny To Creator
         * Label: 申請者の否認通知
         *=============================================*/
        $staff_notify_deny_query = clone $basic_query;
        $staff_notify_deny_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', '=', 1) //authority code = 01
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notify
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [5]) //petition status code = 04
                                ->or_where('TR.m_petition_status_id', 'IN', [5]) //petition status code = 04
                            ->and_where_close();
        $result = $staff_notify_deny_query->execute()->current();
        
        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '申請者の否認通知',
                        'total' => $result['total'],
                        'route' => '/list-form',
                        'query_params' => ['m_petition_status_id' => '5', 'notice_confirm_code' => 'no']
                        ];
        }

        /*=============================================
         * Case Notifity Deny To List Approve User
         * Label: 承認者の否認通知
         *=============================================*/
        $notify_deny_query = clone $basic_query;
        $notify_deny_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', [2, 3]) //authority code = 02|03
                            ->and_where('TAS.m_approval_status_id', 'IN', [2, 7, 8]) //approval status code = 01|30|31
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notify
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [5]) //petition status code = 04
                                ->or_where('TR.m_petition_status_id', 'IN', [5]) //petition status code = 04
                            ->and_where_close();
        $result = $notify_deny_query->execute()->current();                    

        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '承認者の否認通知',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '5', 'authority_id' => '2,3', 'approval_status_id' => '2', 'notice_confirm_code' => 'no']
                        ];
        }

        /*=============================================
         * Case Notifity Deny To List Approve User
         * Label: 取下通知
         *=============================================*/
        $notify_withdraw_query = clone $basic_query;
        $notify_withdraw_query->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->and_where('TAS.m_authority_id', 'IN', [2, 3]) //authority code = 02|03
                            ->and_where('TAS.m_approval_status_id', 'IN', [2]) //approval status code = 01|30|31
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notify
                            ->and_where_open()
                                ->and_where('TP.m_petition_status_id', 'IN', [6]) //petition status code = 05
                                ->or_where('TR.m_petition_status_id', 'IN', [6]) //petition status code = 05
                            ->and_where_close();
        $result = $notify_withdraw_query->execute()->current();                    

        if((isset($param['has_total']) && $param['has_total'] && $result['total'] > 0) || !isset($param['has_total']) || !$param['has_total']){
            $data[] = ['name' => '取下通知',
                        'total' => $result['total'],
                        'route' => '/management/list-form',
                        'query_params' => ['m_petition_status_id' => '6', 'authority_id' => '2,3', 'approval_status_id' => '2', 'notice_confirm_code' => 'no']
                        ];
        }
  


        $more_query_params = ['m_petition_status_id' => '2,3,4,5,6,7',
                                'authority_id' => '2,3,4',
                                'approval_status_id' => '1,7'
                                ];
        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => count($data),
                    'more_query_params' => $more_query_params,
                    'data' => $data];
        return $this->response($response);
    }
}