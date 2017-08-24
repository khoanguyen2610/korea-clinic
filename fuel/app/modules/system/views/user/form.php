<?php
    $arrStatus = ['active' => __('Active', array(), 'Active'),
                    'inactive' => __('Inactive', array(), 'Inactive')];
    $Item = isset($Item)?$Item:\Input::param();

?>
<!-- Centered forms -->
<div class="row">
    <div class="col-md-12">
        <form class="form-horizontal form-validate-jquery" name="appForm" id="appForm" action="" method="post">
            <?php if(isset($Item['id'])){ echo Form::hidden('id',$Item['id']); } ?>
            <div class="panel panel-flat">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-10 col-md-offset-1">
                            <div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Full Name', array(), 'Full Name');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::input('fullname', @$Item['fullname'],array('class'=>'form-control', 'required' => 'required')); ?>
                                </div>
                            </div>
							<div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('User Name', array(), 'User Name');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::input('username', @$Item['username'],array('class'=>'form-control', 'required' => 'required')); ?>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Email', array(), 'Email');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::input('email', @$Item['email'],array('class'=>'form-control')); ?>
                                </div>
                            </div>
							<div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Password', array(), 'Password');?>:</label>
                                <div class="col-lg-9">
                                    <?php 
                                    if(isset($Item['id'])){
                                    	echo Form::password('password', '', array('class'=>'form-control','placeholder' => __('Enter Password', array(), 'Enter Password')));
                                    }else{
                                    	echo Form::password('password', '', array('class'=>'form-control','required' => 'required','placeholder' => __('Enter Password', array(), 'Enter Password')));
                                    }
                                    ?>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Organization', array(), 'Organization');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::select('organization_id', @$Item['organization_id'],$arrOrganization,array('required' => 'required', 'multiple' => 'multiple', 'class' => 'select2-container select2-container-multi select')) ?>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Group', array(), 'Group');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::select('group_id', @$Item['group_id'],$arrGroup,array('required' => 'required', 'multiple' => 'multiple', 'class' => 'select2-container select2-container-multi select')) ?>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Role', array(), 'Role');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::select('role_id', @$Item['role_id'],$arrRole,array('multiple' => 'multiple', 'class' => 'select2-container select2-container-multi select')) ?>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-lg-3 control-label"><?php echo __('Status', array(), 'Status');?>:</label>
                                <div class="col-lg-9">
                                    <?php echo Form::select('status', @$Item['status'],$arrStatus,array('class' => 'select')) ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
<!-- /form centered -->

<script>
$(function(){
    /*=============================================
     * Jquery Validate Form
     *=============================================*/
    form_validate();

    $('#appForm').ajaxForm({
        dataType : 'json', 
        success : function(data){
            switch(data.status) {
                case 'error':
                    loadFormError($('#appForm'), data.msg);
                    break;
                case 'success':
                    if(action == 'create'){
                        resetForm($('#appForm'));
                    }
                    toastr.success(data.msg);   
                    break;
                case 'session_timeout':
                    window.location = data.url_redirect;
                    break;
            }
        }
    });
});
</script>
