import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';

import { Configuration } from '../../../shared';
import { GeneralService, AuthService } from '../../../services';

declare let $: any;
declare let general: any;

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	providers: [GeneralService]
})
export class BreadcrumbComponent implements OnInit {
	private subscription: Subscription;
	breadcrumb?: any = [];
	curRouting?: string;
	_params = {};
	_queryParams = {};

	constructor(private _Router: Router,
		private _Configuration: Configuration,
	 	private _ActivatedRoute: ActivatedRoute,
	 	private _GeneralService: GeneralService
	) {
		
	}

	ngOnInit() {

	}

	ngAfterViewInit(){
	    
	}


    ngAfterContentChecked(){
		this.generateBreadCrumb();
	}

	/*====================================================
	 * Generate BreadCrumb from API
	 *====================================================*/
	generateBreadCrumb(stop?: any){

		let routing = this._Router.url;
		if(this.curRouting != routing){
    		this.curRouting = routing
			// subscribe to router event
			this.subscription = this._ActivatedRoute.params.subscribe(
				(param: any) => {
					this._params = param;

			});
			this._ActivatedRoute.queryParams.subscribe(
				(param: any) => {
					this._queryParams = param;

			});		
			
			/*==============================================
			 * Get List Breadcrumb
			 *==============================================*/
			var params: URLSearchParams = new URLSearchParams();
			params.set('route_url', routing);
			params.set('route_query_param', JSON.stringify(this._queryParams));
			params.set('route_param', JSON.stringify(this._params));
			this._GeneralService.getBreadCrumb(params).subscribe(res => {
				if (res.status == 'success') {
					if(res.data != null){
						this.breadcrumb = res.data;
					}
				}
			});
		}
	}

	ngOnDestroy(){
		
	}

}
