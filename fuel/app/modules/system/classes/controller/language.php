<?php
 
/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 15, 2016 22:49:51 PM
 */


namespace System;
    

class Controller_Language extends \Controller_Common {
    public function before() {
        parent::before();
        $this->theme->active('system');
        $this->theme->set_template('index');

        if (!\Auth::check()){
            if(\Input::is_ajax()){
                $url_redirect = \Uri::create('system/default/login?call_back_uri=') . \Uri::create('system/language');
                exit(\Response::forge(json_encode(array('status' => 'session_timeout', 'url_redirect' => $url_redirect))));
            }
            \Response::redirect(\Uri::create('system/default/login?call_back_uri=' . urlencode($this->_arrParam['path_uri'])));
        }

        if(!$this->get_permission() && CHECK_PERMISSION){
            \Response::redirect('system/default/response/403');
        }
    }

    public function action_index(){
        
        $this->_arrParam['title'] = __('Language management', array(), 'Language management');
        $this->_arrParam['sub_title'] = __('Display Data', array(), 'Display Data');
        $this->theme->get_template()->set('_header', \view::forge('language/_header', $this->_arrParam));
        $this->theme->get_template()->set('content', \view::forge('language/index', $this->_arrParam));
    }

    public function action_create(){
        if(\Input::is_ajax()){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $this->_arrParam['title'] = __('Language management', array(), 'Language management');
            $this->_arrParam['sub_title'] = __('Create Data', array(), 'Create Data');
            $this->theme->get_template()->set('_header', \view::forge('language/_header', $this->_arrParam));
            $this->theme->get_template()->set('content', \view::forge('language/form', $this->_arrParam, false));
        }
    }

    public function action_update($id){
        if(\Input::is_ajax()){
            return \Response::forge(json_encode($this->save_item()));
        }else{
            $Item = \Model_VsvnLanguage::find($id);
            $this->_arrParam['Item'] = $Item;

            $this->_arrParam['title'] = __('Language management', array(), 'Language management');
            $this->_arrParam['sub_title'] = __('Update Data', array(), 'Update Data');
            $this->theme->get_template()->set('_header', \view::forge('language/_header', $this->_arrParam));
            $this->theme->get_template()->set('content', \view::forge('language/form', $this->_arrParam, false));
        }
    }
    
    protected function save_item(){
        $validation = \Validation::forge();
        $validation->add_callable('MyRules');
        \Input::post('id')?$validation->add_field('code',__('Code', array(), 'Code'),'required|max_length[2]')->add_rule('unique', 'vsvn_language.id.code.'.\Input::post('id'))
                            :$validation->add_field('code',__('Code', array(), 'Code'),'required|max_length[2]')->add_rule('unique', 'vsvn_language.id.code');
        \Input::post('id')?$validation->add_field('name',__('Name', array(), 'Name'),'required')->add_rule('unique', 'vsvn_language.id.name.'.\Input::post('id'))
                            :$validation->add_field('name',__('Name', array(), 'Name'),'required')->add_rule('unique', 'vsvn_language.id.name');
        if($validation->run()){
            $data = \Input::param();
            if(\Input::param('id')){
                $this->_arrParam['action'] = 'update';
                \Model_VsvnLanguage::find(\Input::param('id'))->set($data)->save();
            }else{
                $this->_arrParam['action'] = 'create';
                \Model_VsvnLanguage::forge()->set($data)->save();
            }
            
            /*====================================================
             * Response result
             *====================================================*/
            switch ($this->_arrParam['action']) {
                case 'create':
                    $msg = __('Record Created Successfully', array(), 'Record Created Successfully');
                    break;
                case 'update':
                    $msg = __('Record Updated Successfully', array(), 'Record Updated Successfully');
                    break;
            }
            return array('status'=>'success','msg'=> $msg);
        }
        return array('status'=>'error','msg'=>$validation->error_message()); 
    }

    public function action_status_item(){
        $param = \Input::param();
        if(!empty($param['id'])){
            if($param['type_action'] == 'delete'){
                \Model_VsvnLanguage::softDelete($param['id'], array('status' => 'delete'));
                $msg = __('Record Deleted Successfully', array(), 'Record Deleted Successfully');
            }else{
                $status = ($param['status'] == 'active')?'inactive':'active';
                \Model_VsvnLanguage::find($param['id'])->set(['status' => $status])->save();
                $msg = __('Record Updated Successfully', array(), 'Record Updated Successfully');
            }
            return \Response::forge(json_encode(array('status' => 'success', 'msg' => $msg)));
        }else{
            return \Response::forge(json_encode(array('status' => 'error', 'msg' => __('An unexpected error occurred', array(), 'An unexpected error occurred'))));
        }
    }

