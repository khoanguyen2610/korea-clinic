import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { Configuration } from '../../../../../shared';
import { AuthService, GalleryService } from '../../../../../services';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-gallery',
	templateUrl: './gallery.component.html',
	// providers: [GalleryService]
})

export class GalleryComponent implements OnInit {

	Items: Array<any> = [];
	// lang_code: string = this._Configuration.defaultLang;
	number_item: number = 4;
	module_name: string = 'gallery';

	// constructor(
	// 	private _AuthService: AuthService,
	// 	private _GalleryService: GalleryService,
	// 	private _Configuration: Configuration,

	// ) {
	// 	//=============== Get Params On Url ===============


	// }

	ngOnInit() {
		this.getListData();
	}

	ngAfterViewInit() {

	}

	getListData() {
		// let params: URLSearchParams = new URLSearchParams();
		// params.set('language_code', this.lang_code);
		// params.set('limit', String(this.number_item));
		// this._GalleryService.getListAll(params).subscribe(res => {
		// 	if (res.status == 'success') {
		// 		// Process Array include many array with 4 elements
		// 		if (res.data.length) {
		// 			this.Items = res.data;
		// 		}

		// 	}
		// });
	}

	getModuleNameByLang() {
		return this.module_name;
	}
}
