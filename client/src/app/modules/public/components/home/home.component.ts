import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../shared';
import { AuthService, SlideService } from '../../../../services';


declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home',
	templateUrl: './home.component.html',
	providers: [ SlideService ]
})

export class HomeComponent implements OnInit {

	constructor(
		private _SlideService: SlideService
	) {

	}

	ngOnInit() {
		console.log('Public Homepage');
	}


	ngOnDestroy() {

	}
}
