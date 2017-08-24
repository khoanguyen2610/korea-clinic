<!-- Simple login form -->
<form name="appForm" id="appForm" action="" class="form-validate-jquery" method="post">
    <div class="panel panel-body login-form">
        <div class="text-center">
            <div class="icon-object border-slate-300 text-slate-300"><i class="icon-reading"></i></div>
            <h5 class="content-group">
                <?php echo __('Login to your account', array(), 'Login to your account'); ?>
                <small class="display-block"><?php echo __('Enter your credentials below', array(), 'Enter your credentials below'); ?></small>
            </h5>
        </div>
        <div id="msg_area" style="display: none"></div>
        <div class="form-group has-feedback has-feedback-left">
            <?php echo Form::input('email',\Input::param('email'),array('class'=>'form-control','readonly'=>'','onfocus'=>'$(this).removeAttr(\'readonly\');','required'=>'required', 'placeholder'=> __('Email', array(), 'Email'))); ?>
            <div class="form-control-feedback">
                <i class="icon-user text-muted"></i>
            </div>
        </div>

        <div class="form-group has-feedback has-feedback-left">
            <?php echo Form::password('password',\Input::param('password'),array('class'=>'form-control','readonly'=>'','onfocus'=>'$(this).removeAttr(\'readonly\');','required'=>'required', 'placeholder'=> __('Password', array(), 'Password'))); ?>
            <div class="form-control-feedback">
                <i class="icon-lock2 text-muted"></i>
            </div>
        </div>

        <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block"><?php echo __('Sign in', array(), 'Sign in'); ?> <i class="icon-circle-right2 position-right"></i></button>
        </div>

        <div class="text-center">
            <a href="#"><?php echo __('Forgot password?', array(), 'Forgot password?'); ?></a>
        </div>
    </div>
</form>
<!-- /simple login form -->

<script>
$(function() {
    /*=============================================
     * Jquery Validate Form
     *=============================================*/
    var rules = {
            email: {
                email: true
            }
        }
    form_validate(rules);

    $('#appForm').ajaxForm({
        dataType    : 'json', 
        beforeSubmit : function(){},
        success     : function(data){
            if(data.status == "error"){
                load_alert_msg($('#msg_area'), data.msg);
                $('.validation-error-label').remove();
            }else{
                window.location.href = data.url;
            }
            
        }
    });
    
});
</script>