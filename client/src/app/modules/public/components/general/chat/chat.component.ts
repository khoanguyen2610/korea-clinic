import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


declare let jQuery: any;
declare let moment: any;

@Component({
	selector: 'app-public-general-chat',
	templateUrl: './chat.component.html',
})

export class ChatComponent implements OnInit {

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
