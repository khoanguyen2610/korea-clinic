<?php

class Model_System_VsvnListMca extends Orm\Model {
	protected static $_table_name = 'vsvn_list_mca';
    protected static $_primary_key = ['id'];

    public static function getRecursive($checked = array()){
		$data = self::find('all', array('select'=>array('id','name','type','parent')));
		$data = \Vision_Common::as_array($data);
		return self::recursive(0,$data,$checked);
	}
	
	public static function getRecursiveChecked($chosen){
		$checked = array();
		if(!empty($chosen)){
			foreach($chosen as $module=>$area){
				$md = self::find('first',['where' => ['name'=>$module,'type'=>'module']]);
				$md = \Vision_Common::as_array($md);
				$checked[] = $md['id'];
				foreach($area as $controller=>$actions){
					$ctr = self::find('first',['where' => ['name'=>$controller,'type'=>'controller', 'parent' => $md['id']]]);
					$ctr = \Vision_Common::as_array($ctr);
					$checked[] = $ctr['id'];
					foreach($actions as $action){
						$act = self::find('first',['where' => ['name'=>$action,'type'=>'action', 'parent' => $ctr['id']]]);
						$act = \Vision_Common::as_array($act);
						$checked[] = $act['id'];
					}
				}
			}
		}
		return self::getRecursive($checked);
	}
	
	protected static function recursive($parent = 0,$data,$checked = array()){
		$html = '';
		if($data){
			foreach($data as $item){
				$name = '[' . $item['type'] . '] ' . $item['name'];
				if($item['parent']==$parent){
					$html .= '<ul>';
					$html .= in_array($item['id'],$checked)?'<li>'.\Form::checkbox('rid[]',$item['id'],true, array('class' => 'styled')).\Form::label($name)
								:'<li>'.\Form::checkbox('rid[]',$item['id'], null, array('class' => 'styled')).\Form::label($name); 
					$html .= self::recursive($item['id'],$data,$checked);
					$html .= '</li>';
					$html .= '</ul>';
				}
			}
		}
		return $html;
	}
}