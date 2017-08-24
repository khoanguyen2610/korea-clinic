import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { GeneralService, AuthService } from '../../../services';

declare let $: any;
declare let general: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	providers: [GeneralService, LocalStorageService, AuthService]
})
export class HeaderComponent implements OnInit {
	private subscription: Subscription;
	breadcrumb?: any = [];
	curRouting?: string;
	departmentMenu?: Array<any>;
	requestMenu?: Array<any>;
	current_user_info?: any;
	info = {};
	_params = {};
	_queryParams = {};
	userDepartment?: Array<any>;
	validateErrors = {};
	flag_apply_script = true;
	meetingroom_login_api:string = "";

	@ViewChild('modal') modal: ModalComponent;

	constructor(private _Router: Router,
		private _Configuration: Configuration,
	 	private _ActivatedRoute: ActivatedRoute,
	 	private _GeneralService: GeneralService,
	 	private _LocalStorageService: LocalStorageService,
	 	private _AuthService: AuthService,
	 	private _ToastrService: ToastrService
	) {


		// this.initData();
		// this.subscription = _ActivatedRoute.params.subscribe((param: any) => {
		this._Router.events.subscribe((val) => {
	        // Remove Old & Trash HTML
	        $('div[id^="ascrail"]').remove();
	        $('div[role="tooltip"]').remove();
	        var repeat:number = 0;
	        var loadInterval = setInterval(() => {
									this.flag_apply_script = true;
									this.applyScript();
									repeat++;
									if(repeat >= 8){
										clearInterval(loadInterval);
									}
								}, 800);

			// setTimeout(() => {
			// 	this.flag_apply_script = true;
			// 	this.applyScript();
			// }, 500)
			// setTimeout(() => {
			// 	this.flag_apply_script = true;
			// 	this.applyScript();
			// }, 2000)
			/*==============================================
			 * Get List Department & Menu Master
			 *==============================================*/
			if(this.current_user_info){
				var params: URLSearchParams = new URLSearchParams();
				this._GeneralService.getDepartmentMenu(params).subscribe(res => {
					if (res.status == 'success') {
						if(res.data != null){
							this.departmentMenu = res.data;
						}
					}
				});

				if(this.current_user_info && this._Configuration.meetingroom_active){
            let res_param = {'redirect': true,
                                'vws_auth_id' : this.current_user_info['id'],
                                'auth_request' : 'http://vws.vision-vietnam.com',
                                'oauth' : 1,
                                't' : Date.now()
                                }
            this.meetingroom_login_api = _Configuration.meetingroom_login_api + '?' + $.param(res_param);
        }
			}

			/*==============================================
			 * Get List Request Menu Master
			 *==============================================*/
			if(this.current_user_info){
				var params: URLSearchParams = new URLSearchParams();
				this._GeneralService.getRequestMenu(params).subscribe(res => {
					if (res.status == 'success') {
						if(res.data != null){
							this.requestMenu = res.data;
						}
					}
				});
			}

			/*==============================================
			 * Get current user information
			 *==============================================*/
			this.current_user_info = this._AuthService.getCurrent();

			/*==============================================
			 * Get current user department
			 *==============================================*/
			if(this.current_user_info){
			 	var params: URLSearchParams = new URLSearchParams();
				this._AuthService.current_user_department(params).subscribe(res => {
					if (res.status == 'success') {
						this.userDepartment = res.data;
					}
				});
			}

		})
	}

	ngOnInit() {

	}

	ngAfterViewInit(){
	    $("#modalChangePassword").on("hidden.bs.modal",function(){
	      	$(this)
	        .find("input,textarea,select")
           	.val('')
           	.end()
	        .find("input[type=checkbox], input[type=radio]")
           	.prop("checked", "")
           	.end();
	    });
	}

	/*===================================================
	 * Change department - concurrent
	 *===================================================*/
  	onChangeDepartment(item){
  		/*==============================================
		 * Get current user department
		 *==============================================*/
	 	var params: URLSearchParams = new URLSearchParams();
	 	params.set('m_department_id', item['m_department_id']);
	 	params.set('m_position_id', item['m_position_id']);
	 	params.set('concurrent_post_flag', item['concurrent_post_flag']);
	 	params.set('m_user_id', this.current_user_info['id']);
		this._AuthService.change_department(params).subscribe(res => {
			if (res.status == 'success') {
				let now = new Date().getTime();
                this._LocalStorageService.set('current_user_info', res.data);
				this._LocalStorageService.set('user_session_start', now);

				/*==============================================
				 * Get current user information
				 *==============================================*/
				this.current_user_info = this._AuthService.getCurrent();
			}
		});
  	}

	/*===================================================
	 * Logout system
	 *===================================================*/
  	logout(){
  		let redirect_url = '/logout';
  		this._AuthService.logout(redirect_url);
  		//Logout Meeting Room
  		if(this._Configuration.meetingroom_active){
	  		var windowReference = window.open();
			windowReference.location.href = this._Configuration.meetingroom_logout_api;
		}
  	}

  	/*===================================================
	 * Change password
	 *===================================================*/
  	changePassword(){
  		this.modal.open();
  	}

  	onChangePassword(form: NgForm){
  		let paramsData: URLSearchParams = new URLSearchParams();
  		paramsData.set('id', this.current_user_info['id']);
  		paramsData.set('password', this.info['password']);
  		paramsData.set('new_password', this.info['new_password']);
  		paramsData.set('re_password', this.info['re_password']);

  		this._AuthService.change_password(paramsData).subscribe(res => {
  			if(res.status == 'success'){
  				this.modal.close();
  				this._ToastrService.success('パスワードを変更しました。');
          		form.reset();
          		this.validateErrors = {};
  			} else {
  				this.validateErrors = res.error;
  			}
  		})
  	}

  	openUrl(element){
  		if(element.href){
  			var windowReference = window.open();
			windowReference.location.href = element.href;
  		}
  	}

	/*===================================================
	 * Set nice scroll & tooltip for navigation
	 *===================================================*/
	applyScript(){
		if(this.flag_apply_script){
	        if($(window).width() > 1024){
	            $('.j-tooltip').tooltip({
	              	position: { my: "left+15 center", at: "right center" }
	            });

		        //Remove Trash HTML ToolTip
	            setTimeout(()=>{
					$('div.ui-helper-hidden-accessible').remove();
	            }, 2000);
	        }

	      	$('.last').mCustomScrollbar();

	        $('.menu-list').find('li').has('ul').addClass('has-child');

	        // Prevent dropdown from closing on click
	        $(document).on('click', '.dropdown-menu-usermenu', function(e) {
	          	e.stopPropagation();
	        });

	        general.toggleMenu();
	        general.toggleDropdownUser();
	        general.mbShowMenu();
	        general.mbHideMenu();
	        this.flag_apply_script = false;
	    }
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

}
