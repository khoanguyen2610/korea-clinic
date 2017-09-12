// Copyright (c) 2015, Fujana Solutions - Moritz Maleck. All rights reserved.
// For licensing, see LICENSE.md

CKEDITOR.plugins.add( 'imageuploader', {
    init: function( editor ) {
        // editor.config.filebrowserBrowseUrl = 'http://localhost/korea-clinic/client/src/assets/admin/global/plugins/ckeditor/plugins/imageuploader/imgbrowser.php';
        editor.config.filebrowserBrowseUrl = 'assets/admin/global/plugins/ckeditor/plugins/imageuploader/imgbrowser.php';
    }
});
