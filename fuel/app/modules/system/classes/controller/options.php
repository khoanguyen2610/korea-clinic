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
    
class Controller_Options extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');

        if (!\Auth::check()){
            if(\Input::is_ajax()){
                $url_redirect = \Uri::create('system/default/login?call_back_uri=') . \Uri::create('system/options');
                exit(\Response::forge(json_encode(array('status' => 'session_timeout', 'url_redirect' => $url_redirect))));
            }
            \Response::redirect(\Uri::create('system/default/login?call_back_uri=' . urlencode($this->_arrParam['path_uri'])));
        }

        if(!$this->get_permission() && CHECK_PERMISSION){
            \Response::redirect('system/default/response/403');
        }
    }

    public function action_index(){
        $this->_arrParam['title'] = __('Options management', array(), 'Options management');
        $this->_arrParam['sub_title'] = __('Display Data', array(), 'Display Data');
        $this->theme->get_template()->set('_header', \view::forge('options/_header', $this->_arrParam));
        $this->theme->get_template()->set('content', \view::forge('options/index', $this->_arrParam));
    }

    public function action_form(){
        $this->no_layout();
        $data = \Input::param();
        
        if(isset($data['form_type']) && $data['form_type'] == 'submit_form'){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $this->_arrParam['sub_title'] = __('Create Data', array(), 'Create Data');
            if(isset($data['id'])){
                $Item = \Model_VsvnOptions::find($data['id']);
                $this->_arrParam['Item'] = $Item;
                $this->_arrParam['sub_title'] = __('Update Data', array(), 'Update Data');
            }
            $this->theme->get_template()->set('content', \view::forge('options/form', $this->_arrParam, false));
       }
    }


    protected function save_item(){
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        \Input::post('id')?$validation->add_field('name',__('Option Name', array(), 'Option Name'),'required')->add_rule('unique', 'vsvn_options.id.name.'.\Input::post('id'))
                            :$validation->add_field('name',__('Option Name', array(), 'Option Name'),'required')->add_rule('unique', 'vsvn_options.id.name');
        if($validation->run()){
            $data = \Input::param();
            if(isset($data['id'])){
                $this->_arrParam['action'] = 'update';
                \Model_VsvnOptions::find($data['id'])->set($data)->save();
            }else{
                $this->_arrParam['action'] = 'create';
                \Model_VsvnOptions::forge()->set($data)->save();
            }

            /*====================================================
             * Response result
             *====================================================*/
            switch ($this->_arrParam['action']) {
                case 'create':
                    $msg = __('Record Created Successfully', array(), 'Record Created Successfully');
                    break;
                case 'update':
                    $msg = __('Record Updated Successfully', array(), 'Record Updated Successfully');
                    break;
            }
            return array('status'=>'success','msg'=> $msg);
        }
        return array('status'=>'error','msg'=>$validation->error_message()); 
    }

    public function action_status_item(){
        $param = \Input::param();
        if(!empty($param['id'])){
            if($param['type_action'] == 'delete'){
                \Model_VsvnOptions::find($param['id'])->delete();
                $msg = __('Record Deleted Successfully', array(), 'Record Deleted Successfully');
            }
            return \Response::forge(json_encode(array('status' => 'success', 'msg' => $msg)));
        }else{
            return \Response::forge(json_encode(array('status' => 'error', 'msg' => __('An unexpected error occurred', array(), 'An unexpected error occurred'))));
        }
    }

    public function action_load_item_data(){
        
        $result     = \Model_VsvnOptions::listItem($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
                                    
            
            $items[$k]['name'] = $v['name'];
            $items[$k]['value'] = $v['value'];
                     
            $items[$k]['control'] = '<ul class="icons-list">
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu9"></i></a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="#modal_form_horizontal" data-toggle="modal" class="ajax-modal"><i class="icon-pencil7"></i> ' . __('Update', array(), 'Update') . '</a></li>
                                                <li><a href="#" id="tbl-delete-btn"><i class="icon-trash"></i> ' . __('Delete', array(), 'Delete') . '</a></li>
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
