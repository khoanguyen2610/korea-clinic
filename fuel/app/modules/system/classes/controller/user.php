<?php

/**
 * PHP Class
 *
 * @author Huynh Van Tu-VISIONVN
 */


namespace System;

class Controller_User extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');

     	if (!\Auth::check()){
            if(\Input::is_ajax()){
                $url_redirect = \Uri::create('system/default/login?call_back_uri=') . \Uri::create('system/user');
                exit(\Response::forge(json_encode(array('status' => 'session_timeout', 'url_redirect' => $url_redirect))));
            }
            \Response::redirect(\Uri::create('system/default/login?call_back_uri=' . urlencode($this->_arrParam['path_uri'])));
        }

        if(!$this->get_permission() && CHECK_PERMISSION){
            \Response::redirect('system/default/response/403');
        }
    }

    public function action_index(){    	
    	$this->_arrParam['title'] = __('User management', array(), 'User management');
    	$this->_arrParam['sub_title'] = __('Display Data', array(), 'Display Data');
		$this->theme->get_template()->set('_header', \view::forge('user/_header', $this->_arrParam));
		$this->theme->get_template()->set('content', \view::forge('user/index', $this->_arrParam));
    }

    public function action_create(){
    	if(\Input::is_ajax()){
    		return \Response::forge(json_encode($this->save_item()));
    	}else{
    		$arrRole = \Model_VsvnRole::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrRole = \Vision_Common::as_array($arrRole, 'id', 'name');
            $this->_arrParam['arrRole'] = $arrRole;
    
            $arrOrganization = \Model_Organization::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrOrganization = \Vision_Common::as_array($arrOrganization, 'id', 'name');
            $this->_arrParam['arrOrganization'] = $arrOrganization;
    
            $arrGroup = \Model_VsvnGroup::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrGroup = \Vision_Common::as_array($arrGroup, 'id', 'name');
            $this->_arrParam['arrGroup'] = $arrGroup;
    		
    		$this->_arrParam['title'] = __('User management', array(), 'User management');
    		$this->_arrParam['sub_title'] = __('Create Data', array(), 'Create Data');
    		$this->theme->get_template()->set('_header', \view::forge('user/_header', $this->_arrParam));
    		$this->theme->get_template()->set('content', \view::forge('user/form', $this->_arrParam));
    	}
    }
    
    public function action_update($id){
    	if(\Input::is_ajax()){
    		return \Response::forge(json_encode($this->save_item()));
    	}else{
    		$arrRole = \Model_VsvnRole::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrRole = \Vision_Common::as_array($arrRole, 'id', 'name');
            $this->_arrParam['arrRole'] = $arrRole;
    
    		$Item = \Model_VsvnUser::find($id);
            $currentRole = \Model_VsvnUser::find('first', ['related' => 'vsvn_role', 'where' => ['id' => $id]]);
            $currentRole = \Vision_Common::as_array($currentRole->vsvn_role, 'id', 'id');
            
            $Item['role_id'] = $currentRole;

            $arrOrganization = \Model_Organization::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrOrganization = \Vision_Common::as_array($arrOrganization, 'id', 'name');
            $this->_arrParam['arrOrganization'] = $arrOrganization;

            $currentOrganization = \Model_VsvnUser::find('first', ['related' => ['user_organization'], 'where' => ['id' => $id]]);
            $currentOrganization = \Vision_Common::as_array($currentOrganization->user_organization, 'id', 'id');
            $Item['organization_id'] = $currentOrganization;
    		
    		$arrGroup = \Model_VsvnGroup::find('all', ['select' => ['id', 'name'], 'where' => ['status' => 'active'], 'order' => ['id' => 'asc']]);
            $arrGroup = \Vision_Common::as_array($arrGroup, 'id', 'name');
            $this->_arrParam['arrGroup'] = $arrGroup;

            $currentGroup = \Model_VsvnUser::find('first', ['related' => ['vsvn_group'], 'where' => ['id' => $id]]);
            $currentGroup = \Vision_Common::as_array($currentGroup->vsvn_group, 'id', 'id');
            $Item['group_id'] = $currentGroup;
    		
    		$this->_arrParam['Item'] = $Item;
    
    		$this->_arrParam['title'] = __('User management', array(), 'User management');
    		$this->_arrParam['sub_title'] = __('Update Data', array(), 'Update Data');
    		$this->theme->get_template()->set('_header', \view::forge('user/_header', $this->_arrParam));
    		$this->theme->get_template()->set('content', \view::forge('user/form', $this->_arrParam, false));
    	}
    }

    protected function save_item(){
    	$validation = \Validation::forge();
    	$validation->add_callable('MyRules');
    	\Input::post('id')?$validation->add_field('email',__('Email', array(), 'Email'),'required')->add_rule('unique', 'vsvn_user.id.email.'.\Input::post('id'))
    	:$validation->add_field('email',__('Email', array(), 'Email'),'required')->add_rule('unique', 'vsvn_user.id.email');
        $validation->add_field('group_id', __('Group', array(), 'Group'),'required');
    	$validation->add_field('organization_id', __('Organaztion', array(), 'Organaztion'),'required');
    	if($validation->run()){
    		$data = \Input::param();
    		$role_id = isset($data['role_id'])?$data['role_id']:null;
            $group_id = $data['group_id'];
    		$organization_id = $data['organization_id'];
    		if($this->_arrParam['action']=='create'){
    			$data['password'] = \Auth::hash_password($data['password']);
    		}elseif($this->_arrParam['action']=='update'){
    			if(!empty($data['password'])){
    				$data['password'] = \Auth::hash_password($data['password']);
    			}else{
    				unset($data['password']);
    			}
    		}
    		$obj = isset($data['id'])?\Model_VsvnUser::find($data['id']):\Model_VsvnUser::forge();
    		$obj->set($data);
            $obj->save();
    		$id = isset($data['id'])?$data['id']:$obj->id;
    		$currentRole = \Model_VsvnUser::find('first', ['related' => 'vsvn_role', 'where' => ['id' => $id]]);
            $currentRole = \Vision_Common::as_array($currentRole->vsvn_role, 'id', 'id');
            if(!empty($role_id)){
    			foreach ($role_id as $k => $v) {
    				if(isset($data['id'])){
    					if(!in_array($v, $currentRole)){
    						$dataRole = array('user_id' => $id,
    								            'role_id' => $v);
    						\Model_VsvnUserRole::forge()->set($dataRole)->save();
    					}
    					unset($currentRole[$v]);
    				}else{
    					$dataRole = array('user_id' => $id,
    							         'role_id' => $v);
    					\Model_VsvnUserRole::forge()->set($dataRole)->save();
    				}
    			}
    		}
            if(!empty($currentRole)){
                foreach ($currentRole as $role_id) {
                    $obj = \Model_VsvnUserRole::find([$id, $role_id]);
                    if($obj){
                        $obj->delete();
                    }
                }
            }

            /*=============================================
             * Process Organaztion
             *=============================================*/
            if(!empty($organization_id)){
                $currentOrganization = \Model_VsvnUser::find('first', ['related' => 'user_organization', 'where' => ['id' => $id]]);
                $currentOrganization = \Vision_Common::as_array($currentOrganization->user_organization, 'id', 'id');
                foreach ($organization_id as $k => $v) {
                    if(isset($data['id'])){
                        if(!in_array($v, $currentOrganization)){
                            $dataOrganization = array('user_id' => $id,
                                                        'organization_id' => $v);
                            \Model_UserOrganization::forge()->set($dataOrganization)->save();
                        }
                        unset($currentOrganization[$v]);
            
                    }else{
                        $dataOrganization = array('user_id' => $id,
                                                    'organization_id' => $v);
                        \Model_UserOrganization::forge()->set($dataOrganization)->save();
                    }
                }
                if(!empty($currentOrganization)){
                    foreach ($currentOrganization as $organization_id) {
                        $obj = \Model_UserOrganization::find([$id, $organization_id]);
                        if($obj){
                            $obj->delete();
                        }
                    }
                }
            }

            /*=============================================
             * Process Group
             *=============================================*/
    		if(!empty($group_id)){
                $currentGroup = \Model_VsvnUser::find('first', ['related' => 'vsvn_group', 'where' => ['id' => $id]]);
                $currentGroup = \Vision_Common::as_array($currentGroup->vsvn_group, 'id', 'id');
    			foreach ($group_id as $k => $v) {
    				if(isset($data['id'])){
    					if(!in_array($v, $currentGroup)){
    						$dataGroup = array('user_id' => $id,
    								            'group_id' => $v);
    						\Model_VsvnUserGroup::forge()->set($dataGroup)->save();
    					}
    					unset($currentGroup[$v]);
    		
    				}else{
    					$dataGroup = array('user_id' => $id,
    							             'group_id' => $v);
    					\Model_VsvnUserGroup::forge()->set($dataGroup)->save();
    				}
    			}
    			if(!empty($currentGroup)){
    				foreach ($currentGroup as $group_id) {
                        $obj = \Model_VsvnUserGroup::find([$id, $group_id]);
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
    
    
    public function action_load_item_data(){
    	$arrStatus = ['active' => __('Active', array(), 'Active'),
    			     'inactive' => __('Inactive', array(), 'Inactive')];
    	$result     = \Model_VsvnUser::listItem($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
    	$items      = $result['data'];
    	
    	foreach($items as $k => $v){
    		$linkEdit = \Uri::create('system/user/update/' . $v['id']);
    
            $currentRole = \Model_VsvnUser::find('first', ['related' => 'vsvn_role', 'where' => ['id' => $v['id']]]);
            $currentRole = \Vision_Common::as_array($currentRole->vsvn_role);
    		$items[$k]['fullname'] = $v['fullname'];
    		$items[$k]['username'] = $v['username'];
    		$items[$k]['email']    = $v['email'];
    		$items[$k]['role'] = '';
    		if(!empty($currentRole)){
    			foreach ($currentRole as $key => $val) {
    				$items[$k]['role'] .= '<span class="btn bg-indigo-300" title="' . $val['name'] . '">' . $val['name'] . '</span>';
    			}
    		}
            //=================== Display Organization ====================
            $items[$k]['organization'] = '';
            $currentOrganization = \Model_VsvnUser::find('first', ['related' => 'user_organization', 'where' => ['id' => $v['id']]]);
            $currentOrganization = \Vision_Common::as_array($currentOrganization->user_organization);
            if(!empty($currentOrganization)){
                foreach ($currentOrganization as $key => $val) {
                    $items[$k]['organization'] .= '<span class="btn bg-indigo-300" title="' . $val['name'] . '">' . $val['name'] . '</span>';
                }
            }

            //=================== Display Group ====================
    		$items[$k]['group'] = '';
            $currentGroup = \Model_VsvnUser::find('first', ['related' => 'vsvn_group', 'where' => ['id' => $v['id']]]);
            $currentGroup = \Vision_Common::as_array($currentGroup->vsvn_group);
    		if(!empty($currentGroup)){
    			foreach ($currentGroup as $key => $val) {
    				$items[$k]['group'] .= '<span class="btn bg-indigo-300" title="' . $val['name'] . '">' . $val['name'] . '</span>';
    			}
    		}
    		
    
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
    
	public function action_status_item(){
        $param = \Input::param();
        if(!empty($param['id'])){
            if($param['type_action'] == 'delete'){
                \Model_VsvnUser::softDelete($param['id'], array('status' => 'delete'));
                $msg = __('Record Deleted Successfully', array(), 'Record Deleted Successfully');
            }else{
                $status = ($param['status'] == 'active')?'inactive':'active';
                \Model_VsvnUser::find($param['id'])->set(['status' => $status])->save();
                $msg = __('Record Updated Successfully', array(), 'Record Updated Successfully');
            }
            return \Response::forge(json_encode(array('status' => 'success', 'msg' => $msg)));
        }else{
            return \Response::forge(json_encode(array('status' => 'error', 'msg' => __('An unexpected error occurred', array(), 'An unexpected error occurred'))));
        }
    }
}
