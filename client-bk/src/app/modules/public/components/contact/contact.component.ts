import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-contact',
	templateUrl: './contact.component.html',
})

export class ContactComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
		console.log('Public Header');
	}


	ngOnDestroy() {

	}
}
