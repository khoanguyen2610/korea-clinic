<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Mar 17, 2014 1:39:32 PM
 */
#namespace Auth;


class Auth_Acl_ComplexAcl extends \Auth_Acl_Driver {

    protected static $_valid_roles = array();

    public static function _init() {
        static::$_valid_roles = array_keys(\Config::get('complexauth.roles'));
    }

    public function has_access($condition, Array $entity) {
        $condition = static::_parse_conditions($condition);
        $group = \Auth::group($entity[0]);
        if (!is_array($condition) || empty($group) || !is_callable(array($group, 'get_roles'))) {
            return false;
        }
       
        $module = $condition[0];
        $area   = $condition[1];
        $rights = $condition[2];
        $current_roles = [];

            
        if(!empty($entity[1])){
            foreach ($entity[1] as $value) {
                $current_roles = array_merge($current_roles, $group->get_roles($value));
            }
            $current_roles = array_unique($current_roles);
        }
       
        $current_rights = array();
        if (is_array($current_roles)) {
            $roles = \Config::get('complexauth.roles', array());
            array_key_exists('#', $roles) && array_unshift($current_roles, '#');
            foreach ($current_roles as $r_role) {
                if(!array_key_exists($r_role, $roles))
                    continue;
                if (($r_rights = $roles[$r_role]) === false) {
                    return false;
                }
                if($roles[$r_role] === true){
                    return true;
                }
                  
                if (array_key_exists($module, $r_rights)) {
                    if (array_key_exists($area, $r_rights[$module])) {
                        $current_rights = array_unique(array_merge($current_rights, $r_rights[$module][$area]));
                    }
                }
            }
        }


            
        foreach ($rights as $right) {
            if (!in_array($right, $current_rights)) {
                return false;
            }
        }

        return true;
    }
    
    public static function _parse_conditions($rights){
        if (is_array($rights)) {
            return $rights;
        }

        if (!is_string($rights) or strpos($rights, '.') === false) {
            throw new \InvalidArgumentException('Given rights where not formatted proppery. Formatting should be like area.right or area.[right, other_right]. Received: ' . $rights);
        }

        $arrCondition = explode('.', $rights);
        
        if(preg_match('#^module_(.*)#', $arrCondition[0], $matches)){
            $module = $matches[1];
            $area   = $arrCondition[1];
            $rights = $arrCondition[2];
        }else{
            $module = 'none';
            $area   = $arrCondition[0];
            $rights = $arrCondition[1];
        }
        if (substr($rights, 0, 1) == '[' and substr($rights, -1, 1) == ']') {
            $rights = preg_split('#( *)?,( *)?#', trim(substr($rights, 1, -1)));
        }
        return array($module, $area, $rights);
    }

}

/* end of file simpleacl.php */
