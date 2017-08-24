<?php
    $Item = isset($Item)?$Item:\Input::param();

?>
<!-- Centered forms -->
<div class="modal-header bg-system">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h5 class="modal-title"><?php echo $sub_title;?></h5>
</div>
<form class="form-horizontal form-validate-jquery" name="appForm" id="appForm" action="<?php echo \Uri::create('system/options/form');?>" method="post">
    <div class="modal-body">
        <?php if(isset($Item['id'])){ echo Form::hidden('id',$Item['id']); } ?>
        <?php echo Form::hidden('form_type','submit_form');  ?>
        
        <div class="form-group">
            <label class="col-lg-3 control-label"><?php echo __('Option Name', array(), 'Option Name');?>:</label>
            <div class="col-lg-9">
                <?php echo Form::textarea('name', @$Item['name'],array('class'=>'form-control', 'required' => 'required')); ?>
            </div>
        </div>
        <div class="form-group">
            <label class="col-lg-3 control-label"><?php echo __('Option Value', array(), 'Option Value');?>:</label>
            <div class="col-lg-9">
                <?php echo Form::textarea('value', @$Item['value'],array('class'=>'form-control', 'required' => 'required')); ?>
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
