import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { MUserService, MBankService, MBankBranchService, MCurrencyService, MPositionService, MDepartmentService, MCompanyService, AuthService, MeetingRoomService } from '../../../services';
import { MUser, UserConcurrent } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from '../../../shared';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './user-form.component.html',
	providers: [MUserService, MBankService, MBankBranchService, MCurrencyService, MPositionService, MDepartmentService, MCompanyService, AuthService, MeetingRoomService]
})



export class UserFormComponent implements OnInit {
	private subscription: Subscription;
	_params: any;
	validateErrors: Array<any> = [];
	currencyOptions: Array<any> = [];
	bankOptions: Array<any> = [];
	bankBranchOptions: Array<any> = [];
	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	positionOptions: Array<any> = [];
	user_department: Array<any> = [];
	current_user_info = {};
	action_user_department: string = 'create';

	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('confirm_modal') confirm_modal: ModalComponent;
	Item = new MUser();
	processConcurrent = new UserConcurrent();
	defaultUserDepartment: Array<any> = [];

	delete_index: string;

	public bank_type_code = [
		{'id':'1','text':'普通'},
		{'id':'2','text':'当座'}
	];

	startDate = this._Configuration.limit_start_date;
	endDate = this._Configuration.limit_end_date;

	constructor(
		private _MUserService: MUserService,
		private _MBankService: MBankService,
		private _MBankBranchService: MBankBranchService,
		private _MCurrencyService: MCurrencyService,
		private _MPositionService: MPositionService,
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _MeetingRoomService: MeetingRoomService,
		private _ToastrService: ToastrService,
		private _AuthService: AuthService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _Configuration: Configuration
	) {
		//current user
		this.current_user_info = this._AuthService.getCurrent();
		//=============== Get Params On Url ===============
		this.subscription = this._ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);


