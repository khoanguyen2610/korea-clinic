<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */
    /*===========================================
     * Get Default Language
     *===========================================*/
    $lang_code = \Cookie::get('lang_code');
    $lang_code = (isset($lang_code) && !empty($lang_code))?$lang_code:\Config::get('language');
    /*=========================================
     * Get list language from database
     *=========================================*/
    $languages = Model_VsvnLanguage::find('all', array('where'=>array('status' => 'active'), 'order' => array('id' => 'asc')));
    $languages = \Vision_Common::as_array($languages, 'code', 'name');

    $xhtmlLang = '';
    if(!empty($languages)){
        $QUERY_STRING = !empty($_SERVER['QUERY_STRING'])?'?' . $_SERVER['QUERY_STRING']:'';
        $linkCallBack = urlencode(@$_SERVER['PATH_INFO'] . $QUERY_STRING);
        $xhtmlLang = '<li class="dropdown language-switch">
                        <a class="dropdown-toggle" data-toggle="dropdown">
                            ' . Html::img(IMG_FLAG_URL . $lang_code .  '.png', array('alt' => '', 'class' => 'position-left')) . $languages[$lang_code] . '
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">';
        foreach ($languages as $k => $v) {
            $linkChangeLanguage = \Uri::create('system/script/change_language/' . $k . '?call_back_uri=' . $linkCallBack);
            $xhtmlLang .= '<li><a href="' . $linkChangeLanguage . '" class="english">' . Html::img(IMG_FLAG_URL . $k . '.png', array('alt' => '')) . $v . '</a></li>';
        }
        $xhtmlLang .= '</ul></li>';
    }
    echo \Theme::instance()->view('partials/header');
?>
  			
    <body>
        <!-- Main navbar -->
        <div class="navbar navbar-inverse">
            <div class="navbar-header">
                <a class="navbar-brand" href=""><?php echo __('Vision Vietnam Management', [], 'Vision Vietnam Management');?></a>
            </div>
            <div class="navbar-collapse collapse" id="navbar-mobile">
                <ul class="nav navbar-nav navbar-right">
                    <?php echo $xhtmlLang;?>
                </ul>
            </div>
        </div>
        <!-- /main navbar -->

        <!-- Page container -->
        <div class="page-container login-container">
            <!-- Page content -->
            <div class="page-content">
                <!-- Main content -->
                <div class="content-wrapper">
                    <?php echo $content; ?>
                </div>
                <!-- /main content -->
            </div>
            <!-- /page content -->
            <!-- Footer -->
            <?php echo \Theme::instance()->view('partials/footer');?>
            <!-- /footer -->
        </div>
        <!-- /page container -->
    </body>
</html> 	
  			