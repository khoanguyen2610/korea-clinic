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

class Controller_System_ApprovalRoutes extends \Controller_API {
	public function before() {
        parent::before();
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function master routes
     * Table: m_approval_department, m_approval_department_menu, m_approval_menu
     * Method GET
     *=============================================================*/
    public function get_master_routes(){
        $param = \Input::param();
        $data = [];
        if(isset($param['m_menu_id']) && !empty($param['m_menu_id']) && isset($param['m_department_id']) && !empty($param['m_department_id'])){
            $current_user_info = \Auth::get();
            $m_user_id = (!isset($param['m_user_id']) || empty($param['m_user_id']))?$current_user_info['id']:$param['m_user_id'];
            $param['m_user_id'] = $m_user_id;
                

            $m_menu_id = $param['m_menu_id'];
            $m_department_id = $param['m_department_id'];
            $system_check = isset($param['system_check'])?$param['system_check']:false;
            $user_check = isset($param['user_check'])?$param['user_check']:false;
            $enable_date = isset($param['enable_date'])?date('Y-m-d', strtotime($param['enable_date'])):date('Y-m-d');
            $concurrent_post_flag = isset($param['concurrent_post_flag'])?$param['concurrent_post_flag']:0;

            $user_info = \Model_MUser::getDetailUserInfo(['m_user_id' => $m_user_id, 'enable_date' => $enable_date]);

            //Case user check routes with concurrent_post_flag, enable_date, user_check
            if($user_check){
                //check exact department when concurrent_post_flag == 1;
                $current_department_param = ($concurrent_post_flag)?['m_department_id' => $param['m_department_id']]:[];
                $mainDepartment = \Model_MUserDepartment::getCurrentDepartment($user_info['id'], $enable_date, false, $concurrent_post_flag, $current_department_param);
                //return null if not exist department
                if(empty($mainDepartment)){
                    $data = [];
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
            
            if(isset($param['enable_date']) && isset($param['user_check'])){
                $m_department_id = $mainDepartment['m_department_id'];
            }


            //Get combo data department - get business & division & department
            $arrDepartment = \Model_MDepartment::comboData(['m_department_id' => $m_department_id], ['task' => 'department']);
            //Detect type of menu
            $petition_type = 1;
            switch ($param['menu_type']) {
                case 'menu':
                    $petition_type = 1;
                    $menu_master = \Model_MMenu::find('first', ['select' => ['id', 'name', 'limit_m_position_id'], 'where' => ['id' => $m_menu_id]]);
                    break;
                case 'payment':
                    $petition_type = 2;
                    $menu_master = \Model_MRequestMenu::find('first', ['select' => ['id', 'name', 'limit_m_position_id'], 'where' => ['id' => $m_menu_id]]);
                    break;
            }
            
            $business_id = $arrDepartment['business_id'];
            $division_id = $arrDepartment['division_id'];
            $department_id = $arrDepartment['department_id'];
            $limit_m_position_id = $menu_master->limit_m_position_id;

            /*==============================================
             * Get Max Limit Position ID
             *==============================================*/
            $arrParam = ['department_id' => $department_id, 'enable_date' => $enable_date, 'limit_m_position_id' => $limit_m_position_id];
            $max_position = \Model_MApprovalDepartment::max_position_routes($arrParam);
            if(!empty($max_position)) $limit_m_position_id = $max_position['id'];


            /*==============================================
             * Get Route From Table m_approval_deparment
             *==============================================*/
            $query = \DB::select('MAD.id', 'MAD.order', 'MAD.m_user_id', 'MU.fullname', 'MAD.enable_start_date', 'MAD.enable_end_date', \DB::expr('(MAD.order + 1) AS priority_order'),
                                'MUD.m_position_id', \DB::expr('MP.code AS position_code'), \DB::expr('MP.name AS position_name'), \DB::expr('"2" AS m_authority_id'), \DB::expr('"02" AS authority_code'), \DB::expr('"審議" AS authority_name'), \DB::expr('"組織" AS segment'), \DB::expr('"organization" AS unit'),
                                \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), \DB::expr('DIV.name AS division_name'), \DB::expr('BUS.name AS business_name'))
                        ->from(['m_approval_department', 'MAD'])
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'MAD.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('"0"'))
                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                        ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'MUD.m_user_id')
                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')->on('DEP.level', '=', \DB::expr('"3"'))
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')->on('DIV.level', '=', \DB::expr('"2"'))
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr('"1"'))
                        ->where('MAD.m_department_id', '=', $department_id)->where('MAD.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MAD.enable_start_date'), \DB::expr('MAD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MAD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MAD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        ->and_where('MUD.m_position_id', 'NOT IN', [13, 1]) //except user has position in 99 98 00;
                        ->and_where('MUD.m_position_id', '<=', $limit_m_position_id) //Get user has position less than limit position
                        ->and_where('MUD.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MAD.enable_start_date'), \DB::expr('MAD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MAD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MAD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        ->and_where('MU.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where('MU.retirement_date', '>=', $enable_date)
                            ->or_where('MU.retirement_date', 'IS', \DB::expr('NULL'))
                        ->and_where_close()
                        ->group_by('MAD.id')
                        ->order_by('MAD.order', 'ASC');

            if($user_check){

            }      
            $department = $query->execute()->as_array();

            //Get last priority_order of route department
            $last = end($department);
            $next_priority_order = isset($last['priority_order'])?$last['priority_order']:0;

            /*==============================================
             * Get Route From Table m_approval_deparment_menu
             *==============================================*/
            $query = \DB::select('MADM.id', 'MADM.order', 'MADM.m_user_id', 'MADM.m_authority_id', \DB::expr('MA.name AS authority_name'), \DB::expr('MA.code AS authority_code'), 'MU.fullname', 'MADM.enable_start_date', 'MADM.enable_end_date', \DB::expr("(MADM.order + {$next_priority_order}) AS priority_order"),
                                'MUD.m_position_id', \DB::expr('MP.code AS position_code'), \DB::expr('MP.name AS position_name'), \DB::expr('"部品" AS segment'), \DB::expr('"parts" AS unit'),
                                \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), \DB::expr('DIV.name AS division_name'), \DB::expr('BUS.name AS business_name'))
                        ->from(['m_approval_department_menu', 'MADM'])
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'MADM.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('"0"'))
                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                        ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'MUD.m_user_id')
                        ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'MADM.m_authority_id')
                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')->on('DEP.level', '=', \DB::expr('"3"'))
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')->on('DIV.level', '=', \DB::expr('"2"'))
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr('"1"'))
                        ->where('MADM.m_menu_id', '=', $m_menu_id)->where('MADM.petition_type', '=', $petition_type)
                        ->and_where('MADM.item_status', '=', 'active')
                        ->and_where('MUD.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()

                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MADM.enable_start_date'), \DB::expr('MADM.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MADM.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MADM.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()

                        ->and_where('MU.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where('MU.retirement_date', '>=', $enable_date)
                            ->or_where('MU.retirement_date', 'IS', \DB::expr('NULL'))
                        ->and_where_close()
                        ->group_by('MADM.id')
                        ->order_by('MADM.order', 'ASC');

            $sub_query = clone $query;
            $sub_query->and_where('MADM.m_department_id', '=', $department_id);
            $department_menu = $sub_query->execute()->as_array();
            if(empty($department_menu)){
                $sub_query = clone $query;
                $sub_query->and_where('MADM.m_department_id', '=', $division_id);
                $department_menu = $sub_query->execute()->as_array();
                if(empty($department_menu)){
                    $sub_query = clone $query;
                    $sub_query->and_where('MADM.m_department_id', '=', $business_id);
                    $department_menu = $sub_query->execute()->as_array();
                }
            }

            if(empty($department_menu)){
                /*==============================================
                 * Get Route From Table m_approval_menu
                 *==============================================*/
                $query = \DB::select('MAM.id', 'MAM.order', 'MAM.m_user_id', 'MAM.m_authority_id', \DB::expr('MA.name AS authority_name'), \DB::expr('MA.code AS authority_code'), 'MU.fullname', 'MAM.enable_start_date', 'MAM.enable_end_date', \DB::expr("(MAM.order + {$next_priority_order}) AS priority_order"),
                                    'MUD.m_position_id', \DB::expr('MP.code AS position_code'), \DB::expr('MP.name AS position_name'), \DB::expr('"部品" AS segment'), \DB::expr('"parts" AS unit'),
                                    \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), \DB::expr('DIV.name AS division_name'), \DB::expr('BUS.name AS business_name'))
                            ->from(['m_approval_menu', 'MAM'])
                            ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'MAM.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('"0"'))
                            ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                            ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'MUD.m_user_id')
                            ->join(['m_authority', 'MA'], 'left')->on('MA.id', '=', 'MAM.m_authority_id')
                            ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')->on('DEP.level', '=', \DB::expr('"3"'))
                            ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')->on('DIV.level', '=', \DB::expr('"2"'))
                            ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr('"1"'))
                            ->where('MAM.m_menu_id', '=', $m_menu_id)->where('MAM.petition_type', '=', $petition_type)
                            ->and_where('MAM.item_status', '=', 'active')
                            ->and_where('MUD.item_status', '=', 'active')
                            ->and_where_open()
                                ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                                ->or_where_open()
                                    ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                    ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                                ->or_where_close()
                            ->and_where_close()