		/*==============================================
		 * Get List Currency
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this.currencyOptions = [{ id: this.Item['m_currency_id'], text: null }];
		this._MCurrencyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name + '(' + res.data[key].symbol + ')' };
						options.push(obj);
					}
					this.currencyOptions = options;
				}
			}
		});
		/*==============================================
		 * Get List Bank
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this.bankOptions = [{ id: this.Item['m_bank_id'], text: null }];
		this._MBankService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].code + ' - ' + res.data[key].name };
						options.push(obj);
					}
					this.bankOptions = options;
				}
			}
		});
	}

	ngOnInit() {

		switch(this._params.method){
			case 'create':
				break;
			case 'update':
				this.getInfoUserByID();
				break;
			default:
				this._Router.navigate(['/system/notify']);
				break;
		}
	}

	/*=================================
	 * Get Info User By ID
	 *=================================*/
	getInfoUserByID() {
		let failed = true;
		if (this._params.id != null) {
			failed = false;
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('has_user_department', 'true');

			this._MUserService.getByID(this._params.id, paramData).subscribe(res => {
				if (res.status == 'success') {
					this.user_department = res.data.user_department;
					this.defaultUserDepartment = JSON.parse(JSON.stringify(res.data.user_department));
					this.getBankBranch(res.data.m_bank_id, res.data);
					setTimeout(() => {
						this.Item = res.data;
					}, 300)
					if (res.data == null) {
						failed = true;
					}
				} else {
					failed = true;
				}
			});
		}
		if (failed) {
			this._Router.navigate(['/system/notify']);
		}
	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onModalConfirmOpen(index){
		this.delete_index = index;
		this.confirm_modal.open('sm');
	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onConfirmDelete(){
		let self = this;
		this.Item['user_department'].splice(this.delete_index, 1);

		/*==============================================
		 * Get Process Object User Department
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MUserService.processUserDepartment(this.Item['user_department']).subscribe(res => {
			if (res.status == 'success') {
				this.Item['user_department'] = res.data;
				this.user_department = res.data;
			}
		});
		this.confirm_modal.close();
	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onModalClose(){
		this.Item['user_department'] = JSON.parse(JSON.stringify(this.defaultUserDepartment));
		this.user_department = JSON.parse(JSON.stringify(this.defaultUserDepartment));
		this.modal.close();
	}

	/*=================================
	 * Open Modal Form Concurrent (user department)
	 *=================================*/
	onOpenConcurrent(data = null, action?: string){
		this.action_user_department = action;
		let self = this;
		if(data == null){
			data = new UserConcurrent();
		}
		this.modal.open();
		/*==============================================
		 * Get List Company
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this.companyOptions = [{ id: this.processConcurrent['m_company_id'], text: null }];
		this._MCompanyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name };
						options.push(obj);
					}
					this.companyOptions = options;
				}
			}
		});

		/*==============================================
		 * Get List Position
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this.positionOptions = [{ id: this.processConcurrent['m_position_id'], text: null }];
		this._MPositionService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name };
						options.push(obj);
					}
					this.positionOptions = options;
				}
			}
		});

		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
	 	this.getDepartmentOption(data);


	 	if(data){
	 		data['fullname'] = (data['fullname'])?data['fullname']:this.Item['fullname'];
	 		data['fullname_kana'] = (data['fullname_kana'])?data['fullname_kana']:this.Item['fullname_kana'];
	 		data['staff_no'] = (data['staff_no'])?data['staff_no']:this.Item['staff_no'];

	 		setTimeout(function(){
				self.processConcurrent = data;
	 		}, 300)
		}
	}

	/*=================================
	 * Create | update User Department
	 *=================================*/
	onSaveConcurrent(){
		if(this.processConcurrent){
			let obj = this.processConcurrent;
			if(this.action_user_department == 'create'){
				let findObj = this.Item['user_department'];
				var checkExist = [];
				if (typeof findObj != 'undefined'){
					checkExist = $.grep(findObj, function(item) {
						let eachDate = Date.parse(item['enable_start_date']);
						eachDate = moment(eachDate).format('YYYY-MM-DD');
						let curDate = Date.parse( obj['enable_start_date']);
						curDate = moment(curDate).format('YYYY-MM-DD');
					    return eachDate == curDate && (obj['concurrent_post_flag'] == '0' || obj['concurrent_post_flag'] == null);
					});
				}

				if(checkExist.length) {
					this._ToastrService.error('既に本所属で登録されている部署があります。');
			   	}else{
					this.user_department.push(obj);
					this._ToastrService.success('登録しました。');
				}
				this.processConcurrent = new UserConcurrent();
				this.getDepartmentOption(this.processConcurrent);
			}else if(this.action_user_department == 'update'){
				this.user_department = this.Item['user_department'];
				this._ToastrService.success('登録しました。');
			}

			/*==============================================
			 * Get Process Object User Department
			 *==============================================*/
			var params: URLSearchParams = new URLSearchParams();
			params.set('item_status', 'active');
			this._MUserService.processUserDepartment(this.user_department).subscribe(res => {
				if (res.status == 'success') {
					this.Item['user_department'] = res.data;
					this.user_department = res.data;
					this.defaultUserDepartment = JSON.parse(JSON.stringify(res.data));
				}
			});
		}
		this.onModalClose();
	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectDepartmentChange(event, area?:string, type?: string){
		switch (area) {
			case "company":
				if(type == 'deselected'){
					this.processConcurrent['m_company_id'] = null;
				}else{
					this.processConcurrent['business_id'] = null;
				}
			case "business":
				if(type == 'deselected'){
					this.processConcurrent['business_id'] = null;
				}else{
					this.processConcurrent['division_id'] = null;
				}
			case "division":
				if(type == 'deselected'){
					this.processConcurrent['division_id'] = null;
				}else{
					this.processConcurrent['m_department_id'] = null;
				}
			case "m_department":
				if(type == 'deselected'){
					this.processConcurrent['m_department_id'] = null;
				}
				break;
		}

		if(!type) {
			let key_id = 'm_company_id';
			if (area != 'company') {
				key_id = area + '_id';
			}
			this.processConcurrent[key_id] = event.id;
		}
		this.getDepartmentOption(this.processConcurrent);
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
	getDepartmentOption(request, area?:string){
		let self = this;
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		this.businessOptions = [{ id: request['business_id'], text: null }];
		this.divisionOptions = [{ id: request['division_id'], text: null }];
		this.departmentOptions = [{ id: request['department_id'], text: null }];

		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_company_id', request['m_company_id']);
		params.set('business_id', request['business_id']);
		params.set('division_id', request['division_id']);
		params.set('department_id', request['m_department_id']);
		this._MDepartmentService.getListOption(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data.options != null){
					for (let key in res.data.options) {
						switch (key) {
							case "business":
								this.businessOptions = res.data.options[key];
								break;
							case "division":
								this.divisionOptions = res.data.options[key];
								break;
							case "department":
								this.departmentOptions = res.data.options[key];
								break;
						}
					}

				}

				setTimeout(function(){
					if(res.data.m_company_id) self.processConcurrent['m_company_id'] = res.data.m_company_id;
					if(res.data.business_id) self.processConcurrent['business_id'] = res.data.business_id;
					if(res.data.division_id) self.processConcurrent['division_id'] = res.data.division_id;
					if(res.data.department_id) self.processConcurrent['m_department_id'] = res.data.department_id;
				}, 500);
			}
		});
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e, area){
		// Set value of select 2 to ngModel
		switch (area) {
			case "currency":
				this.Item['m_currency_id'] = e.id;
				break;
			case "bank":
				this.Item['m_bank_id'] = e.id;
				this.getBankBranch(e.id, this.Item);
				break;
			case "bank_branch":
				this.Item['m_bank_branch_id'] = e.id;
				break;
			case "bank_type_code":
				this.Item['bank_account_type_code'] = e.id;
				break;
			case "posistion":
				this.processConcurrent['m_position_id'] = e.id;
				break;
		}
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e, area){
		// Reset value of select 2 to ngModel
		switch (area) {
			case "currency":
				this.Item['m_currency_id'] = null;
				break;
			case "bank":
				this.bankBranchOptions = [];
				this.Item['m_bank_id'] = null;
				this.Item['m_bank_brank_id'] = null;
				break;
			case "bank_branch":
				this.Item['m_bank_branch_id'] = null;
				break;
			case "bank_type_code":
				this.Item['bank_account_type_code'] = null;
				break;
			case "posistion":
				this.processConcurrent['m_position_id'] = null;
				break;
		}
	}

	/*=================================
	 * Load Data Bank Branch
	 *=================================*/
	getBankBranch(bank_id?: any, default_opt?: any){
		/*==============================================
		 * Get List Bank
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_bank_id', bank_id);
		this.bankBranchOptions = [{ id: default_opt['m_bank_branch_id'], text: null }];
		this._MBankBranchService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].code + ' - ' + res.data[key].name };
						options.push(obj);
					}
					this.bankBranchOptions = options;
				}
			}
		});
	}

	/*=================================
	 * Create | update User Information
	 *=================================*/
	onSubmit(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('user_id', this.Item['user_id']);
			paramData.set('staff_no', this.Item['staff_no']);
			paramData.set('fullname', this.Item['fullname']);
			paramData.set('fullname_kana', this.Item['fullname_kana']);
			paramData.set('email', this.Item['email']);
			paramData.set('m_currency_id', this.Item['m_currency_id']);
			paramData.set('m_bank_id', this.Item['m_bank_id']);
			paramData.set('m_bank_branch_id', this.Item['m_bank_branch_id']);
			paramData.set('bank_account_no', this.Item['bank_account_no']);
			paramData.set('bank_account_type_code', this.Item['bank_account_type_code']);
			paramData.set('bank_account_holder', this.Item['bank_account_holder']);
			paramData.set('entry_date', this.Item['entry_date']);
			paramData.set('retirement_date', this.Item['retirement_date']);
			paramData.set('user_department', JSON.stringify(this.Item['user_department']));

			if(typeof this.Item['user_department'] == 'undefined' || this.Item['user_department'].length == 0){
				this._ToastrService.error('ユーザーを登録する前に、所属をご選択ください。');
				return;
			}



			if(this._params.method=='update'){
				paramData.set('id', this.Item['id'].toString());
				this._MUserService.save(paramData,this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						//Sync data to Meeting Room
				  		if(this._Configuration.meetingroom_active){
				  			let objItem = JSON.parse(JSON.stringify(this.Item));
				  			let paramMR: URLSearchParams = new URLSearchParams();
				  			paramMR.set('authenticate', 'false');
				  			paramMR.set('vws_id', objItem['id']);
				  			paramMR.set('fullname', objItem['fullname']);
				  			paramMR.set('fullname_kana', objItem['fullname_kana']);
				  			paramMR.set('email', objItem['email']);
				  			paramMR.set('fuel_csrf_token', 'vws');
					  		this._MeetingRoomService.sync_update_user(paramMR).subscribe();
						}

						this.validateErrors = [];
						this._ToastrService.success('情報を登録しました。');
						this.getInfoUserByID();
					}else if(res.status == 'error'){
						this.validateErrors = res.error;
					}
				});
			}else{
				this._MUserService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						console.log(res);
						//Sync data to Meeting Room
				  		if(this._Configuration.meetingroom_active){
				  			let objItem = JSON.parse(JSON.stringify(this.Item));
				  			let paramMR: URLSearchParams = new URLSearchParams();
				  			paramMR.set('authenticate', 'false');
				  			paramMR.set('vws_id', res.record_id);
				  			paramMR.set('fullname', objItem['fullname']);
				  			paramMR.set('fullname_kana', objItem['fullname_kana']);
				  			paramMR.set('email', objItem['email']);
				  			paramMR.set('fuel_csrf_token', 'vws');
					  		this._MeetingRoomService.sync_create_user(paramMR).subscribe();
						}


						//reset form
						form.reset();
						this.user_department = [];
						this.Item['user_department'] = [];
						this.validateErrors = [];
						this._ToastrService.success('情報を登録しました。');
					}else if(res.status == 'error'){
						this.validateErrors = res.error;
					}
				})
			}
		}
	}

	/*=================================
	 * Change Start Date
	 *=================================*/
	onChangeStartDate(e) {
		this.Item['entry_date'] = e.target.value;
		this.startDate = moment(e.target.value).add(-1, 'days').format('YYYY-MM-DD');
	}

	/*=================================
	 * Change End Date
	 *=================================*/
	onChangeEndDate(e) {
		this.Item['retirement_date'] = e.target.value;
		this.endDate = moment(e.target.value).add(1, 'days').format('YYYY-MM-DD');

	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
		this.confirm_modal.ngOnDestroy();
	}

}
