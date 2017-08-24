<style>

.validation-error-label::before, .validation-valid-label::before{
bottom: 0px;top: auto;}
 </style>
<!-- Centered forms -->
<div class="row">
    <div class="col-md-12">
        <form enctype="multipart/form-data" class="form-horizontal form-validate-jquery" name="appForm" id="appForm" action="" method="post">
            <div class="panel panel-flat">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-10 col-md-offset-1">
                            
							
							<div class="form-group">
								<label class="control-label col-lg-2"><?php echo __('Language File',array(),'Language File')?></label>
								<div class="col-lg-10">
										<input id="form_file" required="required" type="file" name="file" class="file-styled">
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
    //form_validate();

    $('#appForm').ajaxForm({
        dataType : 'json', 
        success : function(data){
            switch(data.status) {
                case 'error':
                    console.log(data.msg);
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
