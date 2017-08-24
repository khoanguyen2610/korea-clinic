<?php
    $arrStatus = ['active' => __('Active', array(), 'Active'),
                    'inactive' => __('Inactive', array(), 'Inactive')];
    $Item = isset($Item)?$Item:\Input::param();

?>
<!-- Centered forms -->
<div class="modal-header bg-system">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h5 class="modal-title"><?php echo $sub_title;?></h5>
</div>
<form class="form-horizontal form-validate-jquery" name="appForm" id="appForm" action="<?php echo \Uri::create('system/translate/form');?>" method="post">
    <div class="modal-body">
        <?php if(isset($Item['id'])){ echo Form::hidden('id',$Item['id']); } ?>
        <?php echo Form::hidden('form_type','submit_form');  ?>
        <div class="form-group">
            <label class="col-lg-3 control-label"><?php echo __('Language', array(), 'Language');?>:</label>
            <div class="col-lg-9">
                <?php echo Form::select('language_code', @$Item['language_code'],$arrLanguage,array('class' => 'select')) ?>
            </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label"><?php echo __('Origin Content', array(), 'Origin Content');?>:</label>
            <div class="col-lg-9">
                <?php echo Form::textarea('key', @$Item['key'],array('class'=>'form-control', 'required' => 'required')); ?>
            </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label"><?php echo __('Translate Content', array(), 'Translate Content');?>:</label>
            <div class="col-lg-9">
                <?php echo Form::textarea('value', @$Item['value'],array('class'=>'form-control', 'required' => 'required')); ?>
            </div>
        </div>

        <div class="form-group">
            <label class="col-lg-3 control-label"><?php echo __('Status', array(), 'Status');?>:</label>
            <div class="col-lg-9">
                <?php echo Form::select('status', @$Item['status'],$arrStatus,array('class' => 'select')) ?>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn border-slate text-slate-800 btn-flat" data-dismiss="modal"><i class="icon-backward position-left"></i></i><?php echo __('Back', array(), 'Back'); ?></button>
        <button type="submit" class="btn border-slate text-slate-800 btn-flat"><i class="icon-floppy-disk position-left"></i><?php echo __('Save', array(), 'Save'); ?></button>
    </div>
</form>
<!-- /form centered -->

<script>
$(function(){

	var action = '<?php echo isset($Item['id'])?"update":"create";?>';
	
    $('.select').select2();
    /*=============================================
     * Jquery Validate Form
     *=============================================*/
    //var rules = {code:{required: true, maxlength: 2}};
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
                    }else{
                    	$('#appForm').find('label.validation-error-label').remove();
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
