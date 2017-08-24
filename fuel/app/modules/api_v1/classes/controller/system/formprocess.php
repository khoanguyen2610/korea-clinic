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

class Controller_System_FormProcess extends \Controller_API {
	public function before() {
        parent::before();
    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get all form 0.2 & 0.4
     * Get form based on user login who was created form
     * LIMIT 20
     * Method GET
     *=============================================================*/
    public function get_list_form_based_user(){
        $user_info = \Auth::get();
        $param = \Input::param();
        $data = [];

        //Generate petition status id
        $arrIds = ['1', '2', '3', '5', '6', '7', '4_check', '4_uncheck'];
        if(in_array('2', $arrIds)){
            $arrIds = array_merge($arrIds, ['9', '8']);
        }
        //Has status 02 add more status 10, 11, 12
        if(in_array('3', $arrIds)){
            $arrIds = array_merge($arrIds, ['10', '11']);
        }

        $select = ['SM.id', 'SM.m_user_id', 'SM.m_petition_status_id', 'SM.code', 'SM.name', 'SM.date', 'SM.priority_flg', 'SM.change_route', 'SM.item_status',
                'SM.last_approve_user_id', 'SM.last_approve_date', 'SM.created_date',
                \DB::expr('MPS.name AS petition_status_name'), \DB::expr('MPS.name AS petition_status_name'), \DB::expr('MU.fullname AS fullname')];

        $select_proposal = array_merge($select, [\DB::expr('"1" AS petition_type'), \DB::expr('MM.name AS menu_name')]);
        $select_request = array_merge($select, [\DB::expr('"2" AS petition_type'), \DB::expr('MRM.name AS menu_name')]);



        //Query table t_proposal - form 0.2
        $queryProposal = \DB::select_array($select_proposal)
                            ->from(['t_proposal', 'SM'])
                            ->join(['m_menu', 'MM'], 'left')->on('MM.id', '=', 'SM.m_menu_id')
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                            ->join(['m_petition_status', 'MPS'], 'left')->on('MPS.id', '=', 'SM.m_petition_status_id')
                            ->join(['t_approval_status', 'TAS'], 'left')->on('TAS.petition_id', '=', 'SM.id')->on('TAS.petition_type', '=', \DB::expr('1'))
                            ->where('SM.item_status', '=', 'active') //get petition active
                            ->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->group_by('SM.id')
                            ;

        //Query table t_request - form 0.4
        $queryPayment = \DB::select_array($select_request)
                            ->from(['t_request', 'SM'])
                            ->join(['m_request_menu', 'MRM'], 'left')->on('MRM.id', '=', 'SM.m_request_menu_id')
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                            ->join(['m_petition_status', 'MPS'], 'left')->on('MPS.id', '=', 'SM.m_petition_status_id')
                            ->join(['t_approval_status', 'TAS'], 'left')->on('TAS.petition_id', '=', 'SM.id')->on('TAS.petition_type', '=', \DB::expr('2'))
                            ->where('SM.item_status', '=', 'active') //get petition active
                            ->and_where('TAS.m_user_id', '=', $user_info['id'])
                            ->group_by('SM.id')
                            ;

        $queryProposal->and_where('SM.m_user_id', '=', $user_info['id']);
        $queryPayment->and_where('SM.m_user_id', '=', $user_info['id']);

        if(!empty($arrIds)){
            $queryProposal->and_where_open();
            $queryPayment->and_where_open();

            if(in_array('4_check', $arrIds)){
                $queryProposal->or_where_open()
                            ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                            ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                            ->and_where('TAS.notice_confirm_code', '=', 1) //uncheck notice confirm
                            ->or_where_close();

                $queryPayment->or_where_open()
                            ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                            ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                            ->and_where('TAS.notice_confirm_code', '=', 1) //uncheck notice confirm
                            ->or_where_close();
            }

            //Has status 4_uncheck
            if(in_array('4_uncheck', $arrIds)){
                $queryProposal->or_where_open()
                            ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                            ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notice confirm
                            ->or_where_close();

                $queryPayment->or_where_open()
                            ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                            ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                            ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notice confirm
                            ->or_where_close();
            }
            unset($arrIds[array_search('4_check', $arrIds)]);
            unset($arrIds[array_search('4_uncheck', $arrIds)]);


            //Has status 01 add more status 06, 07
            if(in_array('2', $arrIds)){
                $arrIds = array_merge($arrIds, ['9', '8']);
            }
            //Has status 02 add more status 10, 11, 12
            if(in_array('3', $arrIds)){
                $arrIds = array_merge($arrIds, ['10', '11']);
            }

            !empty($arrIds) && $queryProposal->or_where('SM.m_petition_status_id', 'IN', $arrIds);
            !empty($arrIds) && $queryPayment->or_where('SM.m_petition_status_id', 'IN', $arrIds);

            $queryProposal->and_where_close();
            $queryPayment->and_where_close();
        }



        $query = \DB::select(\DB::expr('SQL_CALC_FOUND_ROWS `UQ`.`id`'), 'UQ.*')
                    ->from(\DB::expr('(('.$queryProposal.') UNION ('.$queryPayment.')) UQ'))
                    ->order_by('UQ.date', 'DESC')
                    ->order_by('UQ.created_date', 'DESC')
                    ->order_by('UQ.id', 'DESC')
                    ->limit(20);


        $data = $query->execute()->as_array();
        $total = \DB::query("SELECT FOUND_ROWS()")->execute()->current();
        $total = $total['FOUND_ROWS()'];
        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'total' => $total,
                    'data' => $data];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get all form 0.2 & 0.4
     * Filter data from client request
     * Method GET
     *=============================================================*/
    public function get_list_form(){
        $user_info = \Auth::get();
        $param = \Input::param();
        $data = [];

        if(empty($user_info) && (isset($param['has_export']) && !empty($param['m_user_id']))){
            $user_info = \Model_MUser::getDetailUserInfo($param);
        }

        $select = [\DB::expr('TC.id AS comment_id'), 'SM.id', 'SM.m_user_id', 'SM.m_petition_status_id', 'SM.code', 'SM.name', 'SM.date', 'SM.priority_flg', 'SM.change_route', 'SM.item_status',
                'SM.last_approve_user_id', 'SM.last_approve_date', \DB::expr('MULA.fullname AS last_approve_user_fullname'), \DB::expr('MPS.name AS petition_status_name'),
                \DB::expr('MPS.name AS petition_status_name'), \DB::expr('MU.fullname AS fullname'), \DB::expr('TC.id AS comment_id'),
                \DB::expr('TAS.m_approval_status_id'), \DB::expr('TAS.id AS approval_status_id'), \DB::expr('IF(LENGTH(MAS.name) > 0, MAS.name, "承認予定")  AS approval_status_name'), \DB::expr('TAS.m_user_id AS approval_status_m_user_id'),
                \DB::expr('MA.id AS authority_id'), \DB::expr('MA.name AS authority_name')];



        // Select id only petition_id
        if(isset($param['select_id_only']) && !empty($param['select_id_only'])) {
            $select = ['SM.id', 'SM.priority_flg', 'SM.date', 'SM.m_petition_status_id'];
        }


        $select_proposal = array_merge($select, [\DB::expr('"1" AS petition_type'), \DB::expr('MM.name AS menu_name')]);
        $select_request = array_merge($select, [\DB::expr('"2" AS petition_type'), \DB::expr('MRM.name AS menu_name')]);
        //Query table t_proposal - form 0.2
        $queryProposal = \DB::select_array($select_proposal)
                            ->from(['t_proposal', 'SM'])
                            ->join(['m_petition_status', 'MPS'], 'left')->on('MPS.id', '=', 'SM.m_petition_status_id')
                            ->join(['m_menu', 'MM'], 'left')->on('MM.id', '=', 'SM.m_menu_id')
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                            ->join(['m_user', 'MULA'], 'left')->on('MULA.id', '=', 'SM.last_approve_user_id')
                            ->join(['t_comment', 'TC'], 'left')->on('TC.petition_id', '=', 'SM.id')->on('TC.petition_type', '=', \DB::expr('1'))
                            ->join(['t_approval_status', 'TAS'], 'left')->on('TAS.petition_id', '=', 'SM.id')->on('TAS.petition_type', '=', \DB::expr('1'))->on('TAS.item_status', '=', \DB::expr('"active"'))
                            ->join(['m_approval_status', 'MAS'], 'left')->on('MAS.id', '=', 'TAS.m_approval_status_id')
                            ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'TAS.m_authority_id')
                            ->where('SM.item_status', '=', 'active') //get petition active
                            ;

        //Query table t_request - form 0.4
        $queryPayment = \DB::select_array($select_request)
                            ->from(['t_request', 'SM'])
                            ->join(['m_petition_status', 'MPS'], 'left')->on('MPS.id', '=', 'SM.m_petition_status_id')
                            ->join(['m_request_menu', 'MRM'], 'left')->on('MRM.id', '=', 'SM.m_request_menu_id')
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                            ->join(['m_user', 'MULA'], 'left')->on('MULA.id', '=', 'SM.last_approve_user_id')
                            ->join(['t_comment', 'TC'], 'left')->on('TC.petition_id', '=', 'SM.id')->on('TC.petition_type', '=', \DB::expr('2'))
                            ->join(['t_approval_status', 'TAS'], 'left')->on('TAS.petition_id', '=', 'SM.id')->on('TAS.petition_type', '=', \DB::expr('2'))->on('TAS.item_status', '=', \DB::expr('"active"'))
                            ->join(['m_approval_status', 'MAS'], 'left')->on('MAS.id', '=', 'TAS.m_approval_status_id')
                            ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'TAS.m_authority_id')
                            ->where('SM.item_status', '=', 'active') //get petition active
                            ;



