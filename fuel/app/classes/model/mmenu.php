<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 13:36:23
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-02-08 17:34:46
 */
class Model_MMenu extends \Orm\Model {
	protected static $_table_name = 'm_menu';
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
                            ['db' => 'SM.name', 'dt' => 0],
                            ['db' => 'SM.description', 'dt' => 1],
                            ['db' => 'MD.name', 'dt' => 2],
                            ['db' => 'MP.name', 'dt' => 3],
                            ['db' => 'SM.enable_flg', 'dt' => 4],
                            ['db' => 'SM.add_file_flg', 'dt' => 5]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', \DB::expr('MD.name AS department_name'), \DB::expr('MP.name AS position_name')];


            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
                         ->join(['m_department', 'MD'], 'left')->on('SM.m_department_id', '=', 'MD.id')
                         ->join(['m_position', 'MP'], 'left')->on('SM.limit_m_position_id', '=', 'MP.id')
                         ->where('SM.item_status', '!=', 'delete');

            /*===========================================
             * Filter data from client request
             *===========================================*/
            if(isset($arrParam['name']) && !empty($arrParam['name'])){
                $query->and_where('SM.name', 'like', '%' . $arrParam['name'] . '%');
            }  
            if(isset($arrParam['enable_flg']) && $arrParam['enable_flg'] != null){
                $query->and_where('SM.enable_flg', '=', $arrParam['enable_flg']);
            }     
            if(isset($arrParam['m_department_id']) && $arrParam['m_department_id'] != null){
                $query->and_where('SM.m_department_id', '=', $arrParam['m_department_id']);
            }    

            $result = Vision_Db::datatable_query($query, $columns, $arrParam, $options);
        }        
        return $result;
    }

    /*============================================
     * Get last menu code
     *============================================*/
    public static function last_menu_code($arrParam = null){
        $query = DB::select('*', \DB::expr('SUBSTRING(code, 1, 1) AS first_number'), \DB::expr('SUBSTRING(code, 2, 3) AS second_number'), \DB::expr('SUBSTRING(code, 5, 2) AS third_number'))
                        ->from([static::$_table_name, 'SM'])
                        ->where(\DB::expr('SUBSTRING(code, 1, 1)'), '=', 1)
                        ->order_by(\DB::expr('SUBSTRING(code, 2, 3)'), 'DESC')
                        ->order_by(\DB::expr('SUBSTRING(code, 5, 2)'), 'DESC');
        $result = $query->execute()->current();
        return $result;
    }
}
