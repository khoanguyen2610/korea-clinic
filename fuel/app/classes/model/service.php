<?php
/**
 * @Author: k_nguyen
 * @Date:   2016-11-14 14:04:29
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-09-05 14:18:08
 */
class Model_Service extends \Orm\Model {
	protected static $_table_name = 'service';
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


    /*============================================
     * Get all record
     *============================================*/
    public static function getAll($params = null, $option = null){
        $select = [DB::expr('SM.id AS DT_RowId'), 'SM.*', DB::expr('VL.name as language_name'), DB::expr('SC.title as service_category_title')];

        $query = \DB::select_array($select)
                        ->from([self::$_table_name, 'SM'])
                        ->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
						->join(['service_category', 'SC'], 'left')->on('SM.service_category_id', '=', 'SC.id')
                        ->and_where('SM.item_status', '=', 'active')
                        ->order_by('SM.created_at', 'DESC');

        //Query by params
        if(isset($params['service_category_id']) && !empty($params['service_category_id'])) $query->where('SM.service_category_id', '=', $params['service_category_id']);
        if(isset($params['language_code']) && !empty($params['language_code'])) $query->where('SM.language_code', '=', $params['language_code']);
        if(isset($params['limit']) && !empty($params['limit'])) $query->limit($params['limit']);

        $result = $query->as_object()->execute()->as_array();

        return $result;
    }

	/*============================================
     * List Datatable
     *============================================*/
    public static function listData($params = null, $options = null){
        if($options['task'] == 'list-dbtable'){
            $columns = [
                            ['db' => 'SM.image', 'dt' => 0],
                            ['db' => 'SM.service_category_id', 'dt' => 1],
                            ['db' => 'SM.language_code', 'dt' => 2],
                            ['db' => 'SM.title', 'dt' => 3],
                            ['db' => 'SM.description', 'dt' => 4]
                        ];
            $colums = [DB::expr('SQL_CALC_FOUND_ROWS `SM`.`id`'), DB::expr('SM.id AS DT_RowId'), 'SM.*', DB::expr('VL.name as language_name'), DB::expr('SC.title as service_category_title')];

            $query = DB::select_array($colums)
                         ->from([static::$_table_name, 'SM'])
						 ->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
						 ->join(['service_category', 'SC'], 'left')->on('SM.service_category_id', '=', 'SC.id')
                         ->where('SM.item_status', '!=', 'delete');

            $result = Vision_Db::datatable_query($query, $columns, $params, $options);
        }
        return $result;
    }

	/*============================================
     * Get detail informat based on primary key
     *============================================*/
	public static function getDetail($pk = null, $params = null, $option = null){
		$select = ['SM.*', \DB::expr('NULL as image_url'), DB::expr('VL.name as language_name'), DB::expr('SC.title as service_category_title')];

		$query = \DB::select_array($select)
			            ->from([self::$_table_name, 'SM'])
						->join(['vsvn_language', 'VL'], 'left')->on('SM.language_code', '=', 'VL.code')
						->join(['service_category', 'SC'], 'left')->on('SM.service_category_id', '=', 'SC.id')
			            ->where('SM.item_status', '=', 'active')
						->as_object();

		//Query by params
		if(!empty($pk)) $query->where('SM.id', '=', $pk);
		if(isset($params['id']) && !empty($params['id'])) $query->where('SM.id', '=', $params['id']);

		if(isset($params['item_key']) && !empty($params['item_key'])) $query->where('SM.item_key', '=', $params['item_key']);
		if(isset($params['language_code']) && !empty($params['language_code'])) $query->where('SM.language_code', '=', $params['language_code']);



		//Return one record or muilti
		if(isset($params['response_quantity']) && $params['response_quantity'] == 'all') $result = $query->execute();
		if((isset($params['response_quantity']) && $params['response_quantity'] == 'single') || !isset($params['response_quantity']) || empty($params['response_quantity'])) $result = $query->execute()->current();

        //Generate image_url
        if(!empty($result)){
            if(isset($params['response_quantity']) && $params['response_quantity'] == 'all'){
                foreach ($result as $k => $v) {
                    if(!empty($v->image) || (isset($params['image_url_placeholder']) && $params['image_url_placeholder'] == true)){
                        $image = json_decode($v->image);
                        $param_img = ['filepath' => isset($image->filepath)? base64_encode(SERVICE_DIR . $image->filepath): null,
                                        'filename' => isset($image->filename)? base64_encode($image->filename): null,
                                        'width' => 300,
                                        ];
						isset($params['image_resize_square']) && !empty($params['image_resize_square'])	&& $param_img['square'] = $params['image_resize_square'];
                        $result[$k]->image_url = \Uri::create('api/v1/system_general/image', [], $param_img);
                    }
                }
            }
            if((isset($params['response_quantity']) && $params['response_quantity'] == 'single') || !isset($params['response_quantity'])){
                if(!empty($result->image) || (isset($params['image_url_placeholder']) && $params['image_url_placeholder'] == true)){
                    $image = json_decode($result->image);
                    $param_img = ['filepath' => isset($image->filepath)? base64_encode(SERVICE_DIR . $image->filepath): null,
                                    'filename' => isset($image->filename)? base64_encode($image->filename): null,
                                    'width' => 300,
                                    ];
									isset($params['image_resize_square']) && !empty($params['image_resize_square'])	&& $param_img['square'] = $params['image_resize_square'];
                    $result->image_url = \Uri::create('api/v1/system_general/image', [], $param_img);
                }
            }
        }

		return $result;
	}
}
