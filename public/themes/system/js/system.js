/**
 * Javscript Library System
 *
 * LICENSE
 * 
 * @author Nguyen Anh Khoa-VISIONVN
 * @created Feb 08, 2016 01:01:01 AM
 */

$(function() {
    // Month and year menu
    $(".datepicker-menus").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
    });

    /*==============================================
     * Config Datatable
     *==============================================*/
    $.extend( $.fn.dataTable.defaults, {
        pageLength: 25,
        autoWidth: true,
        columnDefs: [{ 
            orderable: false,
            width: '100px',
        }],
        dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
        language: {url : datatable_language},
        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });

    /*==============================================
     * Config Toastr Notification
     *==============================================*/
    var toastrOptions = {
            "closeButton": true,
            "debug": false,
            "progressBar": true,
            "preventDuplicates": false,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "400",
            "hideDuration": "1000",
            "timeOut": "4000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    toastr.options = toastrOptions;


    /*==============================================
     * Custom Select box
     *==============================================*/
    $('.select').select2();

    /*==============================================
     * Custom file upload
     *==============================================*/
    $(".file-styled").uniform({
        fileButtonHtml: '<i class="icon-googleplus5"></i>',
        wrapperClass: 'bg-warning'
    });

    /*==============================================
     * Custom checkbox, radio button
     *==============================================*/
    $(".styled").uniform({ radioClass: 'choice' });
    $(".styled").on('change', function(){
        $.uniform.update();
    })

    /*==============================================
     * Set language for Jquery Bootbox
     *==============================================*/
    bootbox.setDefaults({
      locale: lang_code,
    })


    /*====================================================
     * Global loading when ajax start and end
     *====================================================*/
    $(document).ajaxStart(function() {
        $(".global_loading").show();
    });
    $(document).ajaxComplete(function() {
        $(".global_loading").hide();
    });

});

/*====================================================
 * Submit Serialize Forms
 * Input: Form Element Attribute
 * Ex: $(#appForm)
 *====================================================*/

function submitSerializeForms(action_url, language_code) {

    formArray = [];
    formErrors = [];
    $('form.dropzone_single').each(validateSubmitForm);


    if(formErrors.length) {
        $('.nav-tabs li').removeClass('active');
        $('.nav-tabs .tab-' + formErrors[0] + ' a').click();
    } else {

        var obj = {};

        // Convert Array string with comma with every element
        formArray.forEach(function(items, key) {

            $.each(items, function(k, value) {
                if(!obj[k]) {
                    obj[k] = '';
                }
                obj[k] += value + ',';
            });
        });

        var formData = new FormData();
        $.each(obj, function(k, value) {
            var temp = value.substr(0, value.length - 1);
            formData.append(k, temp);
        });

        formData.append('file', fileUpload);

        // Request to server
        $.ajax({
            url: action_url,
            data: formData,
            type: 'POST',
            contentType: false,
            processData: false,
            success : function(data, e, event){
                
                data = JSON.parse(data);
                switch(data.status) {
                    case 'error':
                        if(language_code){
                            loadFormError($('#form_' + language_code), data.msg);
                        } else {
                            loadFormError($('#form_en'), data.msg);
                        }
                        
                        break;
                    case 'success':
                        if(!language_code){
                            $('form.appForm').each(function() {
                                resetForm($(this));
                            });
                            $('form.dropzone').empty();
                            
                        }
                        toastr.success(data.msg);   
                        break;
                    case 'session_timeout':
                        window.location = data.url_redirect;
                        break;
                }
            }
        })
    }
}

function convertToCommaSTring(array) {
    var obj = {};
    array.forEach(function(items, key) {

        $.each(object, function(item, key) {
            obj[k] += item + ',';
        });
    });
    return obj;
}

function showFormError(formArea, arrErrors){
    formArea.find('label.validation-error-label').remove();
    for(var x in arrErrors){
        formArea.find('#form_' + x).parents('div[class^="col-lg"]').append('<label id="form_email-error" class="validation-error-label" for="form_' + x + '">' + arrErrors[x] + '</label>');
    }

}

