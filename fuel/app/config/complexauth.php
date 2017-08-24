<?php
/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Mar 17, 2014 1:39:32 PM
 */

/*=================================================
 * Get Group Role
 *=================================================*/
$group = \Model_System_VsvnGroup::find('all', ['related' => 'vsvn_role', 'where' => ['item_status'=>'active']]);
$arrGroups = [];
if(!empty($group)){
    foreach ($group as $k => $v) {
        $role_id = [];
        if(!empty($v['vsvn_role'])){
            foreach ($v['vsvn_role'] as $key => $value) {
               $role_id[$value['id']] = $value['id'];
            }
        }
        $arrGroups[$v['id']] = array(
                            'name' => $v['name'],
                            'roles' => !empty($role_id)?$role_id:[]
                            );
    }
}

/*=================================================
 * Get Role
 *=================================================*/
$role = \Model_System_VsvnRole::find('all', ['where' => ['item_status'=>'active']]);

$arrRole = [];
if(!empty($role)){
    foreach ($role as $k => $v) { 
        $role = json_decode($v['content'], true);
        $arrRole[$v['id']] = !empty($role)?$role:[];
    }
}

/*=================================================
 * Configuration Auth Parameters
 *=================================================*/
return array(
    'db_connection'         => null,
    'table_name'            => 'm_user',
    'table_columns'         => array(\DB::expr('m_user.id AS id'), 'm_user.*'),
    'table_group_name'      => 'vsvn_group',
    'table_group_columns'   => array('m_user.*'),
    'guest_login'           => true,
    'groups'                => $arrGroups,
    'roles'                 => $arrRole,
    'login_hash_salt'       => '',
    'username_post_key'     => 'user_id',
    'password_post_key'     => 'password',
    'group_id'              => '',
    'remember_me'           => array(
                                'enabled' => true,
                                'cookie_name' => 'rmcookie',
                                'expiration' => 86400*31
                            )
);
