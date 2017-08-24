<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-15 14:40:43
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-03-02 14:31:25
 */
class Model_MUserDepartment extends \Orm\Model {
	protected static $_table_name = 'm_user_department';
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
    static function getCurrentDepartment($user_id, $enable_date = null, $many = false, $concurrent_post_flag = 0, $arrParam = null){
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
        if(isset($arrParam['m_department_id']) && !empty($arrParam['m_department_id'])){
            $query->and_where('SM.m_department_id', '=', $arrParam['m_department_id']);
        }
        // echo $query;die;
        $result = ($many)?$query->execute()->as_array():$query->execute()->current();
        return $result;
    }

	public static function processUserDepartment($obj){
        foreach ($obj as $key => $value) {
            if(empty($value)) continue;
            $random_string = \Vision_Common::randomString(10);
            $new_key = strtotime($value->enable_start_date) . $random_string;
            $value->random_string = $random_string;
            $data[$new_key] = $value;
        }

        /*=======================================
         * Get name: company_name, business_name, division_name
         * department_name, position_name
         *=======================================*/
        $queryCompany = \DB::select('id', 'name')
                                ->from(['m_company', 'SM']);
        $arrCompany = $queryCompany->execute()->as_array('id', 'name');

        $queryDepartment = \DB::select('id', 'name')
                                ->from(['m_department', 'SM']);
        $arrDepartment = $queryDepartment->execute()->as_array('id', 'name');

        $queryPostion = \DB::select('id', 'name')
                                ->from(['m_position', 'SM']);
        $arrPosition = $queryPostion->execute()->as_array('id', 'name');

        $user_main_division = $user_division = [];

        foreach ($data as $key => $value) {
            $value->m_company_id = is_array($value->m_company_id)?current($value->m_company_id):$value->m_company_id;
            $value->business_id = is_array($value->business_id)?current($value->business_id):$value->business_id;
            $value->division_id = is_array($value->division_id)?current($value->division_id):$value->division_id;
            $value->m_department_id = is_array($value->m_department_id)?current($value->m_department_id):$value->m_department_id;
            $value->m_position_id = is_array($value->m_position_id)?current($value->m_position_id):$value->m_position_id;

            $value->company_name = isset($arrCompany[$value->m_company_id])? $arrCompany[$value->m_company_id]: null;
            $value->business_name = isset($arrDepartment[$value->business_id])? $arrDepartment[$value->business_id]: null;
            $value->division_name = isset($arrDepartment[$value->division_id])? $arrDepartment[$value->division_id]: null;
            $value->department_name = isset($arrDepartment[$value->m_department_id])? $arrDepartment[$value->m_department_id]: null;
            $value->position_name = isset($arrPosition[$value->m_position_id])? $arrPosition[$value->m_position_id]: null;


            if(@$value->concurrent_post_flag == true || @$value->concurrent_post_flag == 1){
                $user_division[$key] = $value;
            }else{
                $user_main_division[$key] = $value;
            }
        }

        /*================== Update enable_end_date ==================*/
        if(!empty($user_main_division)){
            while($current = current($user_main_division)) {
                $next_data = next($user_main_division);
                if(!empty($next_data)){
                    $current_key = strtotime($current->enable_start_date) . $current->random_string;
                    @$user_main_division[$current_key]->enable_end_date = date('Y-m-d', strtotime("-1 day", strtotime($next_data->enable_start_date)));
                }else{
                    // @$user_main_division[$current_key]->enable_end_date = null;
                }
            }
        }
        $data = $user_main_division + $user_division;
        $data = array_values($data);

        return $data;
    }

}
