<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:03:35
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-05 14:14:06
 */
class Model_TMailCooperation extends \Orm\Model {
	protected static $_table_name = 't_mail_cooperation';
	protected static $_primary_key = ['id'];
    
    protected static $_observers = array(
        'Orm\\Observer_System' => array(
                'events' => array('before_insert', 'before_save'),
                'mysql_timestamp' => true,
                'overwrite' => true)
    );

    public static function softDelete($pk, $attributes, $conditions = array()) {
        $attributes = array_merge(array(
                'deleted_date' => date('Y-m-d H:i:s'),
                'deleted_user_id' => \Auth::get('id')
        ), $attributes);
        $Item = self::find($pk);
        if($Item){
            return $Item->set($attributes)->save();
        }
        return false;
    }

    /*============================================
     * List Datatable
     *============================================*/
    public static function listData($arrParam = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $enable_date = isset($arrParam['enable_date']) && !empty($arrParam['enable_date'])?$arrParam['enable_date']:date('Y-m-d');

//             {'data':'staff_no'},
// {'data':'fullname'},
// {'data':'company_name'},
// {'data':'bisiness_division_name','class':'text-center'},
// {'data':'division_name','class':'text-center'},
// {'data':'department_name','class':'text-center'},
// {'data':'post_name','class':'text-center'},
// {'data':'menu_name'},
// {'data':'approval_status_name'},
// {'data':'to_mail_address'},
// {'bSortable':false,'data':'btn_edit','class':'text-center'},
// {'bSortable':false,'data':'btn_delete','class':'text-center'},


            $columns = [
                            ['db' => 'MU.staff_no', 'dt' => 0],
                            ['db' => 'MU.fullname', 'dt' => 1],
                            ['db' => 'MC.name', 'dt' => 2],
                            ['db' => 'BUS.name', 'dt' => 3],
                            ['db' => 'DIV.name', 'dt' => 4],
                            ['db' => 'DEP.name', 'dt' => 5],
                            ['db' => 'MP.name', 'dt' => 6],
                            ['db' => 'SM.m_menu_id', 'dt' => 7],
                            ['db' => 'MAS.name', 'dt' => 8],
                            ['db' => 'SM.to_email', 'dt' => 9]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*',
                        'MU.staff_no', 'MU.fullname', \DB::expr('MC.name AS company_name'), \DB::expr('BUS.name AS business_name'), 
                        \DB::expr('DIV.name AS division_name'), \DB::expr('DEP.name AS department_name'), 
                        \DB::expr('MP.name AS position_name'), \DB::expr('MAS.name AS approval_status_name'), 
                        \DB::expr('MM.name AS menu_name'), \DB::expr('MRM.name AS menu_request_name')];
            $query = DB::select_array($colums)
                        ->from([static::$_table_name, 'SM'])
                        ->where('SM.item_status', '!=', 'delete')
                        ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.m_user_id')->on('MUD.concurrent_post_flag', '=', \DB::expr('0'))
                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                        ->join(['m_company', 'MC'], 'left')->on('MC.id', '=', 'BUS.m_company_id')
                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                        ->join(['m_approval_status', 'MAS'], 'left')->on('MAS.id', '=', 'SM.m_approval_status_id')
                        ->join(['m_menu', 'MM'], 'left')->on('MM.id', '=', 'SM.m_menu_id')->on('SM.petition_type', '=', \DB::expr('1'))
                        ->join(['m_request_menu', 'MRM'], 'left')->on('MRM.id', '=', 'SM.m_menu_id')->on('SM.petition_type', '=', \DB::expr('2'))
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('MUD.item_status', '=', 'active')
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        ->group_by('SM.id');

            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['release_flg']) && $arrParam['release_flg'] != null && $arrParam['release_flg'] != 'none' ){
                $query->and_where('SM.release_flg', '=', $arrParam['release_flg']);
            }
            
            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }

}