        // Filter apply_user who was created form
        if(isset($param['apply_user']) && !empty($param['apply_user'])){
            switch ($param['apply_user']) {
                case 'me':
                    $queryProposal->and_where('SM.m_user_id', '=', $user_info['id']);
                    $queryPayment->and_where('SM.m_user_id', '=', $user_info['id']);
                    break;
                case 'department':
                    $arr_param = ['department_area' => 'department',
                                    'm_user_id' => $user_info['id'],
                                    'm_department_id' => $user_info['active_m_department_id']];
                    $ids = \Model_MUser::getUserBasedDepartment($arr_param);
                    $queryProposal->and_where('SM.m_user_id', 'IN', $ids);
                    $queryPayment->and_where('SM.m_user_id', 'IN', $ids);
                    break;
                case 'division':
                    $arr_param = ['department_area' => 'division',
                                    'm_user_id' => $user_info['id'],
                                    'm_department_id' => $user_info['active_m_department_id']];
                    $ids = \Model_MUser::getUserBasedDepartment($arr_param);


                    $queryProposal->and_where('SM.m_user_id', 'IN', $ids);
                    $queryPayment->and_where('SM.m_user_id', 'IN', $ids);
                    break;
                case 'manager':
                    break;
            }

            $queryProposal->group_by('SM.id');
            $queryPayment->group_by('SM.id');
        }else{
            $queryProposal->and_where('TAS.m_authority_id', '!=', '1') //remove creator
                            ->and_where('SM.m_petition_status_id', 'NOT IN', ['1']); //remove status = "draft"
            $queryPayment->and_where('TAS.m_authority_id', '!=', '1') //remove creator
                            ->and_where('SM.m_petition_status_id', 'NOT IN', ['1']); //remove status = "draft"
        }

        //filter base on user create form
        if(isset($param['request_area']) && $param['request_area'] == 'user-list-form'){
            $queryProposal->and_where('TAS.m_authority_id', '=', 1);
            $queryPayment->and_where('TAS.m_authority_id', '=', 1);
        }
        /*=========================================================
         * System filter
         *=========================================================*/
        // ($user_info['staff_no'] == 'keiri') && $query1->and_where('TAS.authority_code', 'NOT IN', ['05', '06', '07']);

        // if(!empty($user_info)
        //     && ((isset($param['apply_user']) && $param['apply_user'] == 'me')
        //         || (isset($param['approval_user']) && $param['approval_user'] == 'me')
        //         )
        //     && ($user_info['staff_no'] != 'system'
        //         || (isset($param['approval_user']) && $param['approval_user'] == 'me'))
        //     ){
        //     $queryProposal->and_where('TAS.m_user_id', '=', $user_info['id'])->group_by('TAS.id', 'SM.id');
        //     $queryPayment->and_where('TAS.m_user_id', '=', $user_info['id'])->group_by('TAS.id', 'SM.id');

        //     // if($user_info['staff_no'] == 'system'){
        //     //     $queryProposal->group_by('SM.id');
        //     //     $queryPayment->group_by('SM.id');
        //     // }
        // }else{
        //     $queryProposal->group_by('SM.id');
        //     $queryPayment->group_by('SM.id');
        // }



        if(!empty($user_info)
            && (
                (isset($param['apply_user']) && $param['apply_user'] == 'me')
                || (isset($param['approval_user']) && $param['approval_user'] == 'me')
                )

            && ($user_info['staff_no'] != 'system'
                || (isset($param['approval_user']) && $param['approval_user'] == 'me'))
            ){
            $queryProposal->and_where('TAS.m_user_id', '=', $user_info['id'])->group_by('TAS.id', 'SM.id');
            $queryPayment->and_where('TAS.m_user_id', '=', $user_info['id'])->group_by('TAS.id', 'SM.id');
        }else{
            $queryProposal->group_by('SM.id');
            $queryPayment->group_by('SM.id');
        }

        //Set default petition_id
        if((isset($param['approval_user']) && $param['approval_user'] == 'me')
            || (isset($param['apply_user']) && $param['apply_user'] == 'me')){
            if(!isset($param['m_petition_status_id']) || empty($param['m_petition_status_id'])){
                $arrIds = ['1', '2', '3', '5', '6', '7', '4_check', '4_uncheck'];
                $param['m_petition_status_id'] = implode(',', $arrIds);
            }
        }


        /*=========================================================
         * Filter data from client request
         *=========================================================*/
        // Filter menu type
        if(isset($param['m_menu_id']) && !empty($param['m_menu_id'])){
            $m_menu_id = is_array($param['m_menu_id'])?current($param['m_menu_id']):$param['m_menu_id'];
            $arrMenu = explode('_', $m_menu_id);
            switch ($arrMenu[0]) {
                case 'menu':
                    $queryProposal->and_where('SM.m_menu_id', '=', $arrMenu[1]);
                    break;
                case 'payment':
                    $queryPayment->and_where('SM.m_request_menu_id', '=', $arrMenu[1]);
                    break;

            }
        }
        // Filter fullname who was created form
        if(isset($param['fullname']) && !empty($param['fullname'])){
            $queryProposal->and_where('MU.fullname', 'LIKE', '%' . $param['fullname'] . '%');
            $queryPayment->and_where('MU.fullname', 'LIKE', '%' . $param['fullname'] . '%');
        }
        // Filter code of form
        if(isset($param['code']) && !empty($param['code'])){
            $queryProposal->and_where('SM.code', 'LIKE', '%' . $param['code'] . '%');
            $queryPayment->and_where('SM.code', 'LIKE', '%' . $param['code'] . '%');
        }
        // Filter name of form
        if(isset($param['name']) && !empty($param['name'])){
            $queryProposal->and_where('SM.name', 'LIKE', '%' . $param['name'] . '%');
            $queryPayment->and_where('SM.name', 'LIKE', '%' . $param['name'] . '%');
        }
        // Filter petition status id of form
        if(isset($param['m_petition_status_id']) && !empty($param['m_petition_status_id'])){
            $arrIds = explode(',', $param['m_petition_status_id']);
            if(!empty($arrIds)){
                $queryProposal->and_where_open();
                $queryPayment->and_where_open();

                if(in_array('4_check', $arrIds)){
                    $queryProposal->or_where_open()
                                ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                                ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                                ->and_where('TAS.notice_confirm_code', '=', 1) //uncheck notice confirm
                                ->or_where_close();

                    $queryPayment->or_where_open()
                                ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                                ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                                ->and_where('TAS.notice_confirm_code', '=', 1) //uncheck notice confirm
                                ->or_where_close();
                }

                //Has status 4_uncheck
                if(in_array('4_uncheck', $arrIds)){
                    $queryProposal->or_where_open()
                                ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                                ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                                ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notice confirm
                                ->or_where_close();

                    $queryPayment->or_where_open()
                                ->and_where('SM.m_petition_status_id', '=', 4) //petition_status_code = 03
                                ->and_where('TAS.m_user_id', '=', \DB::expr('SM.m_user_id'))
                                ->and_where('TAS.notice_confirm_code', '=', 0) //uncheck notice confirm
                                ->or_where_close();
                }
                if(array_search('4_check', $arrIds) != null) unset($arrIds[array_search('4_check', $arrIds)]);
                if(array_search('4_uncheck', $arrIds) != null) unset($arrIds[array_search('4_uncheck', $arrIds)]);


                //Has status 01 add more status 06, 07
                if(in_array('2', $arrIds)){
                    $arrIds = array_merge($arrIds, ['9', '8']);
                }
                //Has status 02 add more status 10, 11, 12
                if(in_array('3', $arrIds)){
                    //incase query in list form payment - keiri
                    if(isset($param['request_area']) && ($param['request_area'] == 'management-list-form-payment'  || $param['request_area'] == 'management-list-form-payment-obic')){

                    }else{
                        $arrIds = array_merge($arrIds, ['10', '11']);
                    }
                }

                !empty($arrIds) && $queryProposal->or_where('SM.m_petition_status_id', 'IN', $arrIds);
                !empty($arrIds) && $queryPayment->or_where('SM.m_petition_status_id', 'IN', $arrIds);

                $queryProposal->and_where_close();
                $queryPayment->and_where_close();
            }
        }
        // Filter approval status id of user in routes
        if(isset($param['approval_status_id']) && !empty($param['approval_status_id'])){
            $arrIds = explode(',', $param['approval_status_id']);

            $queryProposal->and_where_open();
            $queryPayment->and_where_open();

            if(in_array('intend', $arrIds)){
                unset($arrIds[array_search('intend', $arrIds)]);

                $queryProposal->or_where('TAS.m_approval_status_id', '=', '');
                $queryPayment->or_where('TAS.m_approval_status_id', '=', '');
                $queryProposal->or_where(\DB::expr('TAS.m_approval_status_id IS NULL'));
                $queryPayment->or_where(\DB::expr('TAS.m_approval_status_id IS NULL'));
            }
            if(!empty($arrIds)){
                $queryProposal->and_where('TAS.m_approval_status_id', 'IN', $arrIds);
                $queryPayment->and_where('TAS.m_approval_status_id', 'IN', $arrIds);
            }

            $queryProposal->and_where_close();
            $queryPayment->and_where_close();
        }
        // Filter authority id of user in routes
        if(isset($param['authority_id']) && !empty($param['authority_id'])){
            $arrIds = explode(',', $param['authority_id']);
            $queryProposal->and_where('TAS.m_authority_id', 'IN', $arrIds);
            $queryPayment->and_where('TAS.m_authority_id', 'IN', $arrIds);
        }
        // Filter form has comment - options: none, yes, no, unread
        if(isset($param['comment']) && !empty($param['comment']) && $param['comment'] != 'none'){
            if($param['comment'] == 'yes'){
                $queryProposal->and_where('TC.id', '!=', '');
                $queryPayment->and_where('TC.id', '!=', '');
            }else if($param['comment'] == 'no'){
                $queryProposal->and_where('TC.id', 'IS',\DB::expr('NULL'));
                $queryPayment->and_where('TC.id', 'IS',\DB::expr('NULL'));
            }else if($param['comment'] == 'unread'){
                $queryProposal->and_where('TAS.is_read_comment', '=', 0);
                $queryPayment->and_where('TAS.is_read_comment', '=', 0);
            }
        }
        // Filter form has comment - options: none, yes, no
        if(isset($param['priority_flg']) && !empty($param['priority_flg']) && $param['priority_flg'] != 'none'){
            if($param['priority_flg'] == 'yes'){
                $queryProposal->and_where('SM.priority_flg', '=', 1);
                $queryPayment->and_where('SM.priority_flg', '=', 1);
            }else if($param['priority_flg'] == 'no'){
                $queryProposal->and_where('SM.priority_flg', '=', 0);
                $queryPayment->and_where('SM.priority_flg', '=', 0);
            }
        }
        // Filter form has notify confirm - options: none, yes, no
        if(isset($param['notice_confirm_code']) && !empty($param['notice_confirm_code']) && $param['notice_confirm_code'] != 'none'){
            if($param['notice_confirm_code'] == 'yes'){
                $queryProposal->and_where('TAS.notice_confirm_code', '=', 1);
                $queryPayment->and_where('TAS.notice_confirm_code', '=', 1);
            }else if($param['notice_confirm_code'] == 'no'){
                $queryProposal->and_where('TAS.notice_confirm_code', '=', 0);
                $queryPayment->and_where('TAS.notice_confirm_code', '=', 0);
            }
        }
        // Filter date apply form
        if(isset($param['date_from']) && !empty($param['date_from']) && isset($param['date_to']) && !empty($param['date_to'])){
            $date_from = date('Y-m-d', strtotime($param['date_from']));
            $date_to = date('Y-m-d', strtotime($param['date_to']));
            $filterDays = [$date_from, $date_to];
            sort($filterDays);
            $queryProposal->and_where('SM.date', 'BETWEEN', $filterDays);
            $queryPayment->and_where('SM.date', 'BETWEEN', $filterDays);
        }else if(isset($param['date_from']) && !empty($param['date_from'])){
            $date_from = date('Y-m-d', strtotime($param['date_from']));
            $queryProposal->and_where('SM.date', '>=', $date_from);
            $queryPayment->and_where('SM.date', '>=', $date_from);
        }else if(isset($param['date_to']) && !empty($param['date_to'])){
            $date_to = date('Y-m-d', strtotime($param['date_to']));
            $queryProposal->and_where('SM.date', '<=', $date_to);
            $queryPayment->and_where('SM.date', '<=', $date_to);
        }


