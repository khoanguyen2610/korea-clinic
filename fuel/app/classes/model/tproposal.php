<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:04:29
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-04-03 10:58:47
 */
class Model_TProposal extends \Orm\Model {
	protected static $_table_name = 't_proposal';
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

    public static function get_last_proposal_code($arrParam = null){
        $proposal_code = $arrParam['menu_code'] . date('Ymd') . '0001';
        $project_id_general = $arrParam['menu_code'] . date('Ymd');
        $query = DB::select_array(array('*', DB::expr('SUBSTRING(`code`, 15, 4) AS version_code')))
                        ->from(['t_proposal', 'SM'])
                        ->where('code', 'LIKE', $project_id_general . '%')
                        ->order_by(DB::expr('SUBSTRING(`code`, 15, 4)'), 'DESC');
        $check_last_code = $query->execute()->current();

        if(!empty($check_last_code)){
            $version_code = (int)$check_last_code['version_code'] + 1;
            $version_code = \Vision_Common::create_number($version_code, 4);
            $proposal_code = $arrParam['menu_code'] . date('Ymd') . $version_code;
        }

        
        return $proposal_code;
    }

    public static function get_detail($arrParam = null){
        $select = ['SM.id', 'SM.copy_petition_id', 'SM.m_menu_id', 'SM.m_user_id', 'SM.m_petition_status_id', 'SM.code', 'SM.name', 'SM.date', 'SM.priority_flg', 'SM.change_route', 'SM.last_approve_user_id', 'SM.last_approve_date',
                    \DB::expr('MM.name AS menu_name'), \DB::expr('MM.code AS menu_code'),
                    \DB::expr('MPS.name AS m_petition_status_name'),
                    'MU.fullname', 'MU.email'];
        $query = \DB::select_array($select)
                     ->from([static::$_table_name, 'SM'])
                     ->join(['m_menu', 'MM'], 'left')->on('SM.m_menu_id', '=', 'MM.id')
                     ->join(['m_petition_status', 'MPS'], 'left')->on('MPS.id', '=', 'SM.m_petition_status_id')
                     ->join(['t_approval_status', 'TAS'], 'left')->on('SM.id', '=', 'TAS.petition_id')->on('TAS.petition_type', '=', \DB::expr('1'))
                     ->join(['m_user', 'MU'], 'left')->on('SM.m_user_id', '=', 'MU.id')
                     ->where('SM.id', '=', $arrParam['id'])
                     ->and_where('SM.item_status', '=', 'active');
                     // ->and_where('TAS.m_user_id', '=', $user_info['id']);

        $result = $query->execute()->current();
        return $result;
    }
}
