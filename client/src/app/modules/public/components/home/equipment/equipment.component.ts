import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { AuthService, EquipmentService } from '../../../../../services';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-equipment',
	templateUrl: './equipment.component.html',
	providers: [EquipmentService]
})

export class EquipmentComponent implements OnInit {
	Items: Array<any> = [];
	controller: string = 'thiet-bi';
	language_code: string = this._Configuration.defaultLang;
	number_item: number = 4;
	module_name: string = 'equipment';

	constructor(
		private _AuthService: AuthService,
		private _EquipmentService: EquipmentService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		//=============== Get Params On Url ===============


		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		this.getListData();
	}

	ngAfterViewInit() {

	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this._Configuration.language_code);
		params.set('limit', String(this.number_item));
		this._EquipmentService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if (res.data.length) {
					this.Items = res.data;
				}

			}
		});
	}

	getModuleNameByLang() {
		return this.module_name;
	}
}