        // Filter current user last approve form
        if(isset($param['last_approved_date_from']) && !empty($param['last_approved_date_from']) && isset($param['last_approved_date_to']) && !empty($param['last_approved_date_to'])){
            $date_from = date('Y-m-d', strtotime($param['last_approved_date_from']));
            $date_to = date('Y-m-d', strtotime($param['last_approved_date_to']));
            $filterDays = [$date_from, $date_to];
            sort($filterDays);

            $queryProposal->and_where_open();
            $queryProposal->and_where('TAS.approval_datetime', 'BETWEEN', $filterDays);
            $queryProposal->and_where('TAS.m_user_id', '=', $user_info['id']);
            $queryProposal->and_where('TAS.m_authority_id', '!=', 1); //except user create form
            $queryProposal->and_where_close();

            $queryPayment->and_where_open();
            $queryPayment->and_where('TAS.approval_datetime', 'BETWEEN', $filterDays);
            $queryPayment->and_where('TAS.m_user_id', '=', $user_info['id']);
            $queryPayment->and_where('TAS.m_authority_id', '!=', 1); //except user create form
            $queryPayment->and_where_close();


        }else if(isset($param['last_approved_date_from']) && !empty($param['last_approved_date_from'])){
            $date_from = date('Y-m-d', strtotime($param['last_approved_date_from']));

            $queryProposal->and_where_open();
            $queryProposal->and_where('TAS.approval_datetime', '>=', $date_from);
            $queryProposal->and_where('TAS.m_user_id', '=', $user_info['id']);
            $queryProposal->and_where('TAS.m_authority_id', '!=', 1); //except user create form
            $queryProposal->and_where_close();

            $queryPayment->and_where_open();
            $queryPayment->and_where('TAS.approval_datetime', '>=', $date_from);
            $queryPayment->and_where('TAS.m_user_id', '=', $user_info['id']);
            $queryPayment->and_where('TAS.m_authority_id', '!=', 1); //except user create form
            $queryPayment->and_where_close();
        }else if(isset($param['last_approved_date_to']) && !empty($param['last_approved_date_to'])){
            $date_to = date('Y-m-d', strtotime($param['last_approved_date_to']));

            $queryProposal->and_where_open();
            $queryProposal->and_where('TAS.approval_datetime', '<=', $date_to);
            $queryProposal->and_where('TAS.m_user_id', '=', $user_info['id']);
            $queryProposal->and_where('TAS.m_authority_id', '!=', 1); //except user create form
            $queryProposal->and_where_close();

            $queryPayment->and_where_open();
            $queryPayment->and_where('TAS.approval_datetime', '<=', $date_to);
            $queryPayment->and_where('TAS.m_user_id', '=', $user_info['id']);
            $queryPayment->and_where('TAS.m_authority_id', '!=', 1); //except user create form
            $queryPayment->and_where_close();
        }

        //Filter Data When export Fb
        if(isset($param['fb_export']) && $param['fb_export']){
            $queryPayment->and_where('SM.m_petition_status_id', '=', 11) //petition_status_code = 12 | FB出力登録
                        ->and_where('SM.zenginkyo_output_hold_flg', '=', 0)
                        ->and_where('SM.zenginkyo_output_prevent_flg', '=', 0)
                        ->and_where_open()
                        ->or_where('SM.zenginkyo_outeput_date', '=', "")
                        ->or_where('SM.zenginkyo_outeput_date', 'IS', \DB::expr('NULL'))
                        ->and_where_close()
                        ->and_where_open()
                        ->or_where('SM.obic_outeput_date', '!=', "")
                        ->or_where('SM.obic_outeput_date', 'IS NOT', \DB::expr('NULL'))
                        ->and_where_close();
        }

        //Union Query
        if(isset($param['m_menu_id']) && !empty($param['m_menu_id'])){
            $m_menu_id = is_array($param['m_menu_id'])?current($param['m_menu_id']):$param['m_menu_id'];
            $arrMenu = explode('_', $m_menu_id);
            switch ($arrMenu[0]) {
                case 'menu':
                    $query = \DB::select(\DB::expr('SQL_CALC_FOUND_ROWS `UQ`.`id`'), 'UQ.*')
                                ->from(\DB::expr('('.$queryProposal.') UQ'));
                    break;
                case 'payment':
                    $query = $queryPayment;
                    $query = \DB::select(\DB::expr('SQL_CALC_FOUND_ROWS `UQ`.`id`'), 'UQ.*')
                                ->from(\DB::expr('('.$queryPayment.') UQ'));
                    break;
            }
        }else{
            $query = \DB::select(\DB::expr('SQL_CALC_FOUND_ROWS `UQ`.`id`'), 'UQ.*')
                    ->from(\DB::expr('(('.$queryProposal.') UNION ('.$queryPayment.')) UQ'));
        }


        if(isset($param['order']) && !empty($param['order'])){
        }else{
            $query->order_by('UQ.priority_flg', 'DESC')
                ->order_by('UQ.date', 'DESC')
                ->order_by('UQ.m_petition_status_id', 'ASC')
                ->order_by('UQ.id', 'DESC');
        }


        //Param Sortable Datatable screen /management/list-form-payment keiri list form
        if(isset($param['request_area']) && ($param['request_area'] == 'management-list-form-payment'  || $param['request_area'] == 'management-list-form-payment-obic')){
            //sub-query get column receipt_flg
            $receipt_flg = 'CASE SM.m_request_menu_id
                                WHEN 1 THEN (IF((SELECT TRTS.id
                                                    FROM t_request_transport_spec TRTS
                                                    LEFT JOIN m_expense_item MEI ON MEI.id=TRTS.m_expense_item_id
                                                    WHERE TRTS.t_request_id=SM.id
                                                    AND TRTS.item_status = "active"
                                                    AND MEI.receipt_flg = 1
                                                    LIMIT 1) > 0, 1, 0))
                                WHEN 4 THEN (SELECT TRTE.lodging_receipt_flg FROM t_request_traveling_expenses TRTE WHERE TRTE.t_request_id=SM.id AND TRTE.item_status = "active" LIMIT 1)
                                WHEN 5 THEN (SELECT TRTE.lodging_receipt_flg FROM t_request_traveling_expenses TRTE WHERE TRTE.t_request_id=SM.id AND TRTE.item_status = "active" LIMIT 1)
                                WHEN 6 THEN (SELECT MEI.receipt_flg FROM t_request_purchase TRP INNER JOIN m_expense_item MEI ON MEI.id=TRP.m_expense_item_id WHERE TRP.t_request_id=SM.id AND TRP.item_status = "active" LIMIT 1)
                                WHEN 8 THEN (SELECT MEI.receipt_flg FROM t_request_dietary TRD INNER JOIN m_expense_item MEI ON MEI.id=TRD.m_expense_item_id WHERE TRD.t_request_id=SM.id AND TRD.item_status = "active" LIMIT 1)
                                WHEN 9 THEN (SELECT MEI.receipt_flg FROM t_request_dietary TRD INNER JOIN m_expense_item MEI ON MEI.id=TRD.m_expense_item_id WHERE TRD.t_request_id=SM.id AND TRD.item_status = "active" LIMIT 1)
                                ELSE 0
                            END AS receipt_flg';

             $paymentSelect = ['SM.amount', 'SM.receipt_arrival', 'SM.cor_settlement_amount', 'SM.obic_outeput_date', 'SM.zenginkyo_outeput_date', 'SM.zenginkyo_output_hold_flg',
                                \DB::expr($receipt_flg), \DB::expr('MCU.symbol AS m_currency_symbol')];
            // Select id only petition_id
            if(isset($param['select_id_only']) && !empty($param['select_id_only'])) {
                $paymentSelect = ['SM.id', 'SM.priority_flg', 'SM.date', 'SM.m_petition_status_id'];
            }

            $query = $queryPayment->select_array($paymentSelect)
                                    ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'SM.m_currency_id');

