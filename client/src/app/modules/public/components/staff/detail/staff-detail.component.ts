import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, StaffService } from '../../../../../services';
import { Configuration } from '../../../../../shared';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-staff-detail',
	templateUrl: './staff-detail.component.html',
	providers: [ StaffService ]
})

export class StaffDetailComponent implements OnInit {
	private subscription: Subscription;

	Item:Array<any> = [];
	_params: any;
	controller: string = 'nhan-vien';
	language_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _StaffService: StaffService,
		private _LocalStorageService: LocalStorageService,
		private _Configuration: Configuration
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'staff';
		}
	}

	ngOnInit() {
		this.getDetailData();
	}

	getAction(){
		return 'detail';
	}

	getDetailData() {
		console.log(this._Configuration.language_code);
		let params: URLSearchParams = new URLSearchParams();
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.language_code);
		this._StaffService.getByID(null, params).subscribe(res => {
			if(res.status == 'success'){
				this.Item = res.data;
				console.log(this.Item)
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
