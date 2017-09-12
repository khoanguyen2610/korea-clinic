import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-admin-header',
	templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
	@ViewChild('modalchangepassword') modalchangepassword: ModalComponent;

	info?: any = {};
	current_user_info?: any;
	validateErrors?: any = {};
	constructor(
		private _AuthService: AuthService,
		private _ToastrService: ToastrService
	) {
	}

	ngOnInit() {
		/*==============================================
		 * Get current user information
		 *==============================================*/
		this.current_user_info = this._AuthService.getCurrent();
	}

	onOpenChangePassword(){
		this.modalchangepassword.open();
	}

	onChangePassword(form: NgForm){
		console.log('onChangePassword');
		let paramsData: URLSearchParams = new URLSearchParams();
  		paramsData.set('id', this.current_user_info['id']);
  		paramsData.set('password', this.info['password']);
  		paramsData.set('new_password', this.info['new_password']);
  		paramsData.set('re_password', this.info['re_password']);

  		this._AuthService.change_password(paramsData).subscribe(res => {
  			if(res.status == 'success'){
  				this.modalchangepassword.close();
  				this._ToastrService.success('Password has been changed successfully');
          		form.reset();
          		this.validateErrors = {};
  			} else {
  				this.validateErrors = res.error;
  			}
  		})
	}

	/*===================================================
	 * Logout system
	 *===================================================*/
  	logout(){
  		this._AuthService.logout('/admin/auth/login');
		return false;
  	}


	ngOnDestroy() {

	}
}
