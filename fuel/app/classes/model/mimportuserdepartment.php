<?php
/**
 * @Author: l_phan
 * @Date:   2017-02-23 14:40:43
 * @Last Modified by:   l_phan
 */
class Model_MImportUserDepartment extends \Orm\Model {
    protected static $_table_name = 'm_import_user_department';
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

    /*=============================================
     * Get current main department
     *=============================================*/
    static function getCurrentDepartment($user_id, $enable_date = null, $many = false, $concurrent_post_flag = 0){
        $enable_date = !empty($enable_date)?date('Y-m-d', strtotime($enable_date)):date('Y-m-d');  

        $query = \DB::select('SM.id', 'SM.m_department_id', 
                    'SM.m_position_id', \DB::expr('MP.code as position_code'), \DB::expr('MP.name as position_name'), 
                    \DB::expr('DEP.id as department_id'), \DB::expr('DEP.code as department_code'), \DB::expr('DEP.name as department_name'), 
                    \DB::expr('COM.id as m_company_id'), \DB::expr('COM.name as company_name'),
                    \DB::expr('DIV.id as division_id'), \DB::expr('DIV.name as division_name'), 
                    \DB::expr('BUS.id as business_id'), \DB::expr('BUS.name as business_name'))
                    ->from([static::$_table_name, 'SM'])
                    ->join(['m_department', 'DEP'], 'left')->on('DEP.id', '=', 'SM.m_department_id')->on('DEP.level', '=', \DB::expr(3))
                    ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'DEP.parent')->on('DIV.level', '=', \DB::expr(2))
                    ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr(1))
                    ->join(['m_company', 'COM'], 'left')->on('COM.id', '=', 'DEP.m_company_id')
                    ->join(['m_position', 'MP'], 'left')->on('MP.id', '=', 'SM.m_position_id')
                    ->where('SM.item_status', '!=', 'delete')
                    ->and_where('SM.concurrent_post_flag', '=', $concurrent_post_flag)
                    ->and_where('SM.m_user_id', '=', $user_id)
                    ->and_where_open()
                        ->and_where(\DB::expr("'{$enable_date}'"), 'BETWEEN', [\DB::expr('SM.enable_start_date'), \DB::expr('SM.enable_end_date')])
                        ->or_where_open()
                            ->and_where(\DB::expr('SM.enable_start_date'), '<=', $enable_date)
                            ->and_where(\DB::expr('SM.enable_end_date'), 'IS', \DB::expr('NULL'))
                        ->or_where_close()
                    ->and_where_close()
                    ;
        // echo $query;die;
        $result = ($many)?$query->execute()->as_array():$query->execute()->current();
        return $result;            
    }

}
