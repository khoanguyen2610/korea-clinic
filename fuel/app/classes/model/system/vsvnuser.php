<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:57:05
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-06-26 11:28:27
 */
class Model_System_VsvnUser extends \Orm\Model {
	protected static $_table_name = 'vsvn_user';
	protected static $_primary_key = ['id'];

    protected static $_observers = array(
        'Orm\\Observer_System' => array(
                'events' => array('before_insert', 'before_save'),
                'mysql_timestamp' => true,
                'overwrite' => true)
    );

    public static function softDelete($pk, $attributes, $conditions = array()) {
        $attributes = array_merge(array(
			'deleted_at' => date('Y-m-d H:i:s'),
			'deleted_id' => \Auth::get('id')
        ), $attributes);
        $Item = self::find($pk);
        if($Item){
            return $Item->set($attributes)->save();
        }
        return false;
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
                    ->where('SM.id', '=', $arrParam['m_user_id'])
                    ->and_where('SM.item_status', 'active');

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