                            ->and_where_open()
                                ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MAM.enable_start_date'), \DB::expr('MAM.enable_end_date')])
                                ->or_where_open()
                                    ->and_where(\DB::expr('MAM.enable_start_date'), '<=', $enable_date)
                                    ->and_where(\DB::expr('MAM.enable_end_date'), 'IS', \DB::expr('NULL'))
                                ->or_where_close()
                            ->and_where_close()

                            ->and_where('MU.item_status', '=', 'active')
                            ->and_where_open()
                                ->and_where('MU.retirement_date', '>=', $enable_date)
                                ->or_where('MU.retirement_date', 'IS', \DB::expr('NULL'))
                            ->and_where_close()
                            ->group_by('MAM.id')
                            ->order_by('MAM.order', 'ASC');
                $department_menu = $query->execute()->as_array();
            }
            /*==================================================
             * Filter Data Division
             * Remove User Same Authority Code And Different Unit
             *==================================================*/
            foreach ($department as $key => $value) {
                if($user_check){
                    if(($value['department_id'] == $user_info['department_id']) && ((int)@$value['position_code'] < (int)@$user_info['position_code']) || ($value['m_user_id'] == $user_info['id'])){
                        unset($department[$key]);
                    }
                }

                // Remove user has authority 02, 03 in department routes if exist customize routes
                if(in_array($value['m_authority_id'], [2, 3]) && !empty($department_menu)){
                    foreach ($department_menu as $k => $v) {
                        if($value['department_id'] == $v['department_id'] && $value['m_user_id'] == $v['m_user_id'] && in_array($v['m_authority_id'], [2, 3])){
                            unset($department[$key]);
                            continue;
                        }
                    }
                }
            }

            
            /*==============================================
             * Merge Data
             * Merge $department & $department_menu
             *==============================================*/
            $data = array_merge($department, $department_menu);

            /*======================================
             * Creator Of Form
             *======================================*/
            if($user_check){
                $creator_info[] = ["m_user_id" => $user_info['id'],
                                  "fullname" => $user_info['fullname'],
                                  "enable_start_date" => null,
                                  "enable_end_date" =>  null,
                                  "priority_order" => 1,
                                  "m_position_id" => $mainDepartment['m_position_id'],
                                  "position_code" => $mainDepartment['position_code'],
                                  "position_name" => $mainDepartment['position_name'],
                                  "m_authority_id" => 1,
                                  "authority_code" => '01',
                                  "authority_name" => "申請・取り下げ",
                                  "segment" => "組織",
                                  "unit" => "organization",
                                  "resource_data" =>"system",
                                  "department_name" => $mainDepartment['department_name'],
                                  "division_name" => $mainDepartment['division_name'],
                                  "business_name" => $mainDepartment['business_name']
                                  ];
                $data = array_merge($data, $creator_info);                        
            }



            /*==============================================
             * Process final data
             *==============================================*/
            if(!empty($data)){
                foreach ($data as $key => $value) {
                    if($user_check){
                        if($value['m_user_id'] == $user_info['id'] && in_array($value['m_authority_id'], [2, 3]) && !$system_check){
                            unset($data[$key]);
                            continue;
                        }
                    }
                    $data[$key]['resource_data'] = 'system';
                    $authority_code[$key] = $value['authority_code'];
                    $priority_order[$key] = $value['priority_order'];
                    $unit_order[$key] = @$value['unit'];
                }

                array_multisort($authority_code, SORT_ASC, $unit_order, SORT_ASC, $priority_order, SORT_ASC, $data);
            }
        }
       
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