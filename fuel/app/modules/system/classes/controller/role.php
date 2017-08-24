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
    
class Controller_Role extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');

        if (!\Auth::check()){
            if(\Input::is_ajax()){
                $url_redirect = \Uri::create('system/default/login?call_back_uri=') . \Uri::create('system/role');
                exit(\Response::forge(json_encode(array('status' => 'session_timeout', 'url_redirect' => $url_redirect))));
            }
            \Response::redirect(\Uri::create('system/default/login?call_back_uri=' . urlencode($this->_arrParam['path_uri'])));
        }

        if(!$this->get_permission() && CHECK_PERMISSION){
            \Response::redirect('system/default/response/403');
        }
    }

    public function action_index(){
        $this->_arrParam['title'] = __('Role management', array(), 'Role management');
        $this->_arrParam['sub_title'] = __('Display Data', array(), 'Display Data');
		$this->theme->get_template()->set('_header', \view::forge('role/_header', $this->_arrParam));
		$this->theme->get_template()->set('content', \view::forge('role/index', $this->_arrParam));
    }

    public function action_create(){
        if(\Input::is_ajax()){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $this->_arrParam['checkbox'] = \Model_VsvnListMca::getRecursive();

            $this->_arrParam['title'] = __('Role management', array(), 'Role management');
            $this->_arrParam['sub_title'] = __('Create Data', array(), 'Create Data');
    		$this->theme->get_template()->set('_header', \view::forge('role/_header', $this->_arrParam));
    		$this->theme->get_template()->set('content', \view::forge('role/form', $this->_arrParam, false));
        }
    }

    public function action_update($id){
        if(\Input::is_ajax()){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $Item = \Model_VsvnRole::find($id);
            $content = json_decode($Item['content'], true);
            $this->_arrParam['checkbox'] = \Model_VsvnListMca::getRecursiveChecked($content);
            $this->_arrParam['Item'] = $Item;

            $this->_arrParam['title'] = __('Role management', array(), 'Role management');
            $this->_arrParam['sub_title'] = __('Update Data', array(), 'Update Data');
            $this->theme->get_template()->set('_header', \view::forge('role/_header', $this->_arrParam));
            $this->theme->get_template()->set('content', \view::forge('role/form', $this->_arrParam, false));
        }
    }


    protected function save_item(){
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        \Input::post('id')?$validation->add_field('name',__('Name', array(), 'Name'),'required')->add_rule('unique', 'vsvn_role.id.name.'.\Input::post('id'))
                            :$validation->add_field('name',__('Name', array(), 'Name'),'required')->add_rule('unique', 'vsvn_role.id.name');
        $validation->add_field('rid', __('Role', array(), 'Role'),'required');
        if($validation->run()){
            $data = \Input::param();
            $rid = $data['rid'];
            $modules = \Model_VsvnListMca::find('all', ['where'=> [['id', 'IN', $rid], 'type' => 'module']]);
            $modules = \Vision_Common::as_array($modules);
            foreach($modules as $module){
                $controllers = \Model_VsvnListMca::find('all', ['where' => [['id', 'IN', $rid], 'type'=>'controller', 'parent' => $module['id']]]);
                $controllers = \Vision_Common::as_array($controllers);
                foreach($controllers as $controller){
                    $actions = \Model_VsvnListMca::find('all', ['where' => [['id', 'IN', $rid], 'type'=>'action', 'parent' => $controller['id']]]);
                    $actions = \Vision_Common::as_array($actions);
                    $array[$module['name']][$controller['name']] = \Arr::pluck($actions,'name');
                }
            }
            unset($data['rid']);
            $data['content'] = json_encode($array);
            $obj = isset($data['id'])?\Model_VsvnRole::find($data['id']):\Model_VsvnRole::forge();
            $obj->set($data);
            $obj->save();

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
                \Model_VsvnRole::softDelete($param['id'], array('status' => 'delete'));
                $msg = __('Record Deleted Successfully', array(), 'Record Deleted Successfully');
            }else{
                $status = ($param['status'] == 'active')?'inactive':'active';
                \Model_VsvnRole::find($param['id'])->set(['status' => $status])->save();
                $msg = __('Record Updated Successfully', array(), 'Record Updated Successfully');
            }
            return \Response::forge(json_encode(array('status' => 'success', 'msg' => $msg)));
        }else{
            return \Response::forge(json_encode(array('status' => 'error', 'msg' => __('An unexpected error occurred', array(), 'An unexpected error occurred'))));
        }
    }

    public function action_load_item_data(){
        $arrStatus = ['active' => __('Active', array(), 'Active'),
                    'inactive' => __('Inactive', array(), 'Inactive')];
        $result     = \Model_VsvnRole::listItem($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            $linkEdit = \Uri::create('system/role/update/' . $v['id']);

            $lblStatus          = $arrStatus[$items[$k]['status']];                        
            $clssStatus = ($items[$k]['status'] == 'active')?'label label-success':'label label-default';                        
            $items[$k]['status'] = '<a href="#" id="tbl-status-btn" data-status="' . $items[$k]['status'] . '" class="'.$clssStatus.'">' . $lblStatus . '</a>';
                                    
            $items[$k]['control'] = '<ul class="icons-list">
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu9"></i></a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="' . $linkEdit . '"><i class="icon-pencil7"></i> ' . __('Update', array(), 'Update') . '</a></li>
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
