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
    
class Controller_Group extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');

        if (!\Auth::check()){
            if(\Input::is_ajax()){
                $url_redirect = \Uri::create('system/default/login?call_back_uri=') . \Uri::create('system/group');
                exit(\Response::forge(json_encode(array('status' => 'session_timeout', 'url_redirect' => $url_redirect))));
            }
            \Response::redirect(\Uri::create('system/default/login?call_back_uri=' . urlencode($this->_arrParam['path_uri'])));
        }

        if(!$this->get_permission() && CHECK_PERMISSION){
            \Response::redirect('system/default/response/403');
        }
    }

    public function action_index(){
        
        $this->_arrParam['title'] = __('Group management', array(), 'Group management');
        $this->_arrParam['sub_title'] = __('Display Data', array(), 'Display Data');
        $this->theme->get_template()->set('_header', \view::forge('group/_header', $this->_arrParam));
        $this->theme->get_template()->set('content', \view::forge('group/index', $this->_arrParam));
    }

    public function action_create(){
        if(\Input::is_ajax()){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $arrRole = \Model_VsvnRole::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrRole = \Vision_Common::as_array($arrRole, 'id', 'name');
            $this->_arrParam['arrRole'] = $arrRole;

            $this->_arrParam['title'] = __('Group management', array(), 'Group management');
            $this->_arrParam['sub_title'] = __('Create Data', array(), 'Create Data');
            $this->theme->get_template()->set('_header', \view::forge('group/_header', $this->_arrParam));
            $this->theme->get_template()->set('content', \view::forge('group/form', $this->_arrParam, false));
        }
    }

    public function action_update($id){
        if(\Input::is_ajax()){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $arrRole = \Model_VsvnRole::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrRole = \Vision_Common::as_array($arrRole, 'id', 'name');
            $this->_arrParam['arrRole'] = $arrRole;

            $Item = \Model_VsvnGroup::find($id);
            $currentRole = \Model_VsvnGroup::find('first', ['related' => 'vsvn_role', 'select' => ['name'], 'where' => ['id' => $id]]);
            $currentRole = \Vision_Common::as_array($currentRole->vsvn_role, 'id', 'id');
            
            $Item['role_id'] = $currentRole;
            $this->_arrParam['Item'] = $Item;

            $this->_arrParam['title'] = __('Group management', array(), 'Group management');
            $this->_arrParam['sub_title'] = __('Update Data', array(), 'Update Data');
            $this->theme->get_template()->set('_header', \view::forge('group/_header', $this->_arrParam));
            $this->theme->get_template()->set('content', \view::forge('group/form', $this->_arrParam, false));
        }
    }


    protected function save_item(){
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        \Input::post('id')?$validation->add_field('name',__('Name', array(), 'Name'),'required')->add_rule('unique', 'vsvn_group.id.name.'.\Input::post('id'))
                            :$validation->add_field('name',__('Name', array(), 'Name'),'required')->add_rule('unique', 'vsvn_group.id.name');
        $validation->add_field('role_id', __('Role', array(), 'Role'),'required');
        if($validation->run()){
            $data = \Input::param();
            $role_id = $data['role_id'];
            $obj = isset($data['id'])?\Model_VsvnGroup::find($data['id']):\Model_VsvnGroup::forge();
            $obj->set($data);
            $obj->save();
            $id = isset($data['id'])?$data['id']:$obj->id;
            if(!empty($role_id)){
                $currentRole = \Model_VsvnGroup::find('first', ['related' => 'vsvn_role', 'where' => ['id' => $id]]);
                $currentRole = \Vision_Common::as_array($currentRole->vsvn_role, 'id', 'id');
                
                foreach ($role_id as $k => $v) {
                    if(isset($data['id'])){
                        if(!in_array($v, $currentRole)){
                            $dataRole = array('group_id' => $id,
                                                'role_id' => $v);
                            \Model_VsvnGroupRole::forge()->set($dataRole)->save();
                        }
                        unset($currentRole[$v]);
                       
                    }else{
                        $dataRole = array('group_id' => $id,
                                        'role_id' => $v);
                        \Model_VsvnGroupRole::forge()->set($dataRole)->save();
                    }
                }

                if(!empty($currentRole)){
                    foreach ($currentRole as $role_id) {
                        $obj = \Model_VsvnGroupRole::find([$id, $role_id]);
                        if($obj){
                            $obj->delete();
                        }
                    }
                }
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
                \Model_VsvnGroup::softDelete($param['id'], array('status' => 'delete'));
                $msg = __('Record Deleted Successfully', array(), 'Record Deleted Successfully');
            }else{
                $status = ($param['status'] == 'active')?'inactive':'active';
                \Model_VsvnGroup::find($param['id'])->set(['status' => $status])->save();
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
        $result     = \Model_VsvnGroup::listItem($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            $linkEdit = \Uri::create('system/group/update/' . $v['id']);
            $currentRole = \Model_VsvnGroup::find('first', ['related' => 'vsvn_role', 'select' => ['name'], 'where' => ['id' => $v['id']]]);
            $items[$k]['role'] = ''; 
            if(!empty($currentRole->vsvn_role)){
                foreach ($currentRole->vsvn_role as $key => $val) {
                    $items[$k]['role'] .= '<span class="btn bg-indigo-300" title="' . $val['name'] . '">' . $val['name'] . '</span>';
                }
            }
            $items[$k]['member'] = \Model_VsvnUserGroup::count(['where' => ['group_id' => $v['id']]]);  
            $lblStatus = @$arrStatus[$items[$k]['status']];                        
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
