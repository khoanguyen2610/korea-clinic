import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'angular-2-local-storage';
import { EquipmentService  } from '../../../../../services';
import { Configuration } from '../../../../../shared';
import * as moment from 'moment';

declare let initMeta: any;
// declare let moment: any;

@Component({
	selector: 'app-public-equipment-detail',
	templateUrl: './equipment-detail.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentDetailComponent implements OnInit {
	private subscription: Subscription;

	_params: any;
	modules: any;
	equipments: Array<any> = [];
	Item: Array<any> = [];
	controller: string = 'trang-thiet-bi';
	language_code: string;
	news_format_date: string = this._Configuration.news_format_date;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _EquipmentService: EquipmentService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService,
		private _TranslateService: TranslateService
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
		// Translate Module Service
		this._TranslateService.get('MODULE').subscribe((res: string) => {
			this.modules = res;
		});


	}

	ngOnInit() {
		this.getDetail();
		this.getListAll();

	}

	getAction(){
		return 'detail';
	}

	getDetail() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.language_code);
		params.set('image_resize_width', '1440');
		this._EquipmentService.getByID(null, params).subscribe(res => {
			if (res.status == 'success') {
				let item = res.data;
				this.Item = item;

				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					this._Configuration[meta] = this.Item[meta];
					//set meta data
					initMeta(meta, this.Item[meta]);
				});
			}
		});
	}

	getListAll() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status', 'active');

		this._EquipmentService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				this.equipments = res.data;
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
