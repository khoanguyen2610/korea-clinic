<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 15, 2016 22:49:51 PM
 */


namespace System;
    
class Controller_Translate extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');

        if (!\Auth::check()){
            if(\Input::is_ajax()){
                $url_redirect = \Uri::create('system/default/login?call_back_uri=') . \Uri::create('system/translate');
                exit(\Response::forge(json_encode(array('status' => 'session_timeout', 'url_redirect' => $url_redirect))));
            }
            \Response::redirect(\Uri::create('system/default/login?call_back_uri=' . urlencode($this->_arrParam['path_uri'])));
        }

        if(!$this->get_permission() && CHECK_PERMISSION){
            \Response::redirect('system/default/response/403');
        }
    }

    public function action_index(){
        
        $this->_arrParam['title'] = __('Translate management', [], 'Translate management');
        $this->_arrParam['sub_title'] = __('Display Data', [], 'Display Data');
        $this->theme->get_template()->set('_header', \view::forge('translate/_header', $this->_arrParam));
        $this->theme->get_template()->set('content', \view::forge('translate/index', $this->_arrParam));
    }

    public function action_form(){
        $this->no_layout();
        $data = \Input::param();
        
        if(isset($data['form_type']) && $data['form_type'] == 'submit_form'){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $this->_arrParam['sub_title'] = __('Create Data', [], 'Create Data');
            if(isset($data['id'])){
                $Item = \Model_VsvnTranslate::find($data['id']);
                $this->_arrParam['Item'] = $Item;
                $this->_arrParam['sub_title'] = __('Update Data', [], 'Update Data');
            }

            $arrLanguage = \Model_VsvnLanguage::find('all', ['where'=> ['status' => 'active'], 'order_by' => ['id' => 'asc']]);
            $arrLanguage = \Vision_Common::as_array($arrLanguage, 'code','name');
            $this->_arrParam['arrLanguage'] = $arrLanguage;

            
            $this->theme->get_template()->set('content', \view::forge('translate/form', $this->_arrParam, false));
       }
    }


    protected function save_item(){
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        $validation->add_field('key',__('Origin Content', [], 'Origin Content'),'required');
        $validation->add_field('value',__('Translate Content', [], 'Translate Content'),'required');
        if($validation->run()){
            $data = \Input::param();
            $searchValue = \Model_VsvnTranslate::find('first', ['where' => ['key' => $data['key'], 'language_code' => $data['language_code'], 'status' => 'active']]);
            if(!empty($searchValue) && !isset($data['id'])){
                return array('status'=>'error','msg'=> array('key' => __('This key has been existed in database.', [], 'This key has been existed in database.')));
            }else{
                if(\Input::post('id')){
                    $this->_arrParam['action'] = 'update';
                    \Model_VsvnTranslate::find(\Input::post('id'))->set($data)->save();
                }else{
                    $this->_arrParam['action'] = 'create';
                    \Model_VsvnTranslate::forge()->set($data)->save();
                }
                /*====================================================
                 * Response result
                 *====================================================*/
                switch ($this->_arrParam['action']) {
                    case 'create':
                        $msg = __('Record Created Successfully', [], 'Record Created Successfully');
                        break;
                    case 'update':
                        $msg = __('Record Updated Successfully', [], 'Record Updated Successfully');
                        break;
                }
                return array('status'=>'success','msg'=> $msg);
            }
        }
        return array('status'=>'error','msg'=>$validation->error_message()); 
    }

    public function action_status_item(){
        $param = \Input::param();
        if(!empty($param['id'])){
            if($param['type_action'] == 'delete'){
                \Model_VsvnTranslate::softDelete($param['id'], array('status' => 'delete'));
                $msg = __('Record Deleted Successfully', [], 'Record Deleted Successfully');
            }else{
                $status = ($param['status'] == 'active')?'inactive':'active';
                \Model_VsvnTranslate::find($param['id'])->set(['status' => $status])->save();
                $msg = __('Record Updated Successfully', [], 'Record Updated Successfully');
            }
            return \Response::forge(json_encode(array('status' => 'success', 'msg' => $msg)));
        }else{
            return \Response::forge(json_encode(array('status' => 'error', 'msg' => __('An unexpected error occurred', [], 'An unexpected error occurred'))));
        }
    }

    public function action_load_item_data(){
        $arrStatus = ['active' => __('Active', [], 'Active'),
                    'inactive' => __('Inactive', [], 'Inactive')];
        $result     = \Model_VsvnTranslate::listItem($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            $lblStatus = @$arrStatus[$items[$k]['status']];                        
            $clssStatus = ($items[$k]['status'] == 'active')?'label label-success':'label label-default';                        
            $items[$k]['status'] = '<a href="#" id="tbl-status-btn" data-status="' . $items[$k]['status'] . '" class="'.$clssStatus.'">' . $lblStatus . '</a>';
                                    
            $items[$k]['control'] = '<ul class="icons-list">
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu9"></i></a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="#modal_form_horizontal" data-toggle="modal" class="ajax-modal"><i class="icon-pencil7"></i> ' . __('Update', [], 'Update') . '</a></li>
                                                <li><a href="#" id="tbl-delete-btn"><i class="icon-trash"></i> ' . __('Delete', [], 'Delete') . '</a></li>
                                            </ul>
                                        </li>
                                    </ul>';
        }
        $output = array(
                        "sEcho" => intval(@$this->_arrParam['sEcho']),
                        "iTotalRecords" => $result['total'],
                        "iTotalDisplayRecords" => $result['total'],
                        "aaData" => $items
                    );
        $response = \Response::forge();
        $response->body(json_encode($output));
        return $response;
    }
}
