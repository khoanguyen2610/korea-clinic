<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:26:16
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-06-01 10:12:38
 */
class Model_MDepartment extends \Orm\Model {
	protected static $_table_name = 'm_department';
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
            $columns = [
                            ['db' => 'BUS.code', 'dt' => 0],
                            ['db' => 'BUS.name', 'dt' => 1],
                            ['db' => 'DIV.code', 'dt' => 2],
                            ['db' => 'DIV.name', 'dt' => 3],
                            ['db' => 'SM.code', 'dt' => 4],
                            ['db' => 'SM.name', 'dt' => 5],
                            ['db' => 'SM.sub_code', 'dt' => 6],
                            ['db' => 'SM.allow_export_routes', 'dt' => 7],
                            ['db' => 'SM.enable_start_date', 'dt' => 8],
                            ['db' => 'SM.enable_end_date', 'dt' => 9]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', 
            		\DB::expr('DIV.name AS division_name'), \DB::expr('DIV.code AS division_code'), \DB::expr('DIV.id AS division_id'),
            		\DB::expr('BUS.name AS business_name'), \DB::expr('BUS.code AS business_code'), \DB::expr('BUS.id AS business_id')];

            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->join([static::$_table_name, 'DIV'], 'left')->on('DIV.id', '=', 'SM.parent')->on('DIV.level', '=', \DB::expr(2))
                         ->join([static::$_table_name, 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr(1))
                         ->where('SM.item_status', '!=', 'delete')
                         ->and_where('SM.level', '=', 3);

            // echo '<pre>';
            //  print_r($arrParam);
            //  echo '</pre>'; 
            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['enable_start_date']) && $arrParam['enable_start_date'] != null){
                $query->and_where('SM.enable_start_date', '>=', date('Y-m-d', strtotime($arrParam['enable_start_date'])));
            }
            if(isset($arrParam['enable_end_date']) && $arrParam['enable_end_date'] != null){
                $query->and_where('SM.enable_end_date', '>=', date('Y-m-d', strtotime($arrParam['enable_end_date'])));
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
                $query->and_where('SM.id', '=', $arrParam['department_id']);
            }     


            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }

    /*============================================
     * Get combo department
     * Business - division - department
     *============================================*/
    public static function comboData($arrParam = null, $options = null){
        if($options['task'] == 'department'){
           //Get business_id & division_id based on m_department_id
            $query = \DB::select(\DB::expr('BUS.id AS business_id'), \DB::expr('BUS.code AS business_code'), \DB::expr('BUS.name AS business_name'),
                                    \DB::expr('DIV.id AS division_id'), \DB::expr('DIV.code AS division_code'), \DB::expr('DIV.name AS division_name'),
                                    \DB::expr('SM.id AS department_id'), \DB::expr('SM.code AS department_code'), \DB::expr('SM.name AS deparment_name'))
                        ->from(['m_department', 'SM'])
                        ->join(['m_department', 'DIV'], 'left')->on('DIV.id', '=', 'SM.parent')->on('DIV.level', '=', \DB::expr(2))
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'DIV.parent')->on('BUS.level', '=', \DB::expr(1))
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('SM.id', '=', $arrParam['m_department_id'])
                        ->and_where('SM.level', '=', 3);
            $result = $query->execute()->current();
        }  
        if($options['task'] == 'division'){
           //Get business_id based on division_id
            $query = \DB::select(\DB::expr('BUS.id AS business_id'), \DB::expr('BUS.code AS business_code'), \DB::expr('BUS.name AS business_name'),
                                    \DB::expr('SM.id AS division_id'), \DB::expr('SM.code AS division_code'), \DB::expr('SM.name AS division_name'))
                        ->from(['m_department', 'SM'])
                        ->join(['m_department', 'BUS'], 'left')->on('BUS.id', '=', 'SM.parent')->on('BUS.level', '=', \DB::expr(1))
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('SM.id', '=', $arrParam['m_department_id'])
                        ->and_where('SM.level', '=', 2);
            $result = $query->execute()->current();
        }       
        if($options['task'] == 'business'){
           //Get business_id based on business_id
            $query = \DB::select(\DB::expr('SM.id AS business_id'), \DB::expr('SM.code AS business_code'), \DB::expr('SM.name AS business_name'))
                        ->from(['m_department', 'SM'])
                        ->where('SM.item_status', '!=', 'delete')
                        ->and_where('SM.id', '=', $arrParam['m_department_id'])
                        ->and_where('SM.level', '=', 1);
            $result = $query->execute()->current();
        }        
        return $result;
    }
}
