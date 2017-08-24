<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:57:05
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-07-20 12:02:00
 */
class Model_MUser extends \Orm\Model {
	protected static $_table_name = 'm_user';
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
            $columns = [
                            ['db' => 'SM.staff_no', 'dt' => 0],
                            ['db' => 'SM.user_id', 'dt' => 1],
                            ['db' => 'SM.fullname', 'dt' => 2],
                            ['db' => 'MUD.m_position_id', 'dt' => 3],
                            ['db' => 'MUD.m_department_id', 'dt' => 4],
                            ['db' => 'MUD.m_department_id', 'dt' => 5],
                            ['db' => 'MUD.m_department_id', 'dt' => 6],
                            ['db' => 'MUD.enable_start_date', 'dt' => 7],
                            ['db' => 'MUD.enable_end_date', 'dt' => 8],
                        ];

            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', 'MUD.m_position_id', DB::expr('MP.name AS position_name'),
                        'MUD.m_department_id', 'MUD.enable_start_date', 'MUD.enable_end_date',
                        DB::expr('DEP.name AS department_name'), DB::expr('CONCAT(DEP.sub_code, " - ", DEP.name) AS department_name_code'),
                        DB::expr('DIV.id AS division_id'), DB::expr('DIV.name AS division_name'), DB::expr('CONCAT(DIV.code, " - ", DIV.name) AS division_name_code'),
                        DB::expr('BUS.id AS business_id'), DB::expr('BUS.name AS business_name'), DB::expr('CONCAT(BUS.code, " - ", BUS.name) AS business_name_code')];

            //task get user_id
            if(isset($options['sub_task']) && $options['sub_task'] == 'filter_user_id') $colums = ['SM.id'];

            $query = DB::select_array($colums)
                        ->from([static::$_table_name, 'SM'])
                        // ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')->on('MUD.concurrent_post_flag', '=', \DB::expr('0'))
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')
                        ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                        ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('MUD.item_status', '=', 'active')
                        ->and_where('MUD.concurrent_post_flag', '=', 0);

            if(isset($arrParam['user_activation']) && $arrParam['user_activation']){
                $query->and_where_open()
                            ->and_where('SM.retirement_date', '>', $enable_date)
                            ->or_where('SM.retirement_date', 'IS',\DB::expr('NULL'))
                        ->and_where_close()
                        ->and_where_open()
                            ->and_where(\DB::expr('MUD.enable_start_date'), '<', $enable_date)
                            ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                        ->and_where_close();
            }else{
                $query->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close();
            }

            $query->group_by('SM.id');


            /*==================================================
             * Get User Without ID in except_id request
             *==================================================*/

            if(isset($arrParam['except_id']) && $arrParam['except_id'] &&
                (!isset($arrParam['has_except_authority']) || $arrParam['has_except_authority']) == 0){
                $except_ids = explode(',', $arrParam['except_id']);
                $query->and_where('SM.id', 'NOT IN', $except_ids);
            }
            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['entry_date']) && $arrParam['entry_date'] != null){
                $query->and_where('SM.entry_date', '>=', date('Y-m-d', strtotime($arrParam['entry_date'])));
            }
            if(isset($arrParam['retirement_date']) && $arrParam['retirement_date'] != null){
                $query->and_where('SM.retirement_date', '>=', date('Y-m-d', strtotime($arrParam['retirement_date'])));
            }

            if(isset($arrParam['m_company_id']) && $arrParam['m_company_id'] != null){
                $query->and_where('BUS.m_company_id', '=', $arrParam['m_company_id']);
            }

            if(isset($arrParam['business_id']) && $arrParam['business_id'] != null){
                $query->and_where('BUS.id', '=', $arrParam['business_id']);
            }

            if(isset($arrParam['division_id']) && $arrParam['division_id'] != null){
                $query->and_where('DIV.id', '=', $arrParam['division_id']);
            }

            if(isset($arrParam['department_id']) && $arrParam['department_id'] != null){
                $query->and_where('MUD.m_department_id', '=', $arrParam['department_id']);
            }

            if(isset($arrParam['m_position_id']) && $arrParam['m_position_id'] != null){
                $query->and_where('MUD.m_position_id', '=', $arrParam['m_position_id']);
            }

            if(isset($arrParam['staff_no']) && $arrParam['staff_no'] != null){
                $query->and_where('SM.staff_no', 'LIKE', '%' . $arrParam['staff_no'] . '%');
            }

            if(isset($arrParam['user_id']) && $arrParam['user_id'] != null){
                $query->and_where('SM.user_id', 'LIKE', '%' . $arrParam['user_id'] . '%');
            }

            if(isset($arrParam['fullname']) && $arrParam['fullname'] != null){
                $query->and_where('SM.fullname', 'LIKE', '%' . $arrParam['fullname'] . '%');
            }

            //task get user_id
            if(isset($options['sub_task']) && $options['sub_task'] == 'filter_user_id') return $query->execute()->as_array(null, 'id');

            // echo $query;
            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }
        return $result;
    }

    /*============================================
     * List Datatable
     *============================================*/
    public static function getUserBasedDepartment($arrParam = null, $options = null){
        if($arrParam['department_area'] == 'department'){
            $query = DB::select('SM.id')
                        ->from([static::$_table_name, 'SM'])
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')
                        ->where('SM.item_status', '=', 'active')
                        ->and_where('MUD.m_department_id', '=', $arrParam['m_department_id'])
                        ->group_by('SM.id');
            $result = $query->execute()->as_array(null, 'id');
        }
        if($arrParam['department_area'] == 'division'){
            $departments = \Model_MDepartment::comboData($arrParam, ['task' => 'department']);
            $query = DB::select('SM.id')
                        ->from([static::$_table_name, 'SM'])
                        ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')
                        ->where('SM.item_status', '=', 'active')
                        ->and_where('MUD.m_department_id', 'IN', \DB::expr("(SELECT id FROM m_department WHERE parent = {$departments['division_id']})"))
                        ->group_by('SM.id');
            $result = $query->execute()->as_array(null, 'id');
        }
        return isset($result)?$result:[];
    }

    public static function getDetailUserInfo($arrParam = null, $options = null){
        $enable_date = isset($arrParam['enable_date'])?date('Y-m-d', strtotime($arrParam['enable_date'])):date('Y-m-d');
        $concurrent_post_flag = isset($arrParam['concurrent_post_flag'])?$arrParam['concurrent_post_flag']:0;
        $select = ['SM.*', \DB::expr('MP.id AS position_id'), \DB::expr('MP.name AS position_name'), \DB::expr('MP.code AS position_code'),
                    \DB::expr('DEP.id AS department_id'), \DB::expr('DEP.name AS department_name'), \DB::expr('DEP.code AS department_code'), \DB::expr('DEP.sub_code AS department_sub_code'),
                    \DB::expr('DIV.id AS division_id'), \DB::expr('DIV.name AS division_name'), \DB::expr('DIV.code AS division_code'),
                    \DB::expr('BUS.id AS business_id'), \DB::expr('DEP.name AS business_name'), \DB::expr('BUS.code AS business_code'),
                    \DB::expr('MCU.name AS currency_name'), \DB::expr('MCU.symbol AS currency_symbol')];

        $query = \DB::select_array($select)
                    ->from([static::$_table_name, 'SM'])
                    ->join(['m_user_department', 'MUD'], 'left')->on('MUD.m_user_id', '=', 'SM.id')->on('MUD.concurrent_post_flag', '=', \DB::expr('"' . $concurrent_post_flag . '"'))
                    ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'MUD.m_department_id')
                    ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')
                    ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')
                    ->join(['m_company', 'MC'], 'left')->on('MC.id', '=', 'BUS.m_company_id')
                    ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                    ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'SM.m_currency_id')
                    ->where('SM.id', '=', $arrParam['m_user_id'])
                    ->and_where('SM.item_status', 'active')
                    ->and_where('MUD.item_status', '=', 'active')
                    ->and_where_open()
                        ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                        ->or_where_open()
                            ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                            ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                        ->or_where_close()
                    ->and_where_close()
                    ->and_where_open()
                        ->and_where('SM.retirement_date', '>=', $enable_date)
                        ->or_where('SM.retirement_date', 'IS', \DB::expr('NULL'))
                    ->and_where_close();

        if(isset($arrParam['m_department_id']) && !empty($arrParam['m_department_id'])){
            $query->and_where('MUD.m_department_id', '=', $arrParam['m_department_id']);
        }

        $result = $query->execute()->current();

        /*=============================================
         * Check group of user
         *=============================================*/
        if(!empty($result)){
            $groups = \Model_System_VsvnUserGroup::list_permission(['m_user_id' => $result['id']]);
            $result = array_merge($result, $groups);
        }

        return $result;
    }

    /*=============================================================
     * Author: Phan Ngoc Minh Luan
     * Function update info user base on the lastest updated user department
     * Method GET
     * Table m_user
     * Single data | array
     * Where condition "LIKE %$1%"
     * Response data: status[success|error], total[total_record], data[single|array]
     *=============================================================*/
    public static function updateInfoUserBaseUserDepartment($arrParam = null) {
        $enable_date = isset($arrParam['enable_date']) && !empty($arrParam['enable_date'])?$arrParam['enable_date']:date('Y-m-d');
        $query = \DB::select('MUD.m_user_id', 'MUD.staff_no', 'MUD.fullname', 'MUD.fullname_kana')
                        ->from(['m_user_department', 'MUD'])
                        ->where('MUD.concurrent_post_flag', '=', '0')
                        ->and_where_open()
                            ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                            ->or_where_open()
                                ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                                ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                            ->or_where_close()
                        ->and_where_close()
                        ->and_where('MUD.item_status', '=', 'active');
        if(isset($arrParam['arr_user_id']) && !empty($arrParam['arr_user_id'])) {
            $query->and_where('MUD.m_user_id', 'in', $arrParam['arr_user_id']);
        }
        $results = $query->execute()->as_array();

        if(!empty($results)) {
            foreach ($results as $key => $row) {

                $entry = \Model_MUser::find($row['m_user_id']);
                if($entry->staff_no != $row['staff_no'] || $entry->fullname != $row['fullname'] || $entry->fullname_kana != $row['fullname_kana']) {
                    $entry->staff_no = $row['staff_no'];
                    $entry->fullname = $row['fullname'];
                    $entry->fullname_kana = $row['fullname_kana'];
                    $entry->save();
                }

            }
        }

    }
}
