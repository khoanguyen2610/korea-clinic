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
     * Function generate breadcrumb data
     * Method GET
     *=============================================================*/
    public function get_breadcrumb(){
        $param          = \Input::param();
        $route_url      = isset($param['route_url'])?$param['route_url']:null;
        $route_param    = isset($param['route_param'])?json_decode($param['route_param']):null;
        $route_query_param = isset($param['route_query_param'])?json_decode($param['route_query_param']):null;
        
        // echo '<pre>';
        // print_r($param);
        // echo '</pre>';
        // echo '<pre>';
        // print_r($route_param);
        // echo '</pre>';
        // echo '<pre>';
        // print_r($route_query_param);
        // echo '</pre>';

        switch (true) {
            //System Menu Master
            case preg_match('#^\/system\/menu\-master(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '様式管理', 'url' => '/system/menu-master']];
                break;
            case preg_match('#^\/system\/menu\-master\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '様式管理', 'url' => '/system/menu-master'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/menu\-master\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '様式管理', 'url' => '/system/menu-master'],
                        ['name' => '編集']];
                break;
            //System Menu Payment
            case preg_match('#^\/system\/menu\-payment(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算申請メニュー設定', 'url' => '/system/menu-payment']];
                break;
            case preg_match('#^\/system\/menu\-payment\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算申請メニュー設定', 'url' => '/system/menu-payment'],
                        ['name' => '編集']];
            //System Log History
            case preg_match('#^\/system\/log\-history(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'アクセス履歴一覧画面', 'url' => '/system/log-history']];
                break;
            //System Log History
            case preg_match('#^\/system\/log\-history(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'アクセス履歴一覧画面', 'url' => '/system/log-history']];
                break;
            //System Notify
            case preg_match('#^\/system\/notify(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '通知一覧', 'url' => '/system/notify']];
                break;
            case preg_match('#^\/system\/notify\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '通知一覧', 'url' => '/system/notify'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/notify\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '通知一覧', 'url' => '/system/notify'],
                        ['name' => '編集']];
                break;          
            //System User
            case preg_match('#^\/system\/user(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'ユーザー管理', 'url' => '/system/user']];
                break;
            case preg_match('#^\/system\/user\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'ユーザー管理', 'url' => '/system/user'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/user\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'ユーザー管理', 'url' => '/system/user'],
                        ['name' => '編集']];
                break;
            //System Department
            case preg_match('#^\/system\/department(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '部門管理', 'url' => '/system/department']];
                break;
            case preg_match('#^\/system\/department\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '部門管理', 'url' => '/system/department'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/department\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '部門管理', 'url' => '/system/department'],
                        ['name' => '編集']];
                break;
            //System Obic Client
            case preg_match('#^\/system\/obic-client(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'OBICクライアント一覧画面', 'url' => '/system/obic-client']];
                break;
            case preg_match('#^\/system\/obic-client\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'OBICクライアント一覧画面', 'url' => '/system/obic-client'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/obic-client\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'OBICクライアント一覧画面', 'url' => '/system/obic-client'],
                        ['name' => '編集']];
                break;
            //System Approval Department
            case preg_match('#^\/system\/approval\-department(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '決裁経路管理（組織）', 'url' => '/system/approval-department']];
                break;
            //System Approval menu
            case preg_match('#^\/system\/approval\-menu(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '決裁経路管理（標準）', 'url' => '/system/approval-menu']];
                break;
            //System Approval Department Menu
            case preg_match('#^\/system\/approval\-department\-menu(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '決裁経路管理（カスタム）', 'url' => '/system/approval-department-menu']];
                break;
            //System Check Routes
            case preg_match('#^\/system\/check\-routes(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '決裁経路確認', 'url' => '/system/check-routes']];
                break;
            //System Company
            case preg_match('#^\/system\/company(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '会社管理', 'url' => '/system/company']];
                break;
            case preg_match('#^\/system\/company\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '会社管理', 'url' => '/system/company'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/company\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '会社管理', 'url' => '/system/company'],
                        ['name' => '編集']];
                break;
            //System bank
            case preg_match('#^\/system\/bank(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '銀行情報', 'url' => '/system/bank']];
                break;
            case preg_match('#^\/system\/bank\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '銀行情報', 'url' => '/system/bank'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/bank\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '銀行情報', 'url' => '/system/bank'],
                        ['name' => '編集']];
                break;
            //System bank branch
            case preg_match('#^\/system\/bank\-branch(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '銀行支店情報', 'url' => '/system/bank-branch']];
                break;
            case preg_match('#^\/system\/bank\-branch\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '銀行支店情報', 'url' => '/system/bank-branch'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/bank\-branch\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '銀行支店情報', 'url' => '/system/bank-branch'],
                        ['name' => '編集']];
                break;
            //System list-form-payment
            case preg_match('#^\/system\/list\-form\-payment(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算申請処理', 'url' => '/system/list-form-payment']];
                break;
            //System trip benefits
            case preg_match('#^\/system\/trip\-benefits(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '出張関連設定一覧', 'url' => '/system/trip-benefits']];
                break;
            case preg_match('#^\/system\/trip\-area\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '出張関連設定一覧', 'url' => '/system/trip-benefits'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/trip\-area\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '出張関連設定一覧', 'url' => '/system/trip-benefits'],
                        ['name' => '編集']];
                break;
            case preg_match('#^\/system\/trip\-perdiem\-allowance\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '出張関連設定一覧', 'url' => '/system/trip-benefits'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/trip\-perdiem\-allowance\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '出張関連設定一覧', 'url' => '/system/trip-benefits'],
                        ['name' => '編集']];
                break;
            //System expense
            case preg_match('#^\/system\/expense(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算項目一覧', 'url' => '/system/expense']];
                break;
            case preg_match('#^\/system\/expense\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算項目一覧', 'url' => '/system/expense'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/expense\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算項目一覧', 'url' => '/system/expense'],
                        ['name' => '編集']];
                break;
            //System type finalization
            case preg_match('#^\/system\/type\-finalization(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '経路各種設定', 'url' => '/system/type-finalization']];
                break;  
            //System type finalization
            case preg_match('#^\/system\/type\-finalization(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '経路各種設定', 'url' => '/system/type-finalization']];
                break;    
            //System credit account
            case preg_match('#^\/system\/credit\-account(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '貸方勘定項目設定', 'url' => '/system/credit-account']];
                break;
            case preg_match('#^\/system\/credit\-account\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '貸方勘定項目設定', 'url' => '/system/credit-account'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/credit\-account\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '貸方勘定項目設定', 'url' => '/system/credit-account'],
                        ['name' => '編集']];
                break; 
            //System mail-cooperation
            case preg_match('#^\/system\/mail\-cooperation(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'メール連携設定一覧', 'url' => '/system/mail-cooperation']];
                break;
            case preg_match('#^\/system\/mail\-cooperation\/create\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'メール連携設定一覧', 'url' => '/system/mail-cooperation'],
                        ['name' => '追加']];
                break;
            case preg_match('#^\/system\/mail\-cooperation\/update\/?#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'メール連携設定一覧', 'url' => '/system/mail-cooperation'],
                        ['name' => '編集']];
                break;  
            //System obic
            case preg_match('#^\/system\/obic(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '外部システム用データ出力', 'url' => '/system/obic']];
                break;  
            //System change user department
            case preg_match('#^\/system\/change\-user\-department(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '部署情報更新', 'url' => '/system/change-user-department']];
                break;   
            //System import user department history
            case preg_match('#^\/system\/import\-user\-department(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => 'ユーザー情報更新', 'url' => '/system/import-user-department']];
                break;       

            /*=======================================================
             * Management Area
             *=======================================================*/    
            //List form
            case preg_match('#^\/management\/list\-form(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '決裁・承認', 'url' => '/home'],
                        ['name' => '審議・決裁一覧', 'url' => '/management/list-form']];
                break;   
            //Keiri list form payment
            case preg_match('#^\/management\/list\-form\-payment(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '管理機能', 'url' => '/home'],
                        ['name' => '精算申請処理', 'url' => '/management/list-form-payment']];
                break;   

            /*=======================================================
             * Home Area
             *=======================================================*/    
            //Home check-routes
            case preg_match('#^\/check\-routes(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '起案・申請', 'url' => '/home'],
                        ['name' => '決裁経路確認', 'url' => '/check-routes']];
                break;
            //Home list-form
            case preg_match('#^\/list\-form(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '起案・申請', 'url' => '/home'],
                        ['name' => '一覧照会', 'url' => '/list-form']];
                break; 
            //Home notify-history
            case preg_match('#^\/notify\-history(\/?|(\?.*)?)$#imsU', $route_url):
                $data = [['name' => '起案・申請', 'url' => '/home'],
                        ['name' => '通知閲覧', 'url' => '/notify-history']];
                break;  

            /*=======================================================
             * Form Process Area - proposal
             * proposal/form/:method/:id
             *
             *=======================================================*/    
            //Form create - update - copy
            case preg_match('#^\/proposal\/form\/#imsU', $route_url):
                
                $data = [['name' => '起案・申請', 'url' => '/home']];
                if(isset($route_param->id)){
                    
                    if(isset($route_param->method) && $route_param->method == 'create'){
                        $mmenu = \Model_MMenu::find($route_param->id);
                        $menu_name = $mmenu->name;
                    }else{
                        $item_detail = \Model_TProposal::get_detail(['id' => $route_param->id]);
                        $menu_name = $item_detail['menu_name'];
                    }
                    !empty($menu_name) && $data[] = ['name' => $menu_name, 'url' => $route_url];
                }
                        
                break;  
            //Form set-routes
            case preg_match('#^\/proposal\/set\-routes\/#imsU', $route_url):
                
                $data = [['name' => '起案・申請', 'url' => '/home']];
                if(isset($route_param->id)){
                    $item_detail = \Model_TProposal::get_detail(['id' => $route_param->id]);
                    $menu_name = $item_detail['menu_name'];
                    !empty($menu_name) && $data[] = ['name' => $menu_name, 'url' => '/proposal/form/update/' . $item_detail['id']];
                }
                $data[] = ['name' => '決裁経路編集'];
                        
                break;

            //Form detail     
            case preg_match('#^\/proposal\/detail#imsU', $route_url):
                $res_query_param = [];
                
                $data = [['name' => '起案・申請', 'url' => '/home']];
                if(isset($route_query_param->previous_page) && preg_match('#^\/management\/list-form#imsU', $route_query_param->previous_page)){
                    $res_url = explode('?', $route_query_param->previous_page);
                    isset($res_url[1]) && parse_str($res_url[1], $res_query_param);
                    $data[] = ['name' => '審議・決裁一覧', 'url' => $res_url[0], 'query_param' => $res_query_param];
                    $data[] = ['name' => '内容確認'];
                }else{

                    if(isset($route_param->id)){
                        $item_detail = \Model_TProposal::get_detail(['id' => $route_param->id]);
                        if($item_detail['m_petition_status_id'] == 1){
                            $url = '/proposal/form/update/' . $item_detail['id'];
                        }else{
                            $url = '/proposal/form/copy/' . $item_detail['id'];
                        }
                        $data[] = ['name' => $item_detail['menu_name'], 'url' => $url];
                    }
                    $data[] = ['name' => '内容確認'];
                    
                }
                break;
            
            /*=======================================================
             * Form Process Area - Payment (0.4)
             * payment/form/:method/:id
             *
             *=======================================================*/    
            //Form create - update - copy
            case preg_match('#^\/payment\/form\/#imsU', $route_url):
                
                $data = [['name' => '起案・申請', 'url' => '/home']];
                if(isset($route_param->method)){
                    
                    if(isset($route_param->method) && $route_param->method == 'create'){
                        $mmenu = \Model_MRequestMenu::find($route_param->m_request_menu_id);
                        $menu_name = $mmenu->name;
                    }else{
                        $item_detail = \Model_TRequest::get_detail(['id' => $route_param->id]);
                        $menu_name = $item_detail['request_menu_name'];
                    }
                    !empty($menu_name) && $data[] = ['name' => $menu_name, 'url' => $route_url];
                }
                        
                break;  
            //Form set-routes
            case preg_match('#^\/payment\/set\-routes\/#imsU', $route_url):
                
                $data = [['name' => '起案・申請', 'url' => '/home']];
                if(isset($route_param->id)){
                    $item_detail = \Model_TRequest::get_detail(['id' => $route_param->id]);
                    $menu_name = $item_detail['request_menu_name'];
                    !empty($menu_name) && $data[] = ['name' => $menu_name, 'url' => '/payment/form/update/' . $item_detail['id']];
                }
                $data[] = ['name' => '決裁経路編集'];
                        
                break;

            //Form detail     
            case preg_match('#^\/payment\/detail#imsU', $route_url):
                $res_query_param = [];
                
                $data = [['name' => '起案・申請', 'url' => '/home']];
                if(isset($route_query_param->previous_page) && preg_match('#^\/management\/list-form#imsU', $route_query_param->previous_page)){
                    $res_url = explode('?', $route_query_param->previous_page);
                    isset($res_url[1]) && parse_str($res_url[1], $res_query_param);
                    $data[] = ['name' => '審議・決裁一覧', 'url' => $res_url[0], 'query_param' => $res_query_param];
                    $data[] = ['name' => '内容確認'];
                }else{

                    if(isset($route_param->id)){
                        $item_detail = \Model_TRequest::get_detail(['id' => $route_param->id]);
                        if($item_detail['m_petition_status_id'] == 1){
                            $url = '/payment/form/update/' . $item_detail['id'];
                        }else{
                            $url = '/payment/form/copy/' . $item_detail['id'];
                        }
                        $data[] = ['name' => $item_detail['request_menu_name'], 'url' => $url];
                    }
                    $data[] = ['name' => '内容確認'];
                    
                }
                break;

            default: 
                $data = [];
                break;
        }
        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];
        return $this->response($response);
    }


    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Function get division (deparment level 2) & menu master of this department
     * Build data to main navigation
     * Method GET
     *=============================================================*/
    public function get_department_menu(){
        $param          = \Input::param();
        $data = [];
        
        /*=====================================
         * Get List Department
         * Department Level = 2
         *=====================================*/
        $query = \DB::select('SM.id', 'SM.name', 'SM.code', 'SM.parent')
                    ->from(['m_department', 'SM'])
                    ->join(['m_menu', 'MM'], 'left')->on('MM.m_department_id', '=', 'SM.id')
                    ->where('SM.level', '=', 2)->and_where('SM.item_status', '=', 'active')
                    ->and_where('MM.id', '<>', '')->and_where('MM.item_status', '=', 'active')->and_where('MM.enable_flg', '=', 1)
                    ->order_by('SM.order', 'ASC')
                    ->group_by('SM.id');

        $data = $query->execute()->as_array();             

        /*=====================================
         * Get List Menu Master (0.2) Based on division
         * Department Level = 2
         *=====================================*/
        if(!empty($data)){
            foreach ($data as $k => $v) {
                $query = \DB::select('SM.id', 'SM.name', 'SM.description')
                            ->from(['m_menu', 'SM'])
                            ->where('SM.item_status', '=', 'active')
                            ->and_where('SM.m_department_id', '=', $v['id'])
                            ->and_where('SM.enable_flg', '=', 1)
                            ->order_by('SM.order', 'ASC')
                            ->group_by('SM.id');
                $data[$k]['menu_master'] = $query->execute()->as_array();              
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

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get Request Menu (0.4)
     * Build data to main navigation
     * Method GET
     *=============================================================*/
    public function get_request_menu(){
        $param          = \Input::param();
        $data = [];
        
        /*=====================================
         * Get List Menu Master (0.4)
         *=====================================*/
        $query = \DB::select('SM.id', 'SM.name', 'SM.code')
                    ->from(['m_request_menu', 'SM'])
                    ->where('SM.item_status', '=', 'active')
                    ->and_where('SM.enable_flg', '=', 1)
                    ->order_by('SM.order', 'ASC')
                    ->group_by('SM.id');

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



    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get URL download form attachment
     * input: attachment_id, attachment_type(form_attachment - form_input), m_user_id
     * Method GET
     *=============================================================*/
    public function get_download_form_attachment(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/download/form_attachment?p=' . base64_encode($build_query));
        $data['url'] = $url_download;

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Get URL export form PDF 
     * input: m_user_id, petition_id, petition_type
     * Method GET
     *=============================================================*/
    public function get_export_form_pdf(){
        $param = \Input::param();
        $format = isset($param['format']) ? $param['format'] : 'user';
        $action = ($format == 'user') ? 'print_format_user' : 'print_format_keiri'; 
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/pdf/'. $action .'?p=' . base64_encode($build_query));
        $data['url'] = $url_download;

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];
        return $this->response($response);
    }

    /*=============================================================
     * Author: Hoang Phong Phu
     * Get URL export form 0.2 & 0.4
     * Method GET
     *=============================================================*/
    public function get_export_form_process(){
        $param = \Input::param();
        $build_query = http_build_query($param);
        $url_download = \Uri::create('/client/export/list_form_process?p=' . base64_encode($build_query));
        $data['url'] = $url_download;

        /*==================================================
         * Response Data
         *==================================================*/
        $response = ['status' => 'success',
                    'code' => Exception::E_ACCEPTED,
                    'message' => Exception::getMessage(Exception::E_ACCEPTED),
                    'data' => $data];
        return $this->response($response);
    }
}