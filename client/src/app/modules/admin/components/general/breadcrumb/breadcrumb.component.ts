import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-admin-breadcrumb',
	templateUrl: './breadcrumb.component.html',
})

export class BreadcrumbComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
	}


	ngOnDestroy() {

	}
}
