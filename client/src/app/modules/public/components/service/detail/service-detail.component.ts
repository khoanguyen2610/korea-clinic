import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, ServiceService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-service-detail',
	templateUrl: './service-detail.component.html',
	providers: [ ServiceService ]
})

export class ServiceDetailComponent implements OnInit {
	private subscription: Subscription;

	_params: any
	Item:Array<any> = [];
	lang_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _ServiceService: ServiceService,
		private _Configuration: Configuration,
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.lang_code = _Configuration.defaultLang;
	}

	ngOnInit() {
		if(this._params.lang_code){
			this.lang_code = this._params.lang_code;
		}

		let params: URLSearchParams = new URLSearchParams();
		params.set('item_key', this._params.item_key);
		params.set('language_code', this.lang_code);
		this._ServiceService.getByID(undefined, params).subscribe(res => {
			if(res.status == 'success'){
				this.Item = res.data;
			}
		});
		console.log('ServiceDetailComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
