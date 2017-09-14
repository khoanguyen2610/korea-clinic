import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { PartnerService } from '../../../../../services';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-partner',
	templateUrl: './partner.component.html',
	providers: [ PartnerService ]
})

export class PartnerComponent implements OnInit {
	Items: Array<any> = [];
	language_code: string;

	constructor(
		private _PartnerService: PartnerService,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('image_resize_width', '248');
		params.set('image_resize_height', '124');
		params.set('item_status', 'active');
		this._PartnerService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.Items = res.data;
			}
		});
	}

}
