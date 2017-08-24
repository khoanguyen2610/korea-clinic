<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 11:57:05
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-02 17:04:21
 */
class Model_MApprovalDepartment extends \Orm\Model {
	protected static $_table_name = 'm_approval_department';
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

    /*==============================================
     * Get Max Limit Position ID
     *==============================================*/
    public static function max_position_routes($arrParam = null) {
        $department_id = $arrParam['department_id'];
        $enable_date = $arrParam['enable_date'];
        $limit_m_position_id = $arrParam['limit_m_position_id'];

        $query = \DB::select('MP.id', 'MP.code')
                    ->from(['m_user_department', 'MUD'])
                    ->join(['m_approval_department', 'MAD'], 'left')->on('MUD.m_user_id', '=', 'MAD.m_user_id')
                    ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'MUD.m_position_id')
                    ->where('MAD.m_department_id', '=', $department_id)->where('MUD.item_status', '=', 'active')->where('MUD.concurrent_post_flag', '=', '0')
                    ->and_where_open()
                        ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MUD.enable_start_date'), \DB::expr('MUD.enable_end_date')])
                        ->or_where_open()
                            ->and_where(\DB::expr('MUD.enable_start_date'), '<=', $enable_date)
                            ->and_where(\DB::expr('MUD.enable_end_date'), 'IS', \DB::expr('NULL'))
                        ->or_where_close()
                    ->and_where_close()
                    ->and_where('MP.code', '>=', \DB::expr("(SELECT code FROM m_position WHERE id = {$limit_m_position_id})"))
                    ->and_where('MAD.item_status', '=', 'active')
                    ->and_where_open()
                        ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('MAD.enable_start_date'), \DB::expr('MAD.enable_end_date')])
                        ->or_where_open()
                            ->and_where(\DB::expr('MAD.enable_start_date'), '<=', $enable_date)
                            ->and_where(\DB::expr('MAD.enable_end_date'), 'IS', \DB::expr('NULL'))
                        ->or_where_close()
                    ->and_where_close()
                    ->order_by('MP.code', 'ASC')
                    ->limit(1);
        $result = $query->execute()->current();
        return $result;
    }

}
