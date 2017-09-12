import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent } from '../general';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
	}


	ngOnDestroy() {

	}
}
