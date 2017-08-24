<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */

$controller = preg_match('#^(.*\\\)?Controller_(.*)#', \Request::active()->controller, $matches);
$controller = strtolower($matches[2]);
$action = \Request::active()->action;

/*===========================================
 * Load System library
 *===========================================*/
$arrCss = ['styles.css', 'bootstrap.min.css', 'colors.min.css', 'components.min.css', 'core.min.css', 'jquery-ui.css', 'jquery.tree.min.css', 'toastr.min.css','chosen.css','custom.css'];
$arrJs  = ['jquery.min.js', 'bootstrap.min.js', 'pace.min.js', 'app.js', 'datatables.min.js', 'validate.min.js', 'nicescroll.min.js', 'jquery.form.js',
            'jquery_ui_core.min.js', 'effects.min.js', 'jquery.tree.min.js', 'select2.min.js', 'uniform.min.js', 'bootbox.min.js', 'toastr.min.js', 'chosen.jquery.min.js', 'dropzone.min.js', 'moment.min.js', 'daterangepicker.js', 'datepicker.min.js', 'uploader_dropzone.js', 'system.js'];

/*===========================================
 * Get Default Language
 *===========================================*/
$lang_code = \Cookie::get('lang_code');
$lang_code = (isset($lang_code) && !empty($lang_code))?$lang_code:\Config::get('language');
//================ Load package jquery validate language ==============
if($lang_code != 'en'){
    if (file_exists(DOCROOT . 'js/' . 'jquery_validate_language/messages_' . $lang_code . '.js')){
        $arrJs[] = 'jquery_validate_language/messages_' . $lang_code . '.js';
    }
}

if (file_exists(DOCROOT . DS . 'js' . DS . 'system_translate' . DS . $lang_code . DS . 'language.js')){
    $arrJs[] = 'system_translate' . DS . $lang_code . DS . 'language.js';
}

//================ URL package jquery datatable language ==============
$datatable_language = \Uri::base() . "js/jquery_datatable_language/{$lang_code}.json";

echo Html::doctype('html5');
?>
<html>
    <head>    
        <?php
            echo Html::meta(array(
                             array('http-equiv' => 'Content-Type', 'content' => 'text/html; charset=UTF-8'),
                             array('http-equiv' => 'X-UA-Compatible', 'content' => 'IE=edge'),
                             array('name' => 'viewport', 'content' => 'width=device-width, initial-scale=1'),
                             array('charset' => 'UTF-8')
                            ));
            echo \Theme::instance()->asset->css($arrCss);
            echo \Theme::instance()->asset->js($arrJs);
        ?>

        <!-- Create Javascript Global Variable -->
        <script type="text/javascript"> var base_url = '<?php echo Uri::base(); ?>';</script>
        <script type="text/javascript"> var controller = '<?php echo $controller; ?>';</script>
        <script type="text/javascript"> var action = '<?php echo $action; ?>';</script>
        <script type="text/javascript"> var lang_code = '<?php echo $lang_code; ?>';</script>
        <script type="text/javascript"> var datatable_language = '<?php echo $datatable_language;?>';</script>
        <script type="text/javascript"> var fileUpload = [];</script>
        <script type="text/javascript"> var img_url = base_url + 'images/' + controller</script>
    </head>
