import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-admin-main-nav',
	templateUrl: './main-nav.component.html',
})

export class MainNavComponent implements OnInit {

	constructor(
	) {

	}

	ngOnInit() {
	}

	ngOnDestroy() {

	}
}
