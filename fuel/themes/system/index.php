<?php

/**
 * PHP Class
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */

    echo \Theme::instance()->view('partials/header');
?>
  			
    <body class="navbar-top-md-md">
        <div class="global_loading">
            <div class="sk-cube-grid">
                <div class="sk-cube sk-cube1"></div>
                <div class="sk-cube sk-cube2"></div>
                <div class="sk-cube sk-cube3"></div>
                <div class="sk-cube sk-cube4"></div>
                <div class="sk-cube sk-cube5"></div>
                <div class="sk-cube sk-cube6"></div>
                <div class="sk-cube sk-cube7"></div>
                <div class="sk-cube sk-cube8"></div>
                <div class="sk-cube sk-cube9"></div>
            </div>
        </div>
        <!-- Fixed navbars wrapper -->
        <?php echo \Theme::instance()->view('partials/navigation'); ?>
        <!-- /fixed navbars wrapper -->

        <!-- Page header -->
        <?php echo isset($_header)?$_header:'';?>
        <!-- /page header -->

        <!-- Page container -->
        <div class="page-container">
            <!-- Page content -->
            <div class="page-content">
                <!-- Main content -->
                <div class="content-wrapper">
                    <?php echo $content; ?>
                </div>
                <!-- /Main content -->
            </div>
            <!-- /Page content -->

            <!-- Footer -->
            <?php echo \Theme::instance()->view('partials/footer');?>
            <!-- /footer -->
        </div>
        <!-- /Page container -->
    </body> 
</html> 	
  			