import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, StaffService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-general-staff-list',
	templateUrl: './staff-list.component.html',
	providers: [ StaffService ]
})

export class StaffListComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;

	controller: string = 'nhan-vien';
	employees: Array<any> = [];
	_params: any
	queryParams: any;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _StaffService: StaffService,
		private _Configuration: Configuration
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		);
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('item_status','acitve');
		this._StaffService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.employees = res.data;
			}
		});
		console.log('StaffListComponent');
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
	}
}
