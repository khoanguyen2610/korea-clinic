import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../../shared';
import { AuthService, ServiceCategoryService } from '../../../../../services';


declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-service',
	templateUrl: './service.component.html',
	providers: [ ServiceCategoryService ]
})

export class ServiceComponent implements OnInit {

	Items: Array<any> = [];
	lang_code: string = this._Configuration.defaultLang;

	constructor(
		private _AuthService: AuthService,
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,

	) {
		//=============== Get Params On Url ===============


	}

	ngOnInit(){
		this.getListData();
	}

	ngAfterViewInit(){

	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('recursive', 'false');
		params.set('language_code', this._Configuration.language_code);;
		this._ServiceCategoryService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.Items = res.data;
				console.log(this.Items)
			}
		});
	}


}
