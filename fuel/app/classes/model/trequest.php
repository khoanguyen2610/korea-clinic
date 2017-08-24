<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:06:54
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2016-12-28 18:21:22
 */
class Model_TRequest extends \Orm\Model {
	protected static $_table_name = 't_request';
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
     * Get last menu code
     *============================================*/
    public static function get_last_payment_code($arrParam = null){
        $payment_code = $arrParam['menu_code'] . date('Ymd') . '0001';
        $project_id_general = $arrParam['menu_code'] . date('Ymd');
        $query = DB::select_array(array('*', DB::expr('SUBSTRING(`code`, 15, 4) AS version_code')))
                        ->from(['t_request', 'SM'])
                        ->where('code', 'LIKE', $project_id_general . '%')
                        ->order_by(DB::expr('SUBSTRING(`code`, 15, 4)'), 'DESC');
        $check_last_code = $query->execute()->current();

        if(!empty($check_last_code)){
            $version_code = (int)$check_last_code['version_code'] + 1;
            $version_code = \Vision_Common::create_number($version_code, 4);
            $payment_code = $arrParam['menu_code'] . date('Ymd') . $version_code;
        }

        
        return $payment_code;
    }

    public static function get_detail($arrParam = null){
        $select = ['SM.id', 'SM.m_request_menu_id', 'SM.m_user_id', 'SM.m_currency_id', 'SM.m_petition_status_id', 'SM.code', 'SM.date', 'SM.type', 'SM.name', 'SM.destination', 
                    'SM.expenses_flg', 'SM.priority_flg', 'SM.change_route', 'SM.reason', 'SM.amount', 'SM.reason', 'SM.suspense_payments', 'SM.settlement_amount', 'SM.cor_amount', 'SM.cor_suspense_payments', 
                    'SM.cor_settlement_amount', 'SM.account_conf_date', 'SM.account_staff_no', 'SM.transfer_date', 'SM.obic_outeput_date', 'SM.zenginkyo_outeput_date', 'SM.zenginkyo_output_hold_flg', 
                    'SM.receipt_arrival', 'SM.last_approve_user_id', 'SM.last_approve_date',
                    \DB::expr('MRM.name AS request_menu_name'), \DB::expr('MRM.code AS request_menu_code'),
                    'TRP.m_expense_item_id',
                    \DB::expr('MCU.symbol AS currency_symbol'),
                    'MU.fullname', 'MU.email'
                    ];
        $query = \DB::select_array($select)
                     ->from([static::$_table_name, 'SM'])
                     ->join(['m_request_menu', 'MRM'], 'left')->on('SM.m_request_menu_id', '=', 'MRM.id')
                     ->join(['t_request_purchase', 'TRP'], 'left')->on('TRP.t_request_id', '=', 'SM.id')
                     ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
                     ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'MU.m_currency_id')
                     ->where('SM.id', '=', $arrParam['id'])
                     ->and_where('SM.item_status', '=', 'active');

        $result = $query->execute()->current();
        return $result;
    }

}