function addErrorMessageForm(dataForm) {
    var errorMsg = [];

    if(!dataForm['name']) {
        errorMsg['name'] = __('The field Name is required.', [], 'The field Name is required.');
    }

    if(errorMsg['name']) {
        formErrors.push(dataForm['language_code']);
        loadFormError($('#form_' + dataForm['language_code']), errorMsg);
        return true;
    }
    // formArray.push({dataForm['language_code'] : dataForm});
    formArray.push(dataForm);
    return false;
}

function validateSubmitForm(index, element, array) {
    var checkedArray = ['name', 'title', 'url', 'description'];
    var serializedData = $(this).serialize().split('&');
    
    var dataForm = {};
    serializedData.forEach(function(item, index) {
        
        var matched = item.match(/(.*)\=(.*)/);
        if(matched.length) {
            dataForm[matched[1]] = matched[2];
        }
    });

    // Check default is en
    if(dataForm['language_code'] == 'en') {
        
        if(addErrorMessageForm(dataForm)) {
            return false;
        }
        
    } else {
        var isEdited = false;
        checkedArray.forEach(function(item, key) {
            
            if(dataForm[item]) {
                isEdited = true;
                return;
            }
        });
        
        if(isEdited) {
            if(addErrorMessageForm(dataForm)) {
                return false;
            }
        }
    }
    
}

/*====================================================
 * Manual Submit Form
 * Input: Form Element Attribute
 * Ex: $(#appForm)
 *====================================================*/
function submitForm(form){
    form.submit();
    return false;
}
/*====================================================
 * Manual Submit Form
 * Input: Form Element Attribute
 * Ex: $(#appForm)
 *====================================================*/
function resetForm(form){
    form[0].reset();    
    //============== Update Selectbox ===========
    $('.select').select2();
    //============== Remove Error Message ===========
    form.find('label.validation-error-label').remove();
    //============== Update Checkbox ===========
    $.uniform.update();

}


/*====================================================
 * Load Panel Error Massage
 *====================================================*/
function load_alert_msg(element, message){
    var xhtml = '<div class="alert alert-danger alert-bordered">';
    xhtml += '<button type="button" class="close" data-dismiss="alert"><span>×</span><span class="sr-only">Close</span></button>';
    xhtml += '<span class="text-semibold msg_content">' + message + '</span></div>';
    element.html(xhtml).fadeOut(200).fadeIn();
}

/*====================================================
 * Load Input Error Massge Like Jquery Validate
 *====================================================*/
function loadFormError(formArea, arrErrors){
    formArea.find('label.validation-error-label').remove();

    for(var x in arrErrors){
        formArea.find('#form_' + x).parents('div[class^="col-lg"]').append('<label id="form_email-error" class="validation-error-label" for="form_' + x + '">' + arrErrors[x] + '</label>');
    }

}

/*====================================================
 * Jquery Validate Form
 * rules : {
 *               input_name: {
 *                  rule_name: rule_value,
 *              }
 *           } 
 * messages : {
 *              input_name: {
 *                  rule_name: "message",
 *              },
 *              input_name: "message"
 *           }
 *====================================================*/
function form_validate(rules, messages){
    if(typeof(rules) == 'undefined')
        rules = {};
    
    $('.form-validate-jquery').each(function(){
    	$(this).validate({
            ignore: 'input[type=hidden], .select2-input', // ignore hidden fields
            errorClass: 'validation-error-label',
            successClass: 'validation-valid-label',
            highlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            },
            unhighlight: function(element, errorClass) {
                $(element).removeClass(errorClass);
            },

            // Different components require proper error label placement
            errorPlacement: function(error, element) {
                // Styled checkboxes, radios, bootstrap switch
                if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container')) {
                    if(element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                        error.appendTo( element.parent().parent().parent().parent() );
                    }else {
                        error.appendTo( element.parent().parent().parent().parent().parent() );
                    }
                }
                // Unstyled checkboxes, radios
                else if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
                    error.appendTo( element.parent().parent().parent() );
                }
                // Inline checkboxes, radios
                else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                    error.appendTo( element.parent().parent() );
                }
                // Input group, styled file input
                else if (element.parent().hasClass('uploader') || element.parents().hasClass('input-group')) {
                    error.appendTo( element.parent().parent() );
                }
                else {
                    error.appendTo(element.parent());
                }
            },
            validClass: "validation-valid-label",
            success: function(label) {
                //label.addClass("validation-valid-label").text("Success.")
                label.remove();
            },
            rules: rules,
            messages: messages
        });
    	
    	$('#reset').on('click', function() {
    	    $(this).resetForm();
    	});
    	
    });
   
}

