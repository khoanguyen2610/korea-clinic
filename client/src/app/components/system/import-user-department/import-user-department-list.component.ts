import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LabelPipe } from '../../../pipes';

import { MUserService, MPositionService,
	MDepartmentService, MCompanyService, AuthService, MImportUserDepartmentService, MUserDepartmentService, MCurrencyService
} from '../../../services';
import { MUser, UserConcurrent } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from '../../../shared';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: "app-import-user-department-list",
	templateUrl: 'import-user-department-list.component.html',
	providers: [MUserService, MPositionService,
		MDepartmentService, MCompanyService, AuthService, MImportUserDepartmentService, MUserDepartmentService, MCurrencyService]
})



export class ImportUserDepartmentListComponent implements OnInit {
	private subscriptionEvents: Subscription;
	validateErrors: Array<any> = [];
	currencyOptions: Array<any> = [];
	bankOptions: Array<any> = [];
	bankBranchOptions: Array<any> = [];
	userOptions: Array<any> = [];
	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	positionOptions: Array<any> = [];
	user_department: Array<any> = [];
	userAutocomplete: Array<any> = [];
	current_user_info = {};
	action_user_department: string = 'create';

	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modal_info') modal_info: ModalComponent;
	@ViewChild('confirm_modal') confirm_modal: ModalComponent;
	@ViewChild('confirm_saving_modal') confirm_saving_modal: ModalComponent;
	Item = new MUser();
	processConcurrent = new UserConcurrent();
	updatedObject = {};
	deletedObject = {};
	user_info = {};
	defaultUserDepartment: Array<any> = [];
	curRouting?: string;
	delete_index: string;
	update_index: string;
	_pipeLabel: any;

	startDate = this._Configuration.limit_start_date;
	endDate = this._Configuration.limit_end_date;

