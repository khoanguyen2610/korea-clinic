import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-general-form-contact',
	templateUrl: './form-contact.component.html',
})

export class FormContactComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
		console.log('Contract Homepage');
	}


	ngOnDestroy() {

	}
}
