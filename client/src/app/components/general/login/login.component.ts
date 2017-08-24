import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';


import { Configuration } from '../../../shared';
import { AuthService } from '../../../services';

declare let $: any;
declare let window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [ AuthService, LocalStorageService ]
})
export class LoginComponent implements OnInit {
	private subscription: Subscription;
	component_destroy = false;
	system_version?: String = '';
	validateErrors = {};
	Item = {};
	_queryParams = {};
  	constructor(private _Router: Router,
		private _Configuration: Configuration,
	 	private _ActivatedRoute: ActivatedRoute,
	 	private _AuthService: AuthService,
	 	private _LocalStorageService: LocalStorageService
	) {
  		this.system_version = _Configuration.system_version;

  		// Get params on URL
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => this._queryParams = param
		);

  		setInterval(() => {
			this.onCheckUserSession();
		}, 5000)
  	}

  	ngOnInit() {
  		
  	}

  	/*======================================
  	 * Check if login other tab || exist user sesion
  	 *======================================*/
  	onCheckUserSession(){
  		if(!this.component_destroy){
  			let now = new Date().getTime();
	  		let current_user_info = this._LocalStorageService.get('current_user_info');
			let user_session_start = this._LocalStorageService.get('user_session_start');
			let session_expired = this._Configuration.session_expired;
	  		if(current_user_info && now - +user_session_start < session_expired*60*60*1000 ){
	  			if(this._queryParams['callback_uri']){
	  				var callback_uri = this._queryParams['callback_uri'];
	  				//redirect when remote login auth like FB & google
	  				if(this._queryParams['oauth']){
	  					if (!/^(f|ht)tps?:\/\//i.test(callback_uri)) {
				          callback_uri = "http://" + callback_uri;
				        }
				        let res_param = {'vws_auth_id' : current_user_info['id'],
				        				'auth_request' : callback_uri, 
				        				'oauth' : 1,
				        				't' : Date.now()
				        				}
				        window.location = callback_uri + '?' + $.param(res_param);
				        callback_uri = '/home';
				        this._Router.navigate([callback_uri]);
	  				}
	  				this._Router.navigateByUrl(callback_uri);
	  			}else{
	  				this._Router.navigate(['/home']);
	  			}
	  		}
	  	}
  	}

  	/*======================================
  	 * Submit login
  	 *======================================*/
  	onSubmit(){
  		//Logout again before login
		var loading = setInterval(() => { $('.loading').show(); }, 500);
  		this._AuthService.clear_session().subscribe(ressponse => {
  			if (ressponse.status == 'success') {
	  			let paramData: URLSearchParams = new URLSearchParams();
				paramData.set('user_id', this.Item['user_id']);
				paramData.set('password', this.Item['password']);
				this._AuthService.login(paramData).subscribe(res => {
					clearInterval(loading);
					if (res.status == 'success') {
						if (res.data != null) {
		                    let now = new Date().getTime();
		                    this._LocalStorageService.set('current_user_info', res.data);
							this._LocalStorageService.set('user_session_start', now);
							//Redirect after login success
							if(this._queryParams['callback_uri']){
								var callback_uri = this._queryParams['callback_uri'];
				  				//redirect when remote login auth like FB & google
				  				if(this._queryParams['oauth']){
				  					if (!/^(f|ht)tps?:\/\//i.test(callback_uri)) {
							          callback_uri = "http://" + callback_uri;
							        }
							        let res_param = {'vws_auth_id' : res.data['id'],
							        				'auth_request' : callback_uri, 
							        				'oauth' : 1,
							        				't' : Date.now()
							        				}
							        window.location = callback_uri + '?' + $.param(res_param);
							        callback_uri = '/home';
							        this._Router.navigate([callback_uri]);
				  				}
				  				this._Router.navigateByUrl(callback_uri);
				  			}else{
				  				this._Router.navigate(['/home']);
				  			}
						}
					}else{
						this.validateErrors = res.error;
					}
					$('.loading').hide();
				});
			}
  		});
  	}

  	ngOnDestroy(){
  		this.component_destroy = true;
  	}

}