	constructor(
		private _MUserService: MUserService,
		private _MPositionService: MPositionService,
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _MImportUserDepartmentService: MImportUserDepartmentService,
		private _MUserDepartmentService: MUserDepartmentService,
		private _ToastrService: ToastrService,
		private _MCurrencyService: MCurrencyService,
		private _AuthService: AuthService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _Configuration: Configuration
	) {
		//current user
		this.current_user_info = this._AuthService.getCurrent();
		//=============== Get Params On Url ===============

		this._pipeLabel = new LabelPipe();
		/*==============================================
		 * Get List Currency
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCurrencyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
					var options = [];
					for (let key in res.data) {
						let obj = { value: res.data[key].id, label: res.data[key].name + '(' + res.data[key].symbol + ')' };
						options.push(obj);
					}
					this.currencyOptions = options;
				}
			}
		});

		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});

	}

	ngOnInit() {}

	/*=================================
	 * Initialize Data
	 *=================================*/
	initData() {
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('item_status', 'active');
		this._MImportUserDepartmentService.getAll(paramData).subscribe(res => {
			if (res.status == 'success') {

				let options = [];
				this.defaultUserDepartment = [];
				for (let key in res.data) {
					let item = res.data[key];
					// variable m_iud_id (m_import_user_department_id)
					item.m_iud_id = item.id;

					if (!this.defaultUserDepartment[item.m_user_id]) {
						this.defaultUserDepartment[item.m_user_id] = {};
					}
					this.defaultUserDepartment[item.m_user_id][item.enable_start_date] = item;
				}
				this.user_department = res.data;
				this.Item['user_department'] = res.data;

			}
		});
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
	onModalClose(){
		// this.Item['user_department'] = JSON.parse(JSON.stringify(this.defaultUserDepartment));
		// this.user_department = JSON.parse(JSON.stringify(this.defaultUserDepartment));
		this.modal.close();
	}

	/*=================================
	 * Get Info User With Department
	 *=================================*/
	getInfoUserWithDepartment(m_user_id) {
		let params: URLSearchParams = new URLSearchParams();
		params.set('has_user_department', 'true');
		this.user_info = [];
		this._MUserService.getByID(m_user_id, params).subscribe(res => {
			if (res.status == 'success') {
				this.user_info = res.data;
				let m_currency = this._pipeLabel.transform(this.currencyOptions, res.data.m_currency_id);
				let currency = m_currency.shift();
				this.user_info['currency_name'] = currency.label;
			}
		});
	}
	/*=================================
	 * Open Modal Info User Department
	 *=================================*/
	onOpenInfoUserDepartment(m_user_id) {
		this.getInfoUserWithDepartment(m_user_id);

		this.modal_info.open();
	}

	/*=================================
	 * Open Modal Form Concurrent (user department)
	 *=================================*/
	onOpenConcurrent(data = null, action?: string, index = null){

		this.action_user_department = action;
		let self = this;
		if(data == null){
			this.user_info = [];
			data = new UserConcurrent();
		} else {
			if (data.m_iud_id) {
				data.user_text = JSON.parse(JSON.stringify(data.fullname));
			}
			this.update_index = index;
			this.getInfoUserWithDepartment(data.m_user_id);
		}

		this.modal.open();

		/*==============================================
		 * Get List User
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		// this.userOptions = [{ id: this.processConcurrent['m_user_id'], text: null }];
		this._MUserService.getListData(params).subscribe(res => {
			let data = res.aaData
			if (data != null) {
				var options = [];
				for (let key in res.aaData) {
					let obj = {
						// id: data[key].id,
						user_id: data[key].id,
						value: data[key].user_id + ' - ' + data[key].fullname,
						fullname: data[key].fullname,
						fullname_kana: data[key].fullname_kana,
						staff_no: data[key].staff_no,
						m_department_id: data[key].m_department_id,
						m_position_id: data[key].m_position_id
					};
					options.push(obj);
				}
				this.userAutocomplete = options;
			}
		});

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
	 		data['staff_no'] = (data['staff_no'])?data['staff_no']:this.Item['staff_no'];

	 		setTimeout(() => {
				this.processConcurrent = data;
				this.updatedObject = JSON.parse(JSON.stringify(data));
	 		}, 300)
		}
	}

	/*=================================
	 * Get User Selected in userOptions
	 *=================================*/
	getSelectedUser(id) {
		for(let key in this.userOptions) {
			if(this.userOptions[key].id == id) {
				return this.userOptions[key];
			}
		}
	}
	/*=================================
	 * Create | update User Department
	 *=================================*/
	onSaveConcurrent(){
		this._Configuration.allow_change_page = false;
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

						return (eachDate == curDate) && (obj['m_user_id'] == item['m_user_id']) && (obj['concurrent_post_flag'] == '0' || obj['concurrent_post_flag'] == null);
					});
				}

				if(checkExist.length) {
					this._ToastrService.error('既に本所属で登録されている部署があります。');
			   	} else {
					this.getUserDepartmentExisting(this.processConcurrent['m_user_id']);
				}

			} else if(this.action_user_department == 'update'){
				if(this.update_index) {

					this.user_department[this.update_index] = obj;
					this.Item['user_department'] = JSON.parse(JSON.stringify(this.user_department));
				}

				delete this.defaultUserDepartment[this.updatedObject['m_user_id']][this.updatedObject['enable_start_date']];
				// Get array with same m_user_id in user_department
				let arrItems = this.checkListDataUserDepartment(obj);
				// Process and Count Date for list data user_department
				if (arrItems.length) {
					this.processObjectUserDepartment(arrItems, 'update');
				}

				this._ToastrService.success('登録しました。');
			}

		}
		this.onModalClose();
	}

	/*==============================================
	 * Get User Department Existing
	 *==============================================*/
	getUserDepartmentExisting(m_user_id) {
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('m_user_id', m_user_id);
		paramData.set('item_status', 'active');

		this._MUserDepartmentService.getAll(paramData).subscribe(res => {
			if (res.status == 'success') {

				let user_departments = res.data;

				// Set defaultUserDepartment empty
				let checkValidDate = true;
				for (let k in user_departments) {
					let item = user_departments[k];

					// Check valid enable date
					checkValidDate = this.checkAvailableEnableDate(item);
					if(!checkValidDate) {
						return;
					}
					if (!this.defaultUserDepartment[item.m_user_id]) {
						this.defaultUserDepartment[item.m_user_id] = {};
					}

					// Case for update
					item.is_updated = true;
					this.defaultUserDepartment[item.m_user_id][item.enable_start_date] = item;
				}

				this.user_department.push(this.processConcurrent);
				this.Item['user_department'] = this.user_department;

				this._ToastrService.success('登録しました。');

				// Get array with same m_user_id in user_department
				let arrItems = this.checkListDataUserDepartment(this.processConcurrent);

				// Process and Count Date for list data user_department
				if (arrItems.length) {
					this.processObjectUserDepartment(arrItems);
				}

				// Reset processConcurrent
				this.processConcurrent = new UserConcurrent();
				this.getDepartmentOption(this.processConcurrent);

			}
		});
	}

	/*==============================================
	 * Check Available Enable Date
	 *==============================================*/
	checkAvailableEnableDate(item) {
		let enable_start_date = moment(item.enable_start_date).format(this._Configuration.formatDate);
		let enable_end_date = moment(item.enable_end_date).format(this._Configuration.formatDate);

		let current_start_date = this.processConcurrent['enable_start_date'];
		let current_end_date = this.processConcurrent['enable_end_date'];

		if(current_start_date == enable_start_date || current_end_date == enable_end_date) {
			this._ToastrService.error('既に本所属で登録されている部署があります。');
			return false;
		}
		return true;
	}

	/*==============================================
	 * Check List Data User Department
	 *==============================================*/
	checkListDataUserDepartment(item) {
		let arr = [];
		let arr_user_department = [];

		for(let key in this.Item['user_department']) {
			let obj = this.Item['user_department'][key];
			if(item.m_user_id === obj.m_user_id) {
				arr.push(obj);
			} else {
				arr_user_department.push(obj);
			}
		}
		this.user_department = arr_user_department;

		return arr;
	}

	/*==============================================
	 * Get Process Object User Department
	 *==============================================*/
	processObjectUserDepartment(arr, action = null) {
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MUserService.processUserDepartment(arr).subscribe(res => {

			if (res.status == 'success') {
				for(let key in res.data) {
					let obj = res.data[key];
					this.user_department.push(obj);
				}

				this.Item['user_department'] = JSON.parse(JSON.stringify(this.user_department));

			}
		});
	}

	/*=================================
	 * Detect on modal close
	 * Confirm Saving for modal
	 *=================================*/
	onConfirmSaving() {
		this.confirm_saving_modal.open('sm');
	}

	/*=================================
	 * Count Element Array
	 *=================================*/
	countElementArray(list) {
		let count = 0;
		for(let k in list) {
			count++;
		}
		return count;
	}

	/*=================================
	 * Create | Update User Department
	 *=================================*/
	onSavingUserDepartment() {
		if(typeof this.Item['user_department'] == 'object' && this.Item['user_department'].length > 0) {
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('list_user_department', JSON.stringify(this.Item['user_department']));
			this._MImportUserDepartmentService.importUserDepartment(paramData).subscribe(res => {
				if (res.status == 'success') {
					this.user_department = [];
					this.Item['user_department'] = [];
					this._Configuration.allow_change_page = true;
					this.confirm_saving_modal.close();
					this._ToastrService.success('保存しました。');
					this._Router.navigate['./system/import-user-department'];
				} else {
					this.confirm_saving_modal.close();
					this._ToastrService.error('編集したことはありません');
				}
			});
		} else {
			this.confirm_saving_modal.close();
			this._ToastrService.error('編集したことはありません');
		}


	}

	/*=================================
	 * Update item_status Import User Department
	 *=================================*/
	updateItemStatusIUD(m_iud_id, item_status) {
		let paramDataStatus: URLSearchParams = new URLSearchParams();
		paramDataStatus.set('item_status', item_status);

		this._MImportUserDepartmentService.save(paramDataStatus, m_iud_id).subscribe(res => { });
	}

	/*=================================
	 * Create | Update Import User Department
	 *=================================*/
	onSaveImportUserDepartment() {
		var count = 0;
		let list = this.Item['user_department'];
		let changed = false;
		for (let key in list) {
			let item = list[key];

			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('m_user_id', item.m_user_id);
			paramData.set('fullname', item.fullname);
			paramData.set('fullname_kana', item.fullname_kana);
			paramData.set('staff_no', item.staff_no);
			paramData.set('m_department_id', item.m_department_id);
			paramData.set('m_position_id', item.m_position_id);
			paramData.set('enable_start_date', item.enable_start_date);
			paramData.set('enable_end_date', item.enable_end_date);
			paramData.set('concurrent_post_flag', item.concurrent_post_flag ? '1' : '0');
			paramData.set('item_status', 'active');

			this._MImportUserDepartmentService.save(paramData, item.m_iud_id).subscribe(res => {
				count++;
				if (res.status == 'success') {
					item.m_iud_id = res.record_id;
					changed = true;
					if (list.length == count) {
						this._Configuration.allow_change_page = true;
						this._ToastrService.success('保存しました。');
						this._Router.navigate['./system/import-user-department'];
					}
				}
			});

		}

		setTimeout(()=> {
			// Nothing change to save
			if (!changed) {
				this._ToastrService.error('編集したことはありません');
			}
		}, 1000);

	}

	/*====================================
	 * Event Select User Change of ng2-select - MIT
	 *====================================*/
	onSelectUserChange(event, type?: string) {
		// Set value of select 2 to ngModel
		if (type != 'deselected') {
			this.processConcurrent['m_user_id'] = event.id;
			let user = this.getSelectedUser(event.id);
			this.processConcurrent['staff_name'] = JSON.parse(JSON.stringify(user.fullname));
			this.processConcurrent['staff_no'] = user.staff_no;
			this.processConcurrent['fullname'] = JSON.parse(JSON.stringify(user.fullname));
		} else {
			this.processConcurrent['m_user_id'] = null;
			this.processConcurrent['staff_name'] = null;
			this.processConcurrent['staff_no'] = null;
			this.processConcurrent['fullname'] = null;
		}
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
		this.departmentOptions = [{ id: request['m_department_id'], text: null }];

		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		if(!request['m_iud_id']) {
			params.set('m_company_id', request['m_company_id']);
			params.set('business_id', request['business_id']);
			params.set('division_id', request['division_id']);
		}
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
			case "posistion":
				this.processConcurrent['m_position_id'] = e.id;
				this.processConcurrent['position_name'] = e.text;
				break;
		}
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e, area){
		// Reset value of select 2 to ngModel
		switch (area) {
			case "posistion":
				this.processConcurrent['m_position_id'] = null;
				this.processConcurrent['position_name'] = null;
				break;
		}
	}

	/*=================================
	 * Change Start Date
	 *=================================*/
	onChangeStartDate(e) {
		this.Item['entry_date'] = e.target.value;
		this.startDate = moment(e.target.value).format('YYYY-MM-DD');
	}

	/*=================================
	 * Change End Date
	 *=================================*/
	onChangeEndDate(e) {
		this.Item['retirement_date'] = e.target.value;
		this.endDate = moment(e.target.value).format('YYYY-MM-DD');

	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onConfirmDelete() {
		let self = this;
		this.deletedObject = JSON.parse(JSON.stringify(this.Item['user_department'][this.delete_index]));

		// Update item_status = 'delete'
		if(this.deletedObject['m_iud_id']) {
			this.updateItemStatusIUD(this.deletedObject['m_iud_id'], 'delete');
		}

		this.Item['user_department'].splice(this.delete_index, 1);
		this.user_department = JSON.parse(JSON.stringify(this.Item['user_department']));


		// Get array with same m_user_id in user_department
		let arrItems = this.checkListDataUserDepartment(this.processConcurrent);
		// Process and Count Date for list data user_department
		if(arrItems.length) {
			this.processObjectUserDepartment(arrItems, 'update');
		}

		this.confirm_modal.close();
	}


	/*==================================
	 * Function process when user typing autocomplete
	 *==================================*/
	onChangeUserDepartment(event) {
		if (event && typeof event === 'object') {
			this.processConcurrent['user_text'] = event.value;
			this.processConcurrent['m_user_id'] = event.user_id;
			this.processConcurrent['staff_name'] = JSON.parse(JSON.stringify(event.fullname));
			this.processConcurrent['staff_no'] = event.staff_no;
			this.processConcurrent['fullname'] = event.fullname;
			this.processConcurrent['fullname_kana'] = event.fullname_kana;
			this.processConcurrent['m_department_id'] = event.m_department_id;
			this.processConcurrent['m_position_id'] = event.m_position_id;

			this.onSelectDepartmentChange({id: event.m_department_id}, 'm_department');
			// Get Info User With Department
			this.getInfoUserWithDepartment(event.user_id);

		}

		if (typeof event === 'string') {
			if (event) {
				this.processConcurrent['user_text'] = null;
			} else {
				this.processConcurrent['user_text'] = null;
				this.processConcurrent['m_user_id'] = null;
				this.processConcurrent['staff_name'] = null;
				this.processConcurrent['staff_no'] = null;
				this.processConcurrent['fullname'] = null;
				this.processConcurrent['fullname_kana'] = null;
				this.processConcurrent['m_department_id'] = null;
			}
		}

	}

	ngOnDestroy(){
		this.subscriptionEvents.unsubscribe();
		this.modal.ngOnDestroy();
		this.confirm_modal.ngOnDestroy();
		this.confirm_saving_modal.ngOnDestroy();
		this.modal.ngOnDestroy();
		this.modal_info.ngOnDestroy();
	}

}
