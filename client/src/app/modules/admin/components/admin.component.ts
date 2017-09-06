import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Http } from '@angular/http';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Configuration, Theme } from './../../../shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ScriptService } from './../../../services';
import { ToastrConfig } from 'ngx-toastr';

declare var $: any;
declare var window: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'app-admin-root',
	templateUrl: './admin.component.html',
	providers: [AuthService]
})

export class AdminComponent  {
	curRouting?: string;
	checkModuleAdmin: boolean = false;
	hasHeader = true;
	current_user_info = {};
	activeRoute = false;
	is_last = false;
	constructor(private _Http: Http,
		_HttpInterceptorService: HttpInterceptorService,
		// private _AwesomeHttpService: AwesomeHttpService,
		// private _LoadingAnimateService: LoadingAnimateService,
		private _Configuration: Configuration,
		private _AuthService: AuthService,
		private _ScriptService: ScriptService,
		private _Router: Router,
		private _ActivatedRoute: ActivatedRoute,
		private _SlimLoadingBarService: SlimLoadingBarService,
		private _ToastrConfig: ToastrConfig
	) {


		// _ScriptService.load('filepicker').then(data => {
        //     console.log('script loaded ', data);
        // }).catch(error => console.log(error));

		//==== District 51
		var current_href = window.location.href;
        let current_domain = window.location.origin;
        current_href = current_href.replace(current_domain, '');
		this.current_user_info = this._AuthService.getCurrent();

		if (!current_href.match(/^\/login.*/i) && !current_href.match(/^\/logout.*/i) && !current_href.match(/^\/forgot\-password.*/i)) {
			this._SlimLoadingBarService.start();
		}

		// this._Router.events.subscribe((val) => {
		// 	if (current_href.match(/^\/login.*/i) || current_href.match(/^\/logout.*/i) || current_href.match(/^\/forgot\-password.*/i)) {
		// 	    this.activeRoute = true;
		// 	    this.onCheckUserSession(current_href, true);
		// 	}
		// 	if(this.current_user_info){
		// 		this.activeRoute = true;
		// 	}
		// });

		this.onSetGobalScript();

		/*==========================================
		 * Config ToastrConfig
		 *==========================================*/
		this._ToastrConfig.positionClass = "toast-bottom-right";
		this._ToastrConfig.timeOut = 5000;
		this._ToastrConfig.maxOpened = 7;
		this._ToastrConfig.progressBar = true;
		this._ToastrConfig.closeButton = true;
		this._ToastrConfig.preventDuplicates = true;


		let self = this;
		let number_https = 0;

		// this._AwesomeHttpService.addRequestInterceptor({
  //           beforeRequest(): void {
		// 		if (self.activeRoute) {
		// 			self._LoadingAnimateService.setValue(true);

		// 		}
		// 		number_https++;
		// 		if (!number_https) {
		// 			self._SlimLoadingBarService.start();
		// 		}
  //           }
  //       });

		// this._AwesomeHttpService.addResponseSuccessInterceptor({
  //           afterResponse(response): void {

		// 		setTimeout(() => {
		// 			self._LoadingAnimateService.setValue(false);
		// 		}, 500);
		// 		number_https--;
		// 		if (!number_https) {
		// 			self._SlimLoadingBarService.complete();
		// 		}
  //           }
  //       });

		_HttpInterceptorService.request().addInterceptor((data, method) => {
			if(this.activeRoute){
				this.is_last = false;
				$('.loading').show();
				// this._LoadingAnimateService.setValue(true);

				setTimeout(() => {
					if (this.is_last) {
						setTimeout(() => {
							this._SlimLoadingBarService.complete();
							$('.loading').hide();
						}, 500);
					}
				}, 1500);
				return data;
			}else{
				return null;
			}
		});

		_HttpInterceptorService.response().addInterceptor((res, method) => {
			this.is_last = true;
			setTimeout(() => {
				// this._LoadingAnimateService.setValue(false);

			}, 500)
			if(this.activeRoute){
				return res;
			}
			return null;
		});



		// setInterval(() => {
		// 	let routing = this._Router.url;
		// 	this.onCheckUserSession(routing);
		// }, 3000)
	}

	public toasterconfig : ToasterConfig =
        new ToasterConfig({
        		limit: 7,
             	showCloseButton: true,
			  	positionClass: "toast-bottom-right",
			  	timeout: "5000"
        });


    ngAfterContentChecked() {
    	let routing = this._Router.url;
		if(this.curRouting != routing){
			this.curRouting = routing;
			if(routing.match(/^\/admin/i)) this.checkModuleAdmin = true;

			// this.hasHeader = true;
	    	// if (routing.match(/^\/login.*/i) || routing.match(/^\/logout.*/i) || routing.match(/^\/forgot\-password.*/i)) {
			//     this.hasHeader = false;
			// }
			this.onCheckUserSession(routing, true);
			//
			//
		}
    }


    onCheckUserSession(routing, refill = null){
    	if (!routing.match(/^\/admin\/auth\/login.*/i) ) {
    		this._AuthService.checkUserSession(routing, refill);
		}
    }

    onSetGobalScript(){
    	$.fn.dataTable.ext.errMode = 'none';
    	$.extend($.fn.dataTable.defaults, {
	    	autoWidth: true,
			processing: true,
	    	dom: '<"datatable-header clearfix"fl><"datatable-scroll table-responsive clearfix"tr><"datatable-footer clearfix"ip>',
	    	language: {
	      		paginate: {
	        		'first': 'First',
	        		'last': 'Last',
	        		'next': '&rarr;',
	        		'previous': '&larr;'
	      		},
    //     		processing: '<div class="box-loading"><div class="cssload"><span></span></div></div>',
				// lengthMenu: "_MENU_ <span>件表示</span>",
				// search: "<span>検索:</span> _INPUT_",
				// sEmptyTable: "データはありません。",
				// sInfo: " _TOTAL_ 件中 _START_ から _END_ まで表示",
				// sInfoEmpty: " 0 件中 0 から 0 まで表示",
				// sInfoFiltered: "（全 _MAX_ 件より抽出）",
				// sInfoPostFix: "",
				// sUrl: "",
	    	}
	  	});

    }

	//
    // onCheckUserSession(routing, refill = null){
    // 	if (!routing.match(/^\/login.*/i) && !routing.match(/^\/logout.*/i) && !routing.match(/^\/forgot\-password.*/i) && !routing.match(/^\/$/i)) {
    // 		this._AuthService.checkUserSession(routing, refill);
	// 	}
    // }

}