    public function action_load_item_data(){
        $arrStatus = ['active' => __('Active', array(), 'Active'),
                    'inactive' => __('Inactive', array(), 'Inactive')];
        $result     = \Model_VsvnLanguage::listItem($this->_arrParam['post_params'], array('task'=>'list-dbtable'));
        $items      = $result['data'];
        foreach($items as $k => $v){
            $linkEdit = \Uri::create('system/language/update/' . $v['id']);
            $linkExport = \Uri::create('system/script/export_language/' . $v['code']);

            $lblStatus = @$arrStatus[$items[$k]['status']];                        
            $clssStatus = ($items[$k]['status'] == 'active')?'label label-success':'label label-default';                        
            $items[$k]['status'] = '<a href="#" id="tbl-status-btn" data-status="' . $items[$k]['status'] . '" class="'.$clssStatus.'">' . $lblStatus . '</a>';
                                    
            $items[$k]['control'] = '<ul class="icons-list">
                                        <li class="dropdown">
                                            <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon-menu9"></i></a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="'.$linkExport.'"><i class="icon-database-export"></i> ' . __('Export', array(), 'Export') . '</a></li>
            									<li><a href="' . $linkEdit . '"><i class="icon-pencil7"></i> ' . __('Update', array(), 'Update') . '</a></li>
                                                <li><a href="#" id="tbl-delete-btn"><i class="icon-trash"></i> ' . __('Delete', array(), 'Delete') . '</a></li>
                                                
                                            </ul>
                                        </li>
                                    </ul>';
        }
        $output = array(
                        "sEcho" => intval(@$this->_arrParam['sEcho']),
                        "iTotalRecords" => $result['total'],
                        "iTotalDisplayRecords" => $result['total'],
                        "aaData" => $items
                    );
        $response = \Response::forge();
        $response->body(json_encode($output));
        return $response;
    }

    public function action_import_translate(){
        $sPath = DOCROOT.'files'.DS.'language_translate';
        $arrResult = array();
            $sEror = array();
            if(\Input::method() == 'POST'){
                $config = array(
                        'path' => $sPath,
                        'randomize' => true,
                        'ext_whitelist' => array('csv'),
                );
                \Upload::process($config);
                foreach (\Upload::get_errors() as $file){
                    $sEror [$file['field']]= $file['errors'][0]['message'];
                }
                if(!$sEror){
                    /* process import data*/
                    ini_set('max_execution_time', 600);
                    $file = file_get_contents($_FILES["file"]["tmp_name"]);
                    $file = explode(PHP_EOL, $file);
                    
                    $arrExit = array();
                    $i =0;
                    $sCodeLang = '';
                    
                    foreach ($file as $line) {
                        $i++;
                        $data = str_getcsv($line);

                        if ($i==1 || is_null($data[0])){
                            continue;
                        }
                        $data[0] = \Vision_Common::trim($data[0]);
                        $data[1] = \Vision_Common::trim($data[1]);
                        $data[2] = \Vision_Common::trim($data[2]);
                        $sCodeLang =$data[2];
                        $arrLang = \Model_VsvnTranslate::find('first', ['where' => [['key', \DB::expr('BINARY') . $data[0]], 'language_code' =>$sCodeLang]]);
                        $arrLang = \Vision_Common::as_array($arrLang);
                        $arrUpdate = array();
                        if($arrLang){
                            //update 
                            $arrUpdate['id'] = $arrLang['id'];
                            $arrUpdate['key']= $data[0];
                            $arrUpdate['value']= $data[1];
                            $arrUpdate['language_code']= $sCodeLang;
                            if(isset($data[1]) && strlen($data[1]) > 0){
                                $obj = \Model_VsvnTranslate::find($arrLang['id']);
                                if(!empty($obj)){
                                    $obj->set($arrUpdate)->save();
                                }
                            }
                        }else{
                            //insert
                            $arrUpdate['key']= $data[0];
                            $arrUpdate['value']= !empty($data[1])?$data[1]:$data[0];
                            $arrUpdate['language_code']= $sCodeLang;
                            $arrUpdate['status'] = "active"; 
                            \Model_VsvnTranslate::forge()->set($arrUpdate)->save();
                        }
                    }
                    $arrResult = array('status' =>'success','msg' =>__('Record Import Successfully', array(), 'Record Import Successfully'));
                }else{
                    $arrResult = array('status' =>'error','msg' => $sEror);
                }
                echo json_encode($arrResult);exit;
                                
        }else{
            $this->_arrParam['title'] = __('Language management', array(), 'Language management');
            $this->_arrParam['sub_title'] = __('Import Data', array(), 'Import Data');
            $this->theme->get_template()->set('_header', \view::forge('language/_header-import', $this->_arrParam));
            $this->theme->get_template()->set('content', \view::forge('language/form-import', $this->_arrParam, false));
        }
    }

    public function action_generate_translate(){
        $dirJs = DOCROOT . DS . 'js' . DS . 'system_translate';
        $dirPHP = APPPATH . 'lang';

        //============== Get Active Language ================
        $arrLang = \Model_VsvnLanguage::find('all', ['where' => ['status' => 'active']]);
        if(!empty($arrLang)){
            foreach ($arrLang as $language) {
                $translate = \Model_VsvnTranslate::find('all', ['where' => ['language_code' => $language->code, 'status' => 'active']]);
                $arrLang = \Vision_Common::as_array($translate, 'key', 'value');
                
                /*===========================================
                 * Generate File Translate PHP
                 *===========================================*/
                try{
                    \File::read_dir($dirPHP . DS . $language->code);
                }catch(\FileAccessException $e){
                    \File::create_dir($dirPHP, $language->code, '0777');
                }

                $strLang = json_encode($arrLang);
                $content = $strLang;
                \File::update($dirPHP . DS . $language->code, 'language.json', $content);

                /*===========================================
                 * Generate File Translate JS
                 *===========================================*/
                try{
                    \File::read_dir($dirJs . DS . $language->code);
                }catch(\FileAccessException $e){
                    \File::create_dir($dirJs, $language->code, '0777');
                }

                $strLang = json_encode($arrLang);
                $content = 'var language_translate = ' . $strLang;
                \File::update($dirJs . DS . $language->code, 'language.js', $content);
            }
        }
        $response = array('status' => 'success', 'msg' => __('Record Updated Successfully', array(), 'Record Updated Successfully'));
        return \Response::forge(json_encode($response));
    }
}
