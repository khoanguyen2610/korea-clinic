var Login = function () {
    return {
        //main function to initiate the module
        init: function () {
            // init background slide images
		    $.backstretch([
		        "/assets/admin/pages/media/bg/1.jpg",
		        "/assets/admin/pages/media/bg/2.jpg",
		        "/assets/admin/pages/media/bg/3.jpg",
		        "/assets/admin/pages/media/bg/4.jpg"
		        ], {
		          fade: 1000,
		          duration: 8000
		    	}
        	);
        }
    };

}();

jQuery(document).ready(function() {
    Login.init();
});
