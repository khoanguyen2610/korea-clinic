<?php
    $linkCreate     = \Uri::create('system/language/create');
    $linkBack       = \Uri::create('system/language');
    $linkExport     = \Uri::create('system/language/import_translate');
    $linkGenerate   = \Uri::create('system/language/generate_translate');
    
    $xhtmlButton = '';
    switch ($action) {
        case 'index':
            $xhtmlButton = '
                            <a href="'.$linkGenerate.'" id="btn-generate-file"  class="btn border-slate text-slate-800 btn-flat">
                                <i class="icon-file-plus position-left"></i>' . __('Generate File Translate', array(), 'Generate File Translate') . '
                            </a>
            				<a href="'.$linkExport.'" id="btn-submit-form"  class="btn border-slate text-slate-800 btn-flat">
                                <i class="icon-database-insert position-left"></i>' . __('Import', array(), 'Import') . '
                            </a>
            				<a href="' . $linkCreate . '" class="btn border-slate text-slate-800 btn-flat">
                                <i class="icon-plus-circle2 position-left"></i>' . __('Create', array(), 'Create') . '
                            </a>';
            break;
        case 'create':
        case 'update':
            $xhtmlButton = '<a href="#" id="btn-submit-form" onclick="submitForm($(\'#appForm\'))"class="btn border-slate text-slate-800 btn-flat">
                                <i class="icon-floppy-disk position-left"></i>' . __('Save', array(), 'Save') . '
                            </a>
                            <a href="' . $linkBack . '" class="btn border-slate text-slate-800 btn-flat">
                                <i class="icon-backward position-left"></i>' . __('Back', array(), 'Back') . '
                            </a>';
            break;
        default:
            # code...
            break;
    }
?>
<div class="page-header">
    <div class="page-header-content">
        <div class="page-title">
            <h4><span class="text-semibold"><?php echo isset($title)?$title:'';?></span><?php echo isset($sub_title)?' - ' . $sub_title:'';?></h4>
        </div>
        <div class="heading-elements">
            <div class="heading-btn-group">
                <?php echo $xhtmlButton;?>
            </div>
        </div>
    </div>
</div>