/*==============================================
 * Attach File By Dropzone
 *==============================================*/
function attachFileByDropzone(action, image) {
    if(action == 'update') {
    
        var image_url = img_url + '/' + image ;

        // Dropzone class:
        var myDropzone = new Dropzone("#dropzone_single", {
            paramName: "file", // The name that will be used to transfer the file
            maxFilesize: 2, // MB
            maxFiles: 1,
            thumbnailWidth: 480,
            thumbnailHeight: 240,
            dictDefaultMessage: __('Drop image to upload <span>or CLICK</span>', [], 'Drop image to upload <span>or CLICK</span>'),
            autoProcessQueue: false,
            init: function() {
                this.on('addedfile', function(file){

                    if (this.files.length > 0) {
                      this.removeFile(this.files[0]);
                    }
                    fileUpload = file;
                });


            }
        });
        // Create the mock file:
        var mockFile = { name: "Filename", size: 12345 };

        // Call the default addedfile event handler
        myDropzone.emit("addedfile", mockFile);

        // And optionally show the thumbnail of the file:
        myDropzone.emit("thumbnail", mockFile, image_url);

        myDropzone.files.push(mockFile);
    } else {
        $("#dropzone_single").dropzone({
            paramName: "file", // The name that will be used to transfer the file
            maxFilesize: 2, // MB
            maxFiles: 1,
            thumbnailWidth: 480,
            thumbnailHeight: 240,
            dictDefaultMessage: __('Drop image to upload <span>or CLICK</span>', [], 'Drop image to upload <span>or CLICK</span>'),
            autoProcessQueue: false,
            previewTemplate: `<div class="dz-preview dz-file-preview">
                                  <div class="dz-details">
                                    <div class="dz-filename"><span data-dz-name></span></div>
                                    <div class="dz-size" data-dz-size></div>
                                    <img data-dz-thumbnail />
                                  </div>
                                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                                  <div class="dz-success-mark"><span>✔</span></div>
                                  <div class="dz-error-mark"><span>✘</span></div>
                                  <div class="dz-error-message"><span data-dz-errormessage></span></div>
                                </div>`,
            init: function() {
                this.on('addedfile', function(file){
                    if (this.files.length > 1) {
                      this.removeFile(this.files[0]);
                    }
                    fileUpload = file;
                });


            }
        });
    }
}

/*================================================
 * LIST DATA - AJAX UPDATE STATUS ONE ITEM
 *================================================*/
function singleStatus(elem, url, table){
    var id = elem.parents('tr').attr('id');
    var status = elem.attr('data-status');
    $.post(url, {id : id, status : status}, function(data){
        switch(data.status) {
            case 'error':
                toastr.error(data.msg);   
                break;
            case 'success':
                table.draw(false);
                $('#ckb-all').attr('checked', false); 
                toastr.success(data.msg);   
                break;
            case 'session_timeout':
                window.location = data.url_redirect;
                break;
        }
    }, 'json')
}

/*================================================
 * LIST DATA - AJAX DELETE ONE ITEM
 *================================================*/
function singleDelete(elem, url, table, msg){
    msg = (typeof msg==='undefined')?__('Are you sure to delete this row?', null, 'Are you sure to delete this row?'):msg;
    var id = elem.parents('tr').attr('id');
    var index = elem.parents('tr').index();
    id = (typeof id!='undefined')?id:table.find('tbody').find('tr:eq('+ index +')').attr('id');
    bootbox.confirm(msg, function(result) {
        if(result){
            $.post(url, {id : id}, function(data){
                switch(data.status) {
                    case 'error':
                        toastr.error(data.msg);   
                        break;
                    case 'success':
                        table.draw(false);
                        $('#ckb-all').attr('checked', false); 
                        toastr.success(data.msg);   
                        break;
                    case 'session_timeout':
                        window.location = data.url_redirect;
                        break;
                }
            }, 'json')
        }
    })
}

/*================================================
 * Function translate language like function __ of fuelphp
 *================================================*/
function __(origin_content, group_content, default_content){
    var content = language_translate[origin_content];
    if(typeof content == 'undefined'){
        return default_content;
    }
    return content;
}

