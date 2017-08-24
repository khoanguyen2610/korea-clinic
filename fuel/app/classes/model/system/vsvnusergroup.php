<?php

class Model_System_VsvnUserGroup extends Orm\Model {
    protected static $_table_name = 'vsvn_user_group';
    protected static $_primary_key = ['m_user_id', 'group_id'];


    public static function list_permission($arrParam = null, $option = null){
    	$result = [];
    	/*=============================================
         * Check group of user
         *=============================================*/
        $groups = \Model_System_VsvnUserGroup::find('all', ['where' => ['m_user_id' => $arrParam['m_user_id']]]);
        $result['permission_super'] = false;
        $result['permission_hr'] = false;
        $result['permission_general'] = false;
        $result['permission_keiri'] = false;
        $result['permission_system'] = false;
        $result['permission_user'] = false;
        $result['permission_export_obic'] = false;
        $result['permission_export_fb'] = false;
        if(!empty($groups)) {
            foreach ($groups as $key => $value) {
                switch ($value->group_id) {
                    case 1:
                        //================== Group Super ==================
                        $result['permission_super'] = true;
                        break;
                    case 2:
                        //================== Group HR ==================
                        $result['permission_hr'] = true;
                        break;
                    case 3:
                        //================== Group General ==================
                        $result['permission_general'] = true;
                        break;
                    case 4:
                        //================== Group Keiri ==================
                        $result['permission_keiri'] = true;
                        break;
                    case 5:
                        //================== Group System ==================
                        $result['permission_system'] = true;
                        break;
                    case 7:
                        //================== Allow Export Obic ==================
                        $result['permission_export_obic'] = true;
                        break;
                    case 8:
                        //================== Allow Export FB ==================
                        $result['permission_export_fb'] = true;
                        break;
                    case 6:
                    default:
                        //================== Group User ==================
                        $result['permission_user'] = true;
                        break; 
                }
            }
        }else{
            $result['permission_user'] = true;
        }

        // $result['permission_super'] = true;
        // $result['permission_hr'] = true;
        // $result['permission_general'] = true;
        // $result['permission_keiri'] = true;
        // $result['permission_system'] = true;
        // $result['permission_user'] = true;
        return $result;
    }

}