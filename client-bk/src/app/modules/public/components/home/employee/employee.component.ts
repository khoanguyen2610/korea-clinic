import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-employee',
	templateUrl: './employee.component.html',
})

export class EmployeeComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
		console.log('Public Homepage');
	}


	ngOnDestroy() {

	}
}
