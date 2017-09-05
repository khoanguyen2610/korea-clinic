import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../shared';
import { AuthService } from '../../../../services';


declare let jQuery: any;
declare let window: any;

@Component({
	selector: 'app-public-home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

	constructor(
	) {

	}

	ngOnInit() {

	}


	ngOnDestroy() {

	}
}
