import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { StaffService } from '../../../../../services';
import { Configuration } from '../../../../../shared';


declare let initMeta: any;
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

		let params: URLSearchParams = new URLSearchParams();
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.language_code);
		this._StaffService.getByID(null, params).subscribe(res => {
			if(res.status == 'success'){
				this.Item = res.data;

				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					this._Configuration[meta] = this.Item[meta];//set meta data
					initMeta(meta, this.Item[meta]);
				});
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
