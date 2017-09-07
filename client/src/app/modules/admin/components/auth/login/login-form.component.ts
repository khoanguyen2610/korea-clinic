import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Configuration, Theme } from '../../../../../shared';
import { AuthService, ScriptService } from '../../../../../services';
import { URLSearchParams } from '@angular/http';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'angular-2-local-storage';

declare var $: any;
declare var window: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'app-auth-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: [
		'../../../../../../assets/admin/global/plugins/font-awesome/css/font-awesome.min.css',
        '../../../../../../assets/admin/global/plugins/simple-line-icons/simple-line-icons.min.css',
        '../../../../../../assets/admin/global/plugins/bootstrap/css/bootstrap.min.css',
        '../../../../../../assets/admin/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
        '../../../../../../assets/admin/global/plugins/select2/css/select2.min.css',
        '../../../../../../assets/admin/global/plugins/select2/css/select2-bootstrap.min.css',
        '../../../../../../assets/admin/global/css/components.min.css',
        '../../../../../../assets/admin/global/css/plugins.min.css',
		'../../../../../../assets/admin/pages/css/login-4.min.css',
		'../../../../../../assets/admin/css/custom.css'
	],
	providers: [AuthService],
	encapsulation: ViewEncapsulation.Native
})

export class LoginFormComponent  {
	private subscription: Subscription;
	_queryParams = {};
	Item: Array<any> = [];
	is_validated = false;
	validate_message: string = "";

	constructor(
		private _Configuration: Configuration,
		private _AuthService: AuthService,
		private _ScriptService: ScriptService,
		private _LocalStorageService: LocalStorageService,
		private _Router: Router,
	 	private _ActivatedRoute: ActivatedRoute,
	) {
		this._ScriptService.load('backstretch').then(data => {
			this._ScriptService.load('login-4').then(data => {
				//code
			}).catch(error => console.log(error));
		}).catch(error => console.log(error));


		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => this._queryParams = param
		);

	}

	onSubmit(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			console.log(this.Item);
			paramData.set('username', this.Item['username']);
			paramData.set('password', this.Item['password']);
			this._AuthService.login(paramData).subscribe(res => {
				if (res.status == 'success') {
					$('div.backstretch').remove();


					let now = new Date().getTime();
					this._LocalStorageService.set('current_user_info', res.data);
					this._LocalStorageService.set('user_session_start', now);
					//Redirect after login success
					if(this._queryParams['callback_uri']){
						var callback_uri = this._queryParams['callback_uri'];
						this._Router.navigateByUrl(callback_uri);
					}else{
						this._Router.navigate(['/admin/service/list']);
					}
				}

				if(res.status == 'error' && res.code == 3000){
					this.validate_message = res.error.msg_error;
				}
			});
		}else{
			this.is_validated = true;
		}

	}


    ngAfterContentChecked() {

    }


}