            //Filter based on department
            $filterUserIdsCondition = ['m_company_id' => isset($param['m_company_id'])?$param['m_company_id']:null,
                                        'business_id' => isset($param['business_id'])?$param['business_id']:null,
                                        'division_id' => isset($param['division_id'])?$param['division_id']:null,
                                        'department_id' => isset($param['m_department_id'])?$param['m_department_id']:null,
                                        ];
            $filterUserIds     = \Model_MUser::listData($filterUserIdsCondition, array('task'=>'list-dbtable' , 'sub_task' => 'filter_user_id'));
            if(!empty($filterUserIds)){
                $query->and_where('SM.m_user_id', 'IN', $filterUserIds);
            }else{
                //empty data
                $query->and_where('SM.m_user_id', '=', \DB::expr('NULL'));
            }

            // Filter staff_no
            if(isset($param['staff_no']) && $param['staff_no'] != ''){
                $query->and_where('MU.staff_no', 'LIKE', '%' . $param['staff_no'] . '%');
            }

            //Build Query
            $query = \DB::select(\DB::expr('SQL_CALC_FOUND_ROWS `UQ`.`id`'), 'UQ.*')
                        ->from(\DB::expr('('.$queryPayment.') UQ'));


            // Filter receipt_arrival
            if(isset($param['receipt_arrival']) && $param['receipt_arrival'] != '' && $param['receipt_arrival'] != 'none'){
                $query->and_where('UQ.receipt_arrival', '=', $param['receipt_arrival']);
            }

            // Filter receipt_arrival
            if(isset($param['receipt_flg']) && $param['receipt_flg'] != '' && $param['receipt_flg'] != 'none'){
                $query->and_where('UQ.receipt_flg', '=', $param['receipt_flg']);
            }

            // Filter amount apply form
            if(isset($param['amount_from']) && !empty($param['amount_from']) && isset($param['amount_to']) && !empty($param['amount_to'])){
                $amount_from = $param['amount_from'];
                $amount_to = $param['amount_to'];
                $filterAmount = [$amount_from, $amount_to];
                sort($filterAmount);
                $query->and_where('UQ.amount', 'BETWEEN', $filterAmount);
            }else if(isset($param['amount_from']) && !empty($param['amount_from'])){
                $amount_from = $param['amount_from'];
                $query->and_where('UQ.amount', '>=', $amount_from);
            }else if(isset($param['amount_to']) && !empty($param['amount_to'])){
                $amount_to = $param['amount_to'];
                $query->and_where('UQ.amount', '<=', $amount_to);
            }


