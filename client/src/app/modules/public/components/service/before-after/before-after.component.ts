import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { AuthService, BeforeAfterService, ServiceService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-before-after',
	templateUrl: './before-after.component.html',
	providers: [ BeforeAfterService, ServiceService ]
})

export class BeforeAfterComponent implements OnInit {
	items: Array<any> = [];
	services: Array<any> = [];
	language_code: string;
	module_name: string = 'beforeafter';

	constructor(
		private _BeforeAfterService: BeforeAfterService,
		private _Configuration: Configuration,
		private _ServiceService: ServiceService,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._ServiceService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.services = res.data;
			}
		});

		params.set('image_resize_width', '1024');
		this._BeforeAfterService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.items = res.data;
			}
		});
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {

	}
}
