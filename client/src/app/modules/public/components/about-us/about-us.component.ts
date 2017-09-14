import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { OptionsService } from './../../../../services';
import { Configuration } from '../../../../shared';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-about-us',
	templateUrl: './about-us.component.html',
	providers: [OptionsService]
})


export class AboutUsComponent implements OnInit {
	private subscription: Subscription;

	Item: Array<any> = [];
	_params: any;
	language_code: string;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _OptionsService: OptionsService,
		private _LocalStorageService: LocalStorageService,
		private _Configuration: Configuration
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		this.getDetailData();
	}

	getAction() {
		return 'detail';
	}

	getDetailData() {

		let params: URLSearchParams = new URLSearchParams();
		params.set('key', 'about_us');
		params.set('language_code', this.language_code);
		this._OptionsService.getByID(null, params).subscribe(res => {
			if (res.status == 'success') {
				this.Item = res.data;

				var metas = this._Configuration.metas;
				metas.forEach(meta => {
					this._Configuration[meta] = this.Item[meta];
				});

			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

