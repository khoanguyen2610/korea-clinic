<!-- Error wrapper -->
<div class="container-fluid text-center">
    <h1 class="error-title"><?php echo $response_code;?></h1>
    <h6 class="text-semibold content-group"><?php echo $response_content;?></h6>
    <div class="row">
        <div class="col-lg-4 col-lg-offset-4 col-sm-6 col-sm-offset-3">
            <div class="row">
                <div class="col-sm-12">
                    <a href="<?php echo \Uri::create('system/index'); ?>" class="btn btn-primary btn-block content-group">
                        <i class="icon-circle-left2 position-left"></i> <?php echo __('Go to dashboard', array(), 'Go to dashboard');?>
                    </a>
                </div>

            </div>
        </div>
    </div>
</div>
<!-- /error wrapper -->