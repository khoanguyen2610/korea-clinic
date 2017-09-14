import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-general-footer',
	templateUrl: './footer.component.html',
})

export class FooterComponent implements OnInit {
	@Input() options: any;
	constructor(

	) {

	}

	ngOnInit() {
	}


	ngOnDestroy() {

	}
}
