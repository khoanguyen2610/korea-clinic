import { Component, OnInit, Input } from '@angular/core';


declare let jQuery: any;

@Component({
	selector: 'app-public-general-chat',
	templateUrl: './chat.component.html',
})

export class ChatComponent implements OnInit {
	@Input() options: any;
	constructor(

	) {

	}

	ngOnInit() {
		(function(d, s, id) {
	      	var js, fjs = d.getElementsByTagName(s)[0];
	      	if (d.getElementById(id)) return;
	      	js = d.createElement(s);
	      	js.id = id;
	      	js.src = "//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.5";
	      	fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk'));
	    jQuery(document).ready(function() {
	      	jQuery(".chat_fb").click(function() {
        		jQuery('.fchat').toggle('slow');
	      	});
	    });
	}


	ngOnDestroy() {

	}
}