            if(isset($param['order']) && !empty($param['order'])){
            }else{
                $query->order_by('UQ.priority_flg', 'DESC')
                    ->order_by('UQ.date', 'DESC')
                    ->order_by('UQ.m_petition_status_id', 'ASC')
                    ->order_by('UQ.id', 'DESC');
            }
        }

        /*================================================
         * Response Data
         *================================================*/
        if(isset($param['has_datatable']) && $param['has_datatable']){
            $columns = [];
            //Param Sortable Datatable screen /list-form
            if(isset($param['request_area']) && $param['request_area'] == 'user-list-form'){
                $columns = [
                        ['db' => 'UQ.date', 'dt' => 0],
                        ['db' => 'UQ.comment_id', 'dt' => 1],
                        ['db' => 'UQ.priority_flg', 'dt' => 2],
                        ['db' => 'UQ.menu_name', 'dt' => 3],
                        ['db' => 'UQ.name', 'dt' => 4],
                        ['db' => 'UQ.code', 'dt' => 5],
                        ['db' => 'UQ.petition_status_name', 'dt' => 6],
                        ['db' => 'UQ.fullname', 'dt' => 7],
                        ['db' => 'UQ.last_approve_user_fullname', 'dt' => 8],
                        ['db' => 'UQ.last_approve_date', 'dt' => 9],
                    ];
            }

            //Param Sortable Datatable screen /management/list-form
            if(isset($param['request_area']) && $param['request_area'] == 'management-list-form'){
                $columns = [
                        ['db' => 'UQ.id', 'dt' => 0],
                        ['db' => 'UQ.comment_id', 'dt' => 1],
                        ['db' => 'UQ.priority_flg', 'dt' => 2],
                        ['db' => 'UQ.petition_status_name', 'dt' => 3],
                        ['db' => 'UQ.authority_name', 'dt' => 4],
                        ['db' => 'UQ.approval_status_name', 'dt' => 5],
                        ['db' => 'UQ.menu_name', 'dt' => 6],
                        ['db' => 'UQ.name', 'dt' => 7],
                        ['db' => 'UQ.date', 'dt' => 8],
                        ['db' => 'UQ.fullname', 'dt' => 9],
                        ['db' => 'UQ.last_approve_date', 'dt' => 10],
                        ['db' => 'UQ.code', 'dt' => 11],
                    ];
            }

            //Param Sortable Datatable screen /management/list-form-payment keiri list form
            if(isset($param['request_area']) && $param['request_area'] == 'management-list-form-payment'){
                $columns = [
                        ['db' => 'UQ.id', 'dt' => 0],
                        ['db' => 'UQ.date', 'dt' => 1],
                        ['db' => 'UQ.code', 'dt' => 2],
                        ['db' => 'UQ.menu_name', 'dt' => 3],
                        ['db' => 'UQ.name', 'dt' => 4],
                        ['db' => 'UQ.amount', 'dt' => 5],
                        ['db' => 'UQ.receipt_arrival', 'dt' => 6],
                        ['db' => 'UQ.receipt_flg', 'dt' => 7],
                        ['db' => 'UQ.fullname', 'dt' => 8],
                        ['db' => 'UQ.petition_status_name', 'dt' => 9],
                        ['db' => 'UQ.cor_settlement_amount', 'dt' => 10],
                        ['db' => 'UQ.last_approve_user_fullname', 'dt' => 11],
                        ['db' => 'UQ.obic_outeput_date', 'dt' => 12],
                        ['db' => 'UQ.zenginkyo_outeput_date', 'dt' => 13],
                        ['db' => 'UQ.zenginkyo_output_hold_flg', 'dt' => 14],
                    ];
            }

            //Param Sortable Datatable screen /management/list-form-payment keiri list form
            if(isset($param['request_area']) && $param['request_area'] == 'management-list-form-payment-obic'){
                $columns = [
                        ['db' => 'UQ.date', 'dt' => 0],
                        ['db' => 'UQ.code', 'dt' => 1],
                        ['db' => 'UQ.menu_name', 'dt' => 2],
                        ['db' => 'UQ.name', 'dt' => 3],
                        ['db' => 'UQ.amount', 'dt' => 4],
                        ['db' => 'UQ.fullname', 'dt' => 5],
                        ['db' => 'UQ.petition_status_name', 'dt' => 6],
                        ['db' => 'UQ.cor_settlement_amount', 'dt' => 7],
                        ['db' => 'UQ.obic_outeput_date', 'dt' => 8]
                    ];
            }

            // echo $query;
            $result = \Vision_Db::datatable_query($query, $columns, $param);
            $items      = $result['data'];
            // foreach($items as $k => $v){
            // }
            $response = ["sEcho" => intval(@$this->_arrParam['sEcho']),
                        "iTotalRecords" => $result['total'],
                        "iTotalDisplayRecords" => $result['total'],
                        "aaData" => $items
                        ];
            return $this->response($response);
        }else{
            // Group by petition_id
            if(isset($param['group_by_id']) && !empty($param['group_by_id'])) {
                $query->group_by('UQ.id');
            }
            $data = $query->execute()->as_array();
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
    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Approval multiple form both 0.2(menu) and 0.4(payment)
     * authority_id = 2 - 02|審議 & m_approval_status_id = 1 - 00|未処理
     * Method POST
     *=============================================================*/
    public function post_multiple_approval(){
        $param = \Input::param();
        $user_info = \Auth::get();
        if(isset($param['items']) && $param['items'] && $user_info){
            $items = json_decode($param['items']);

            foreach ($items as $val) {
                $authority_id = $val->authority_id;
                $arrMenu = explode('_', $val->id);
                $petition_type = 1;
                $petition_id = $arrMenu[1];
                switch ($arrMenu[0]) {
                    case 'payment':
                        $petition_type = 2;
                        break;

                }

                /*==========================================================
                 * Get Current User In List Approve
                 *==========================================================*/
                $conditions = ['petition_id' => $petition_id,
                                'petition_type' => $petition_type,
                                'm_user_id' => $user_info['id'],
                                'm_authority_id' => $authority_id,
                                'm_approval_status_id' => 1, //approval_status_code = 00
                                'item_status' => 'active'
                                ];
                $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);


                if(empty($current_approval)) continue;
                switch ($authority_id) {
                    case '2':
                        //authority_code = 02

                        $arrParam = ['request_m_user_id' => $user_info['id'],
                                    'process_type' => 'approve',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '2', //m_approval_status_code = 01
                                    'm_petition_status_id' => '2', //m_petition_status_code = 01
                                    'next_m_approval_status_id' => '1', //m_approval_status_code = 00
                                    ];
                        break;
                    case '4':
                        //authority_code = 04
                        $arrParam = ['request_m_user_id' => $user_info['id'],
                                    'process_type' => 'broadcast',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '6' //m_approval_status_code = 10 | 同報確認 | id = 6
                                    ];
                        break;
                }

                $arrParam['petition_id'] = $petition_id;
                $arrParam['petition_type'] = $petition_type;
                $arrParam['m_user_id'] = $user_info['id'];
                $this->approval_form($arrParam);



            }
            $response = ['status' => 'success',
                            'code' => Exception::E_UPDATE_SUCCESS,
                            'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS)
                        ];
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR)];
        }


        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Approval single process form both 0.2(menu) and 0.4(payment)
     * Type process:
            - apply
            - with_draw
            - approve
            - last_approve
            - deny
            - return
            - broadcast
     * Method POST
     * Input: process_type, petition_id, petition_type, m_user_id (user process form)
     *=============================================================*/
    public function post_single_process(){
        $param = \Input::param();
        $user_info = \Auth::get();
        if(empty($user_info) && !empty($param['m_user_id'])){
            $user_info = \Model_MUser::getDetailUserInfo($param);
        }

        $_process_status = true;

        if(isset($param['process_type']) && $param['process_type'] && isset($param['petition_id']) && $param['petition_id']
            && isset($param['petition_type']) && $param['petition_type']&& isset($param['m_user_id']) && $param['m_user_id']){

            //General parameters
            $process_type = $param['process_type'];
            $petition_id = $param['petition_id'];
            $petition_type = $param['petition_type'];
            $m_user_id = $param['m_user_id'];
            $request_m_user_id = $param['request_m_user_id'];

            //Update Status Form
            if($petition_type == 1){
                //Form 0.2 t_proposal
                $objTForm = \Model_TProposal::find($petition_id);
            }elseif ($petition_type == 2) {
                //Form 0.4 t_request
                $objTForm = \Model_TRequest::find($petition_id);
            }


            switch ($process_type) {
                case 'apply':
                    //Update Status Form
                    if($petition_type == 1){
                        //Form 0.2 t_proposal
                        \DB::update('t_proposal')->set(['m_petition_status_id' => 2,
                                                        'updated_date' => date('Y-m-d H:i:s'),
                                                        'updated_user_id' => $user_info['id']]) //petition status code = 01 - form apply
                                                    ->where('id', '=', $petition_id)
                                                    ->execute();
                    }elseif ($petition_type == 2) {
                        //Form 0.4 t_request
                        \DB::update('t_request')->set(['m_petition_status_id' => 2,
                                                        'updated_date' => date('Y-m-d H:i:s'),
                                                        'updated_user_id' => $user_info['id']]) //petition status code = 01 - form apply
                                                    ->where('id', '=', $petition_id)
                                                    ->execute();
                    }
                    //Update Time Apply Form
                    \DB::update('t_approval_status')->set(['approval_datetime' => date('Y-m-d H:i:s'),
                                                            'updated_date' => date('Y-m-d H:i:s'),
                                                            'updated_user_id' => $user_info['id']])
                                                ->where('petition_id', '=', $petition_id)
                                                ->and_where('petition_type', '=', $petition_type)
                                                ->and_where('m_user_id', '=', $m_user_id)
                                                ->and_where('m_authority_id', '=', 1) //athority code = 01 - form creator
                                                ->execute();
                    //Update First User Approve Status
                    \DB::update('t_approval_status')->set(['m_approval_status_id' => 1,
                                                            'updated_date' => date('Y-m-d H:i:s'),
                                                            'updated_user_id' => $user_info['id']])
                                                ->where('petition_id', '=', $petition_id)
                                                ->and_where('petition_type', '=', $petition_type)
                                                ->and_where('order', '=', 2)
                                                ->execute();

                    // //open socket send email notify to creator
                    $uri_query = ['process_type' => $process_type,
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $m_user_id,
                                    'current_approval_status_id' => 1];
                    $url_request = '/public/api/v1/system_socket/send_mail_process_form?' . http_build_query($uri_query);
                    $this->send_request($url_request);
                    break;
                //User Get Down Form
                case 'with_draw':
                    //Process when petition status code 01 | 07 | 08
                    if(in_array($objTForm->m_petition_status_id, [2, 8, 9])){
                        //Update petition status code of form to 6|05|取下
                        if(!empty($objTForm)){
                            $objTForm->set(['m_petition_status_id' => 6])->save();
                        }

                        //Update notice confirm code to user approved form - notice_confirm_code => 0 //uncheck - m_approval_status_id NOT IN ('', null, 1)
                        \DB::update('t_approval_status')->set(['notice_confirm_code' => 0,
                                                                'updated_date' => date('Y-m-d H:i:s'),
                                                                'updated_user_id' => $user_info['id']])
                                                ->where('petition_id', '=', $petition_id)
                                                ->and_where('petition_type', '=', $petition_type)
                                                ->and_where('m_approval_status_id', 'IS NOT', \DB::expr('NULL'))
                                                ->and_where('m_approval_status_id', '!=', '')
                                                ->and_where('m_approval_status_id', '!=', '1')
                                                ->execute();
                    }
                    break;
                //User Update Notice Confirm
                case 'update_notice_confirm':
                    //Update notice_confirm_code => 1
                    if(!empty($objTForm) && !empty($user_info)){
                        //Update notice confirm code to user approved form - notice_confirm_code => 1 //check notice confirm
                        \DB::update('t_approval_status')->set(['notice_confirm_code' => 1,
                                                                'updated_date' => date('Y-m-d H:i:s'),
                                                                'updated_user_id' => $user_info['id']])
                                                ->where('petition_id', '=', $petition_id)
                                                ->and_where('petition_type', '=', $petition_type)
                                                ->and_where('m_user_id', '=', $user_info['id'])
                                                ->execute();
                    }
                    break;
                //User Approve Form - Authority code = 02
                case 'approve':
                    /*==========================================================
                     * Get Current User In List Approve
                     *==========================================================*/
                    $conditions = ['petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'm_authority_id' => 2, // authority code = 02
                                    ['m_approval_status_id', 'IN', [1, 7]], //approval_status_code = 00|30
                                    'item_status' => 'active'
                                    ];
                    $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);

                    //Call function to process
                    if(!empty($current_approval)){
                        $arrParam = ['process_type' => 'approve',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '2', //m_approval_status_code = 01
                                    'm_petition_status_id' => '2', //m_petition_status_code = 01
                                    'next_m_approval_status_id' => '1', //m_approval_status_code = 00,
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'request_m_user_id' => $request_m_user_id
                                    ];
                        if($current_approval->m_approval_status_id == 7){
                            unset($arrParam['next_m_approval_status_id']);
                            unset($arrParam['m_petition_status_id']);
                        }
                        $this->approval_form($arrParam);
                    }else{
                        $_process_status = false;
                    }
                    break;
                //User Approve Form - Authority code = 03
                case 'last_approve':
                    /*==========================================================
                     * Get Current User In List Approve
                     *==========================================================*/
                    $conditions = ['petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'm_authority_id' => 3, // authority code = 03
                                    'm_approval_status_id' => 1, //approval_status_code = 00
                                    'item_status' => 'active'
                                    ];
                    $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);

                    //Call function to process
                    if(!empty($current_approval)){
                        $arrParam = ['process_type' => 'last_approve',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '2', //m_approval_status_code = 01
                                    'm_petition_status_id' => '3', //m_petition_status_code = 02
                                    'next_m_approval_status_id' => '1', //m_approval_status_code = 00,
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'request_m_user_id' => $request_m_user_id
                                    ];
                        if($current_approval->m_approval_status_id == 7) unset($arrParam['next_m_approval_status_id']);
                        $res_approve = $this->approval_form($arrParam);

                        //Update notice_confirm_code => 0 - notify to user who created form
                        if($res_approve){
                            //Update notice confirm code to user who created form - notice_confirm_code => 0 //notify notice confirm
                            \DB::update('t_approval_status')->set(['notice_confirm_code' => 0,
                                                                    'updated_date' => date('Y-m-d H:i:s'),
                                                                    'updated_user_id' => $user_info['id']])
                                                    ->where('petition_id', '=', $petition_id)
                                                    ->and_where('petition_type', '=', $petition_type)
                                                    ->and_where('m_authority_id', '=', 1)
                                                    ->execute();
                        }
                    }else{
                        $_process_status = false;
                    }
                    break;
                //User Deny Form - Authority code = 03-02 |id=2-3
                case 'deny':
                    /*==========================================================
                     * Get Current User In List Approve
                     *==========================================================*/
                    $conditions = ['petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    ['m_authority_id', 'IN',  [2, 3]], // authority code = 03-02 |id=2-3
                                    ['m_approval_status_id', 'IN', [1, 7]], //approval_status_code = 00|30
                                    'item_status' => 'active'
                                    ];
                    $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);

                    //Call function to process
                    if(!empty($current_approval)){
                        $arrParam = ['process_type' => 'deny',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '4', //m_approval_status_code = 03
                                    'm_petition_status_id' => '5', //m_petition_status_code = 04
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'request_m_user_id' => $request_m_user_id
                                    ];
                        $res_approve = $this->approval_form($arrParam);

                        //Update notice_confirm_code => 0 - notify to user who created form
                        if($res_approve){
                            //Update notice confirm code to user who created form - notice_confirm_code => 0 //notify notice confirm
                            \DB::update('t_approval_status')->set(['notice_confirm_code' => 0,
                                                                    'updated_date' => date('Y-m-d H:i:s'),
                                                                    'updated_user_id' => $user_info['id']])
                                                    ->where('petition_id', '=', $petition_id)
                                                    ->and_where('petition_type', '=', $petition_type)
                                                    ->and_where('m_authority_id', '=', 1)
                                                    ->execute();
                            //Update notice confirm code to previous user approved form - notice_confirm_code => 0 //notify notice confirm
                            //Update notice confirm code to previous user approved form - notice_confirm_code => 0 //notify notice confirm
                            \DB::update('t_approval_status')->set(['notice_confirm_code' => 0,
                                                                    'updated_date' => date('Y-m-d H:i:s'),
                                                                    'updated_user_id' => $user_info['id']])
                                                            ->where('petition_id', '=', $petition_id)
                                                            ->and_where('petition_type', '=', $petition_type)
                                                            ->and_where('m_authority_id', 'IN',  [2, 3])
                                                            ->and_where('order', '<', $current_approval->order)
                                                            ->execute();
                        }
                    }else{
                        $_process_status = false;
                    }
                    break;
                //User Return Form - Authority code = 03-02 |id=2-3
                case 'return':
                    /*==========================================================
                     * Get Current User In List Approve
                     *==========================================================*/
                    $conditions = ['petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    ['m_authority_id', 'IN',  [2, 3]], // authority code = 03-02 |id=2-3
                                    ['m_approval_status_id', 'IN', [1, 7]], //approval_status_code = 00|30
                                    'item_status' => 'active'
                                    ];
                    $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);

                    //Call function to process
                    if(!empty($current_approval)){
                        $arrParam = ['process_type' => 'return',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '3', //m_approval_status_code = 02
                                    'm_petition_status_id' => '4', //m_petition_status_code = 03
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'request_m_user_id' => $request_m_user_id
                                    ];
                        $res_approve = $this->approval_form($arrParam);

                        //Update notice_confirm_code => 0 - notify to user who created form
                        if($res_approve){
                            //Update notice confirm code to user who created form - notice_confirm_code => 0 //notify notice confirm
                            \DB::update('t_approval_status')->set(['notice_confirm_code' => 0,
                                                                    'updated_date' => date('Y-m-d H:i:s'),
                                                                    'updated_user_id' => $user_info['id']])
                                                    ->where('petition_id', '=', $petition_id)
                                                    ->and_where('petition_type', '=', $petition_type)
                                                    ->and_where('m_authority_id', '=', 1)
                                                    ->execute();

                            //Update notice confirm code to previous user approved form - notice_confirm_code => 0 //notify notice confirm
                            \DB::update('t_approval_status')->set(['notice_confirm_code' => 0,
                                                                    'updated_date' => date('Y-m-d H:i:s'),
                                                                    'updated_user_id' => $user_info['id']])
                                                            ->where('petition_id', '=', $petition_id)
                                                            ->and_where('petition_type', '=', $petition_type)
                                                            ->and_where('m_authority_id', 'IN',  [2, 3])
                                                            ->and_where('order', '<', $current_approval->order)
                                                            ->execute();
                        }
                    }else{
                        $_process_status = false;
                    }
                    break;
                //User broadcast Form - Authority code = 04
                case 'broadcast':
                    /*==========================================================
                     * Get Current User In List Approve
                     *==========================================================*/
                    $conditions = ['petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'm_authority_id' => 4, // authority code = 04
                                    'm_approval_status_id' => 1, //approval_status_code = 00
                                    'item_status' => 'active'
                                    ];
                    $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);

                    //Call function to process
                    if(!empty($current_approval)){
                        $arrParam = ['process_type' => 'broadcast',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '6', //m_petition_status_code = 10 | 同報確認 | id = 6
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $user_info['id'],
                                    'request_m_user_id' => $request_m_user_id
                                    ];
                        $this->approval_form($arrParam);
                    }else{
                        $_process_status = false;
                    }
                    break;
                //User Waiting Confirm Form - Authority code = 02
                case 'waiting_confirm':
                    /*==========================================================
                     * Get Current User In List Approve
                     *==========================================================*/
                    // echo '<pre>';
                    // print_r($param);
                    // echo '</pre>';

                    $conditions = ['petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $m_user_id,
                                    'm_authority_id' => 2, // authority code = 02
                                    'm_approval_status_id' => 1, //approval_status_code = 00
                                    'item_status' => 'active'
                                    ];
                    $current_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);
                    // echo '<pre>';
                    // print_r($current_approval);
                    // echo '</pre>';
                    // die('test');
                    //Call function to process
                    if(!empty($current_approval)){
                        $arrParam = ['process_type' => 'waiting_confirm',
                                    't_approval_status_id' => $current_approval->id,
                                    'm_approval_status_id' => '7', //m_petition_status_code = 30 | 後閲確認待ち | id = 7
                                    'next_m_approval_status_id' => '1', //m_approval_status_code = 00,
                                    'petition_id' => $petition_id,
                                    'petition_type' => $petition_type,
                                    'm_user_id' => $m_user_id,
                                    'request_m_user_id' => $request_m_user_id
                                    ];
                        $this->approval_form($arrParam);
                    }else{
                        $_process_status = false;
                    }
                    break;
                //User Keiri Permission - current form status == 3 | 02 (last approved)
                //Update TRequest petition status code to 11 (OBIC出力登録)
                case 'obic_registration':

                    /*==========================================================
                     * Get Payment Form Detail
                     *==========================================================*/
                    $objTRForm = \Model_TRequest::find($petition_id);

                    //Update status
                    if(!empty($objTRForm) && $objTRForm->m_petition_status_id == 3
                        && isset($user_info['permission_keiri']) && $user_info['permission_keiri']){
                        $objTRForm->set(['m_petition_status_id' => 10])->save();
                    }else{
                        $_process_status = false;
                    }
                    break;

                /*======================================================================
                 * User Keiri Permission - current form status == 10 | 11 (OBIC出力登録)
                 * Update TRequest petition status code to 12 | id = 11 (FB出力登録)
                 * Function : update status when user export file obic
                 *======================================================================*/
                case 'obic_export':
                    /*==========================================================
                     * Get Payment Form Detail
                     *==========================================================*/
                    $objTRForm = \Model_TRequest::find($petition_id);

                    //Update status
                    if(!empty($objTRForm) && $objTRForm->m_petition_status_id == 10
                        && isset($user_info['permission_export_obic']) && $user_info['permission_export_obic']){
                        \DB::update('t_request')->set(['m_petition_status_id' => 11,
                                                                'obic_outeput_date' => date('Y-m-d H:i:s'),
                                                                'updated_date' => date('Y-m-d H:i:s'),
                                                                'updated_user_id' => $user_info['id']])
                                                        ->where('id', '=', $objTRForm->id)
                                                        ->execute();
                    }else{
                        $_process_status = false;
                    }
                    break;

                /*======================================================================
                 * User Keiri Permission - current form status == 10 | 11 (OBIC出力登録)
                 * Update TRequest petition status code to 12 | id = 11 (FB出力登録)
                 * Function : update status when user export file obic
                 *======================================================================*/
                case 'fb_export':
                    /*==========================================================
                     * Get Payment Form Detail
                     *==========================================================*/
                    $objTRForm = \Model_TRequest::find($petition_id);

                    //Update status
                    if(!empty($objTRForm) && $objTRForm->m_petition_status_id == 11
                        && isset($user_info['permission_export_fb']) && $user_info['permission_export_fb']){
                        \DB::update('t_request')->set(['m_petition_status_id' => 11,
                                                        'zenginkyo_outeput_date' => date('Y-m-d H:i:s'),
                                                        'updated_date' => date('Y-m-d H:i:s'),
                                                        'updated_user_id' => $user_info['id']])
                                                ->where('id', '=', $objTRForm->id)
                                                ->execute();

                        /*==================================================
                         * Recheck If Has Form Finish => Update Status
                         *==================================================*/
                        $query = \DB::select('id')
                                    ->from(['t_approval_status', 'SM'])
                                    ->where('petition_id', '=', $objTRForm->id)
                                    ->and_where('petition_type', '=', 2)
                                    ->and_where('m_authority_id', '!=', 1) //authority_code != 01 - create form
                                    ->and_where_open()
                                    ->and_where('m_approval_status_id', 'IN', [1, 3, 4, 7]) //m_approval_status_id NOT IN ("00", "02", "03", "30")
                                    ->or_where('m_approval_status_id', 'IS', \DB::expr('null'))
                                    ->or_where('m_approval_status_id', '=', '')
                                    ->and_where_close();

                        $checkNotComplete = $query->execute()->current();

                        if(empty($checkNotComplete)){
                            //form 0.4 - proposal
                            //Update form finish => m_petition_status_id = 7 => m_petition_status_code = 90
                           $objTRForm->set(['m_petition_status_id' => 7])->save();
                        }
                    }else{
                        $_process_status = false;
                    }
                    break;
                default:
                    $_process_status = false;
                    break;
            }



            if(!$_process_status){
                $response = ['status' => 'success',
                            'code' => Exception::E_INVALID_PARAM,
                            'message' => Exception::getMessage(Exception::E_INVALID_PARAM)
                        ];
            }else{
                $response = ['status' => 'success',
                            'code' => Exception::E_UPDATE_SUCCESS,
                            'message' => Exception::getMessage(Exception::E_UPDATE_SUCCESS)
                        ];
            }
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR)];
        }
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Generate button to process form
     * Type button:
            - draft
            - delete
            - re_draft
            - update_notice_confirm
            - export_pdf (form 0.4)
            - with_draw
            - apply
            - approve
            - last_approve
            - deny
            - return
            - broadcast
            - change_route
            - back (back_style: back_update|back_home)
     * Method GET
     * Input: petition_id, petition_type, m_user_id
     *=============================================================*/
    public function get_generate_form_button(){
        $param = \Input::param();
        $data = $btn_data = [];
        $user_info = \Auth::get();

        if(isset($param['petition_id']) && $param['petition_id']
            && isset($param['petition_type']) && $param['petition_type']&& isset($param['m_user_id']) && $param['m_user_id']){
            //General parameters
            $form_status_processing = [2, 3, 8, 9, 10, 11]; // status of form user be able to process
            $form_status_notice_confirm = [4, 5, 6]; // status of form user confirm notice - petition status code 03|04|05
            $form_authority_over_permission = [2, 3]; //user has authority to over permission approve - 02 - 03 (approve & last approve)

            $petition_id = $param['petition_id'];
            $petition_type = $param['petition_type'];
            $m_user_id = $param['m_user_id'];
            $flag_not_allow_copy = false;

            //Get form detail
            switch ($petition_type) {
                case '1':
                    //form 0.2 - t_proposal
                    $select = ['SM.id', 'SM.m_menu_id', 'SM.m_user_id', 'SM.m_petition_status_id', 'SM.code', 'SM.name', 'SM.date', 'SM.priority_flg', 'SM.change_route', 'SM.last_approve_user_id', 'SM.last_approve_date',
                                \DB::expr('MM.name AS menu_name'), \DB::expr('MM.code AS menu_code'), ];
                    $query = \DB::select_array($select)
                                 ->from(['t_proposal', 'SM'])
                                 ->join(['m_menu', 'MM'], 'left')->on('SM.m_menu_id', '=', 'MM.id')
                                 ->join(['t_approval_status', 'TAS'], 'left')->on('SM.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('1'))
                                 ->where('SM.id', '=', $petition_id)
                                 ->and_where('SM.item_status', '=', 'active');
                    $form_detail = $query->execute()->current();
                    break;
                case '2':
                    //form 0.2 - t_payment
                        $select = ['SM.id', 'SM.m_request_menu_id', 'SM.m_user_id', 'SM.m_petition_status_id', 'SM.code', 'SM.name', 'SM.date', 'SM.priority_flg', 'SM.change_route', 'SM.last_approve_user_id', 'SM.last_approve_date',
                                    \DB::expr('MRM.name AS menu_name'), \DB::expr('MRM.code AS menu_code'), ];
                        $query = \DB::select_array($select)
                                     ->from(['t_request', 'SM'])
                                     ->join(['m_request_menu', 'MRM'], 'left')->on('SM.m_request_menu_id', '=', 'MRM.id')
                                     ->join(['t_approval_status', 'TAS'], 'left')->on('SM.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('2'))
                                     ->where('SM.id', '=', $petition_id)
                                     ->and_where('SM.item_status', '=', 'active');
                        $form_detail = $query->execute()->current();
                    break;
            }

            if(empty($form_detail)){
                /*==================================================
                 * Response Data
                 *==================================================*/
                $response = ['status' => 'error',
                            'code' => Exception::E_NO_RECORD,
                            'message' => Exception::getMessage(Exception::E_NO_RECORD)];
                return $this->response($response);
            }

            //=======> Get User In list approve info <=======
            $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.m_user_id', 'SM.m_authority_id', 'SM.m_approval_status_id', 'SM.approval_datetime', 'SM.is_read_comment', 'SM.notice_confirm_code')
                     ->from(['t_approval_status', 'SM'])
                     ->where('SM.petition_id', '=', $petition_id)
                     ->and_where('SM.petition_type', '=', $petition_type)
                     ->and_where('SM.m_user_id', '=', $m_user_id)
                     ->and_where('SM.item_status', '=', 'active')
                     ;

            //Get user who created form
            if($form_detail['m_user_id'] == $m_user_id){
                $form_creator = $query->execute()->current();
            }else{
                $query->and_where_open();
                $query->and_where('SM.m_approval_status_id', 'IN', [1, 7]); //approval status code = 00|30
                $query->or_where('SM.m_approval_status_id', 'IS', \DB::expr('NULL'));
                $query->or_where('SM.m_approval_status_id', '=', '');
                $query->and_where_close();
                $query->order_by('SM.order', 'ASC');
                $current_form_user_process = $query->execute()->current();
            }

            //Case: form draft & user who created form view their form
            // petition status code = 00
            if($form_detail['m_petition_status_id'] == 1 && $form_detail['m_user_id'] == $m_user_id){
                $btn_data = [['type' => 'apply', 'name' => '申請'],
                                ['type' => 'draft', 'name' => '一時保存'],
                                ['type' => 'delete', 'name' => '削除']
                            ];

                //add button export PDF for form 0.4 - t_request
                if($petition_type == 2){
                    $btn_data[] = ['type' => 'export_pdf', 'name' => '印刷'];
                }

                //combine data
                $back_type = 'back_update';
                $data = array_merge($data, $btn_data);
            }

            //Case: form already apply & user who created form view their form
            // petition status code = 01|02|03|04 .etc
            if($form_detail['m_petition_status_id'] != 1 && $form_detail['m_user_id'] == $m_user_id){
                //uncheck notice confirm_code
                if(isset($form_creator) && $form_creator['notice_confirm_code'] == 0){
                    $btn_data[] = ['type' => 'update_notice_confirm', 'name' => '確認'];
                }

                $btn_data[] = ['type' => 're_draft', 'name' => '参照起案'];
                //allow user with_draw on form has status = 01 - not yet last approve
                if($form_detail['m_petition_status_id'] == 2){
                    $btn_data[] = ['type' => 'with_draw', 'name' => '取下げ'];
                }

                //add button export PDF for form 0.4 - t_request
                if($petition_type == 2){
                    $btn_data[] = ['type' => 'export_pdf', 'name' => '印刷'];
                }

                //combine data
                $back_type = 'back_home';
                $data = array_merge($data, $btn_data);
            }


            //Case: form already apply & user who turn to approve form (m_approval_status_id == 1)
            // petition status id = 2, 3, 8, 9, 10, 11
            if(!empty($current_form_user_process) && $current_form_user_process['m_approval_status_id'] == 1){

                if(in_array($form_detail['m_petition_status_id'], $form_status_processing)){
                    switch ($current_form_user_process['m_authority_id']) {
                        case '2': //authority_code = 02 - name: 審議 (approve form)
                            $btn_data[] = ['type' => 'approve', 'name' => '承認'];
                            $btn_data[] = ['type' => 'deny', 'name' => '否認'];
                            $btn_data[] = ['type' => 'return', 'name' => '差戻'];
                            $btn_data[] = ['type' => 'change_route', 'name' => '経路追加'];
                            break;
                        case '3': //authority_code = 03 - name: 最終審議 (last approve form)
                            $btn_data[] = ['type' => 'last_approve', 'name' => '最終承認'];
                            $btn_data[] = ['type' => 'deny', 'name' => '否認'];
                            $btn_data[] = ['type' => 'return', 'name' => '差戻'];
                            $btn_data[] = ['type' => 'change_route', 'name' => '経路追加'];
                            break;
                        case '4': //authority_code = 04 - name: 同報 (broadcast form)
                            $btn_data[] = ['type' => 'broadcast', 'name' => '同報確認'];
                            break;
                    }

                    $flag_not_allow_copy = true;
                }

                //notice confirm when form return deny with_draw
                if(in_array($form_detail['m_petition_status_id'], $form_status_notice_confirm)){
                    $btn_data[] = ['type' => 'update_notice_confirm', 'name' => '確認'];
                }

                //combine data
                $back_type = 'back_management_list_form';
                $data = array_merge($data, $btn_data);
            }


            //Case: already approved (m_approval_status_id != 1 | 7)
            // petition status id = 2, 3, 8, 9, 10, 11
            if(in_array($form_detail['m_petition_status_id'], $form_status_notice_confirm)){
                $query = \DB::select('SM.id', 'SM.petition_id', 'SM.petition_type', 'SM.m_user_id', 'SM.m_authority_id', 'SM.m_approval_status_id', 'SM.approval_datetime', 'SM.is_read_comment', 'SM.notice_confirm_code')
                         ->from(['t_approval_status', 'SM'])
                         ->where('SM.petition_id', '=', $petition_id)
                         ->and_where('SM.petition_type', '=', $petition_type)
                         ->and_where('SM.m_user_id', '=', $m_user_id)
                         ->and_where('SM.m_authority_id', '!=', 1)
                         ->and_where('SM.item_status', '=', 'active')
                         ;
                $query->and_where_open();
                $query->and_where('SM.m_approval_status_id', 'NOT IN', [1, 7]); //approval status code = 00|30
                $query->or_where('SM.m_approval_status_id', 'IS NOT', \DB::expr('NULL'));
                $query->or_where('SM.m_approval_status_id', '!=', '');
                $query->and_where_close();
                $check_form_user = $query->execute()->current();
                if(!empty($check_form_user) && $check_form_user['notice_confirm_code'] == 0){
                    $btn_data[] = ['type' => 'update_notice_confirm', 'name' => '確認'];

                    //combine data
                    $back_type = 'back_management_list_form';
                    $data = array_merge($data, $btn_data);
                }
            }



            //Case: form already apply & user over permission approve form
            // petition status id = 2, 3, 8, 9, 10, 11
            // m_authority_id in (2, 3)

            if(!empty($current_form_user_process) && in_array($form_detail['m_petition_status_id'], $form_status_processing)
                && (empty($current_form_user_process['m_approval_status_id']) || $current_form_user_process['m_approval_status_id'] == 7)
                && in_array($current_form_user_process['m_authority_id'], $form_authority_over_permission)){

                switch ($current_form_user_process['m_authority_id']) {
                    case '2': //authority_code = 02 - name: 審議 (approve form)
                        $btn_data[] = ['type' => 'approve', 'name' => '承認'];
                        break;
                    case '3': //authority_code = 03 - name: 最終審議 (last approve form)
                        $btn_data[] = ['type' => 'last_approve', 'name' => '最終承認'];
                        break;
                }
                $flag_not_allow_copy = true;
                //combine data
                $back_type = 'back_management_list_form';
                $data = array_merge($data, $btn_data);
            }

            if($form_detail['m_petition_status_id'] != 1 && $form_detail['m_user_id'] != $m_user_id
                && isset($param['access_area']) && $param['access_area'] == 'user-list-form'
                && !$flag_not_allow_copy
                && (!isset($user_info['permission_super']) || !$user_info['permission_super'])
                && (!isset($user_info['permission_hr']) || !$user_info['permission_hr'])
                && (!isset($user_info['permission_general']) || !$user_info['permission_general'])
                && (!isset($user_info['permission_keiri']) || !$user_info['permission_keiri'])
                ){

                $btn_data = [];
                //add button export PDF for form 0.4 - t_request
                if($petition_type == 2){
                    $btn_data[] = ['type' => 'export_pdf', 'name' => '印刷'];
                }
                $btn_data[] = ['type' => 're_draft', 'name' => '参照起案'];
                $data = array_merge($data, $btn_data);
            }


            $back_type = isset($back_type)?$back_type:'back_home';
            $btn_data = [['type' => $back_type,'name' => '戻る']];
            $data = array_merge($data, $btn_data);
            $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'form_detail' => $form_detail,
                    'data' => $data];
        }else{
            /*==================================================
             * Response Data
             *==================================================*/
            $response = ['status' => 'error',
                        'code' => Exception::E_VALIDATE_ERR,
                        'message' => Exception::getMessage(Exception::E_VALIDATE_ERR)];
        }
        /*==================================================
         * Response Data
         *==================================================*/
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * input: process_type, petition_id, petition_type, m_user_id, t_approval_status_id, m_approval_status_id,
     * m_petition_status_id, next_m_approval_status_id, over_permission = false(default)
     * Protected function
     *=============================================================*/
    protected function approval_form($arrParam = null, $options = null){
        $current_user_info = \Auth::get();
        $user_info = \Model_MUser::getDetailUserInfo($arrParam);

        $request_m_user_id = isset($arrParam['request_m_user_id'])?$arrParam['request_m_user_id']:$user_info['id'];
        if(!empty($arrParam['t_approval_status_id'])){
            $objTAS = \Model_TApprovalStatus::find($arrParam['t_approval_status_id']);
            if($objTAS){
                $current_approval_status_id = $objTAS->m_approval_status_id;
                $objTAS->set(['approval_datetime' => date('Y-m-d H:i:s'),
                                'm_approval_status_id' => $arrParam['m_approval_status_id']
                            ])->save();


                //open socket send email
                $uri_query = ['petition_id' => $arrParam['petition_id'],
                                'petition_type' => $arrParam['petition_type'],
                                'm_user_id' => $arrParam['m_user_id'],
                                'request_m_user_id' => $request_m_user_id,
                                'process_type' => $arrParam['process_type'],
                                'current_approval_status_id' => $objTAS->id
                                ];

                $url_request = '/public/api/v1/system_socket/send_mail_process_form?' . http_build_query($uri_query);
                $this->send_request($url_request);

                //Send email notify to user was skipped
                if($arrParam['process_type'] == 'waiting_confirm' && $current_user_info['id'] != $user_info['id']){
                    //open socket send email
                    $uri_query = ['petition_id' => $arrParam['petition_id'],
                                    'petition_type' => $arrParam['petition_type'],
                                    'm_user_id' => $arrParam['m_user_id'],
                                    'request_m_user_id' => $request_m_user_id,
                                    'process_type' => 'waiting_confirm_skipped',
                                    'current_approval_status_id' => $objTAS->id
                                    ];

                    $url_request = '/public/api/v1/system_socket/send_mail_process_form?' . http_build_query($uri_query);
                    $this->send_request($url_request);
                }
            }

            /*==================================================
             * Update approval status for next approval
             *==================================================*/
            // if($current_approval_status_id != 7){ //m_approval_status code != 30
            if(!empty($arrParam['next_m_approval_status_id'])){
                //=========== Find User Next Approve Form =============
                $current_approval_no = $objTAS->order;
                do{
                    $current_approval_no++;
                    /*==========================================================
                     * Get Next User In List Approve
                     *==========================================================*/
                    $conditions = ['petition_id' => $arrParam['petition_id'],
                                    'petition_type' => $arrParam['petition_type'],
                                    'order' => $current_approval_no,
                                    'item_status' => 'active'
                                    ];
                    $next_approval = \Model_TApprovalStatus::find('first', ['where' => $conditions, 'order_by' =>['order' => 'asc']]);
                    if(empty($next_approval)){
                        break;
                    }
                    if($next_approval->m_approval_status_id == '' || empty($next_approval->m_approval_status_id))
                        break;
                }while ($next_approval->m_approval_status_id == 11); //m_approval_status_code = 90

                if(!empty($next_approval)){
                    if(empty($next_approval->m_approval_status_id) && !empty($arrParam['next_m_approval_status_id'])){
                        $next_approval->set(['m_approval_status_id' => $arrParam['next_m_approval_status_id']])->save();
                    }
                }
            }
            // }
            /*==================================================
             * Update approval status for all user broadcast
             * authority code = 04 | id = 4
             * $arrParam['process_type'] = 'last_approve'
             *==================================================*/
            if(isset($arrParam['process_type']) && $arrParam['process_type'] == 'last_approve'){
                \DB::update('t_approval_status')->set(['m_approval_status_id' => 1,
                                                        'updated_date' => date('Y-m-d H:i:s'),
                                                        'updated_user_id' => $user_info['id']]) //approval status code = 00 | id = 1 - turn to approve form
                                                ->where('petition_id', '=', $arrParam['petition_id'])
                                                ->and_where('petition_type', '=', $arrParam['petition_type'])
                                                ->and_where('m_authority_id', '=', 4) //authority code = 04 | id = 4
                                                ->execute();
            }



            /*===================================================
             * Update Form Status - form 0.2 & 0.4
             *===================================================*/
            if(isset($arrParam['m_petition_status_id']) && !empty($arrParam['m_petition_status_id'])){
                if($arrParam['petition_type'] == 1){ //form 0.2 - menu
                    $objTP = \Model_TProposal::find($arrParam['petition_id']);
                    if($objTP && isset($arrParam['m_petition_status_id'])){
                       $objTP->set(['m_petition_status_id' => $arrParam['m_petition_status_id'],
                                    'last_approve_user_id' => $user_info['id'],
                                    'last_approve_date' => date('Y-m-d H:i:s')])->save();
                    }
                }else if($arrParam['petition_type'] == 2){ //form 0.4 - proposal
                    $objTR = \Model_TRequest::find($arrParam['petition_id']);
                    if($objTR){
                       $objTR->set(['m_petition_status_id' => $arrParam['m_petition_status_id'],
                                    'last_approve_user_id' => $user_info['id'],
                                    'last_approve_date' => date('Y-m-d H:i:s')])->save();
                    }
                }
            }


            /*==================================================
             * Recheck If Has Form Finish => Update Status
             *==================================================*/
            $query = \DB::select('id')
                        ->from(['t_approval_status', 'SM'])
                        ->where('petition_id', '=', $arrParam['petition_id'])
                        ->and_where('petition_type', '=', $arrParam['petition_type'])
                        ->and_where('m_authority_id', '!=', 1) //authority_code != 01 - create form
                        ->and_where_open()
                        ->and_where('m_approval_status_id', 'IN', [1, 3, 4, 7]) //m_approval_status_id NOT IN ("00", "02", "03", "30")
                        ->or_where('m_approval_status_id', 'IS', \DB::expr('null'))
                        ->or_where('m_approval_status_id', '=', '')
                        ->and_where_close();

            $checkNotComplete = $query->execute()->current();

            if(empty($checkNotComplete)){
                if($arrParam['petition_type'] == 1){ //form 0.2 - menu
                    $objTP = \Model_TProposal::find($arrParam['petition_id']);
                    //Update form finish => m_petition_status_id = 7 => m_petition_status_code = 90
                    if($objTP){
                       $objTP->set(['m_petition_status_id' => 7])->save();
                    }
                }else if($arrParam['petition_type'] == 2){ //form 0.4 - proposal
                    //Update form finish => m_petition_status_id = 7 => m_petition_status_code = 90
                    $conditions = ['id' => $arrParam['petition_id'],
                                    ['obic_outeput_date', 'IS NOT', \DB::expr('null')],
                                    ['zenginkyo_outeput_date', 'IS NOT', \DB::expr('null')]
                                    ];
                    $objTR = \Model_TRequest::find('first', ['where' => $conditions]);
                    if($objTR){
                       $objTR->set(['m_petition_status_id' => 7])->save();
                    }
                }
            }
            return true;
        }else{
            return false;
        }
    }
}
