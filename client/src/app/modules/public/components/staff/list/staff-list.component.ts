import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, StaffService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-general-staff-list',
	templateUrl: './staff-list.component.html',
	providers: [ StaffService ]
})

export class StaffListComponent implements OnInit {
	controller: string = 'nhan-vien';

	constructor(
		private _StaffService: StaffService,
	) {

	}

	ngOnInit() {
		console.log('StaffListComponent');
	}


	ngOnDestroy() {

	}
}
