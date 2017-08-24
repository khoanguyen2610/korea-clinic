import { Component, OnInit, ViewChild,  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { BreadcrumbComponent } from '../../general';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { MDepartmentService, MCompanyService, MApprovalMenuService, MPositionService, MUserService, MMenuService, MAuthorityService } from '../../../services';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-system-approval-menu-list',
	templateUrl: './approval-menu-list.component.html',
	providers: [MDepartmentService, MCompanyService, MApprovalMenuService, MPositionService, MUserService, MMenuService, MAuthorityService]
})
export class ApprovalMenuListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;

	dataList = [];
	listMenu = [];
	menuOptions: Array<any> = [];
	authorityOptions: Array<any> = [];
	modalCompanyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	modalBusinessOptions: Array<any> = [];
	divisionMenuOptions: Array<any> = [];
	modalDivisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	modalDepartmentOptions: Array<any> = [];
	enableStartDateOptions: Array<any> = [];
	positionOptions: Array<any> = [];

	Item = {};
	_param = {};

	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	@ViewChild('modal_export') modal_export: ModalComponent;
	@ViewChild('modalConfirmSaving') modalConfirmSaving: ModalComponent;
	processConcurrent = new UserConcurrent();
	url_list_data: String;
	selectedItem = {};
	remove_item = {};
	error_same_date = false;
	public export_date;


	constructor(private _Router: Router,
		private _Configuration: Configuration,
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _MApprovalMenuService: MApprovalMenuService,
		private _MPositionService: MPositionService,
		private _MUserService: MUserService,
		private _MMenuService: MMenuService,
		private _MAuthorityService: MAuthorityService,
		private _ActivatedRoute: ActivatedRoute,
		private _ToastrService: ToastrService
	) {
		let routing = this._Router.url;

		this.export_date = moment().format(_Configuration.formatDateTS);

		// subscribe to router event
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this._param = param;
		});


		/*==============================================
		 * Set param after search submit
		 *==============================================*/
		if (this._param['division_id']) this.Item['menu_division_id'] = this._param['menu_division_id'];
		if (this._param['enable_start_date']) {
			this.Item['enable_start_date'] = this._param['enable_start_date'];
		} else {
			// Set default enable_start_date
			this.Item['enable_start_date'] = moment().format(_Configuration.formatDate);
		}
		if (this._param['filter_enable_start_date']) this.Item['filter_enable_start_date'] = this._param['filter_enable_start_date'];
		if (this._param['enable_end_date']) this.Item['enable_end_date'] = this._param['enable_end_date'];
		if (this._param['m_menu_id']) {
			this.Item['m_menu_id'] = this._param['m_menu_id'];
			this.getListUserRoute(this._param['m_menu_id']);
		}


	}

	ngOnInit(){

		this.getAuthorityOptions();

		this.getMenuOptions();

		this.getEnableStartDate(this._param['m_menu_id']);

		this.getDivisionMenuOptions();

	}

	/*==============================================
	 * Get User Route
	 *==============================================*/
	getListUserRoute(m_menu_id) {

		var objMenu = [];
		var select_m_menu_id = "";
		let paramData: URLSearchParams = new URLSearchParams();

		if(m_menu_id){
			if(typeof m_menu_id == 'object' && m_menu_id.length > 0){
				select_m_menu_id = m_menu_id[0];
			}else{
				select_m_menu_id = m_menu_id;
			}
			select_m_menu_id = String(select_m_menu_id);
			objMenu = select_m_menu_id.split("_");
			paramData.set('menu_type', objMenu[0]);
			paramData.set('m_menu_id', objMenu[1]);
		}
		paramData.set('enable_start_date', this.Item['enable_start_date']);
		this._MApprovalMenuService.getListUserRoute(paramData).subscribe(res => {

			if (res.status == 'success') {
				if (res.data != null) {
					var list = [];
					for (let key in res.data) {
						let obj = res.data[key];
						list.push(obj);
					}
					this.dataList = list;
				}
			}
		});
	}

	/*====================================
	 * Get List menu master 0.2 & 0.4
	 *====================================*/
	getMenuOptions(division_id = null) {
		this.menuOptions = [{ id: null, text: null }];
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('item_status', 'active');
		if (division_id) {
			paramData.set('division_id', division_id);
		}

		this._MMenuService.getAllMenuMaster(paramData).subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
					var options = [];
					var listMenu = [];
					for (let key in res.data) {
						let obj = { id: res.data[key]._id, text: res.data[key].name};
						listMenu.push(res.data[key]);
						options.push(obj);
					}
					this.listMenu = listMenu;
					this.menuOptions = options;
				}
			}
		});
	}

	/*====================================
	 * Get List Authority
	 *====================================*/
	getAuthorityOptions() {
		this.authorityOptions = [{ id: null, text: null }];
		this._MAuthorityService.getAll().subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name };
						options.push(obj);
					}
					this.authorityOptions = options;
				}
			}
		});
	}

	/*====================================
	 * Get List Division
	 *====================================*/
	getDivisionMenuOptions() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('level', '2');
		params.set('item_status', 'active');
		params.set('has_menu_master', 'true');
		this.divisionMenuOptions = [{ id: null, text: null }];
		this._MDepartmentService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				var departments = [];
				for (let key in res.data) {
					departments.push({ id: res.data[key].id, text: res.data[key].name });
				}
				this.divisionMenuOptions = departments;

				if (this._param['menu_division_id']) {
					setTimeout(() => {
						this.Item['menu_division_id'] = this._param['menu_division_id']
					}, 500)
				}
			}
		});

	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectFilterDivisionChange(event, type?: string) {
		this.dataList = [];
		if (type == 'deselected') {
			this.Item['menu_division_id'] = null;
			this.Item['m_menu_id'] = null;
			this.enableStartDateOptions = [];
			this.getMenuOptions();
		} else {
			this.Item['menu_division_id'] = event.id;
			this.getMenuOptions(event.id);
		}

	}

	/*==============================================
	 * Reload data when change select date
	 *==============================================*/
	onSelectFilterMenuChange(event, type?: string) {
		this.dataList = [];
		if (type == 'deselected') {
			this.enableStartDateOptions = [];
			this.Item['m_menu_id'] = null;
			this.Item['filter_enable_start_date'] = this.Item['enable_start_date'] = this.Item['enable_end_date'] = '';
		} else {
			this.Item['m_menu_id'] = event.id;
			this.Item['filter_enable_start_date'] = '';
			if (this.Item['m_menu_id']) {
				this.getEnableStartDate(this.Item['m_menu_id']);
			}
			for (let key in this.listMenu) {
				if (this.listMenu[key]._id == event.id) {
					this.Item['menu_division_id'] = this.listMenu[key].m_department_id;
					return;
				}
			}
		}
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
	getDepartmentOption(request, area?:string){
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		this.divisionMenuOptions = [{ id: request['menu_division_id'], text: null }];
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('division_id', request['menu_division_id']);
		this._MDepartmentService.getListOption(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data.options != null){
					for (let key in res.data.options) {
						switch (key) {
							case "business":
								this.businessOptions = res.data.options[key];
								break;
							case "division":
								this.divisionMenuOptions = res.data.options[key];
								break;
							case "department":
								this.departmentOptions = res.data.options[key];
								break;
						}
					}

				}

				setTimeout(() => {
					if(res.data.division_id) this.Item['menu_division_id'] = res.data.division_id;

				}, 500);
			}
		});
	}

	/*====================================
	 * Validate Enable Start Date
	 *====================================*/
	onValidateEnableStartDate(date) {
		this.Item['enable_start_date'] = date;
		if (this.Item['filter_enable_start_date'] == '') {
			for (let key in this.enableStartDateOptions) {
				if (this.enableStartDateOptions[key].text.indexOf(date) > -1) {
					this.error_same_date = true;
					return;
				}
			}
		}
		this.error_same_date = false;
		return;
	}

	/*==============================================
	 * Get Sub Code From Department
	 *==============================================*/
	getEnableStartDate(m_menu_id) {
		var menu_type = '';
		if (m_menu_id) {
			let objMenu = m_menu_id.split("_");
			menu_type = objMenu[0];
			m_menu_id = objMenu[1];

		}
		this._MApprovalMenuService.getEnableStartDate(m_menu_id, menu_type).subscribe(res => {
			if (res.status == 'success') {
				var options = [];
				var obj_enable_start_date: any;
				var filter_enable_start_date = moment(this.Item['filter_enable_start_date']).format('YYYY-MM-DD');

				for (let key in res.data) {

					let obj = { id: key, text: res.data[key] };
					options.push(obj);
					if (filter_enable_start_date === obj.id) {
						obj_enable_start_date = obj;
					}
				}
				this.enableStartDateOptions = options;

				if (options.length) {
					let arrDate: any;

					if (obj_enable_start_date) {
						arrDate = obj_enable_start_date.text.split(' - ');
					} else {
						this.Item['filter_enable_start_date'] = options[options.length - 1].id;
						arrDate = options[options.length - 1].text.split(' - ');

					}
					if (arrDate.length > 1) {
						this.Item['enable_start_date'] = arrDate[0];
						this.Item['enable_end_date'] = arrDate[1];
					} else {
						this.Item['enable_start_date'] = arrDate[0];
						this.Item['enable_end_date'] = '';
					}


				}
			}
		});
	}

	/*==============================================
	 * Reload data when change select date
	 *==============================================*/
	onSelectFilterDateChange(event, type?: string) {
		if (this.enableStartDateOptions.length) {
			this.Item['filter_enable_start_date'] = event.id;

			let arrDate = event.text.split(' - ');
			if (arrDate.length > 1) {
				this.Item['enable_start_date'] = arrDate[0];
				this.Item['enable_end_date'] = arrDate[1];
			} else {
				this.Item['enable_start_date'] = arrDate;
				this.Item['enable_end_date'] = '';
			}
		} else {
			type = 'deselected';
		}

		if (type == 'deselected') {
			this.Item['filter_enable_start_date'] = this.Item['enable_start_date'] = this.Item['enable_end_date'] = '';
			this.dataList = [];
		}
	}


	/*====================================
	 * Search Filter
	 *====================================*/
	onSearch() {

		// Reload List User Route
		this.getListUserRoute(this.Item['m_menu_id']);

		// Change URL when submit
		this._Router.navigate(['/system/approval-menu'], { queryParams: this.Item });
	}

	/*====================================
	 * Reset Item
	 *====================================*/
	onReset() {
		this.Item = {};
		this.getDepartmentOption(this.Item);
		this.onSearch();
	}

	ngAfterViewInit(){
		this.url_list_data = this._MUserService._list_data_URL;
		let self = this,
			_list_data_URL = this.url_list_data + '?has_invisible_data=1' ,
			Configuration = this._Configuration;
		this.DTList = $('#tbl-data-approval-menu').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
				'url': _list_data_URL,
				'type': 'GET',
				'beforeSend': function(request) {
					request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
				},
			    xhrFields: {
		            withCredentials: true
		        }
			},
			columns: [
				{ 'data': 'fullname' },
				{ 'data': 'position_name' },
				{ 'data': 'business_name_code' },
				{ 'data': 'division_name_code' },
				{ 'data': 'department_name_code' },

			],
			columnDefs: [
				{
					targets: [0],
					className: 'text-left',
					data: null,
					render: function(data, type, full) {
						return '<a class="edit-record">' + data + '</a>';
					}
				}
			],
			order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) { },
			fnRowCallback: function(nRow, aData, iDisplayIndex) {

				$(nRow).unbind().bind('click', function() {
					self.pushDataList(aData);
				});
			},
		});
	}

	/*=================================
	 * Remove element on Data List
	 *=================================*/
	onRemoveDataList() {
		this.modalConfirm.close();
		this.dataList.splice(this.remove_item['index'], 1);
	}

	/*====================================
	 * Function open modal confirm delete
	 *====================================*/
	onOpenModalConfirm(index: number, fullname: string) {
		this.remove_item['index'] = index;
		this.remove_item['fullname'] = fullname;
		this.modalConfirm.open('sm');
	}

	/*=================================
	 * Create | Update Approval Department
	 *=================================*/
	onSave() {
		if (this.Item['filter_enable_start_date']) {
			this.savingData();
		} else {
			this.modalConfirmSaving.open('sm');
		}


	}


	protected savingData() {
		$('.loading').show();
		var objMenu = [];
		var select_m_menu_id = "";
		if(this.Item['m_menu_id']){
			if(typeof this.Item['m_menu_id'] == 'object' && this.Item['m_menu_id'].length > 0){
				select_m_menu_id = this.Item['m_menu_id'][0];
			}else{
				select_m_menu_id = this.Item['m_menu_id'];
			}
			select_m_menu_id = String(select_m_menu_id);
			objMenu = select_m_menu_id.split("_");
		}

		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('m_department_id', this.Item['department_id']);
		paramData.set('menu_type', objMenu[0]);
		paramData.set('m_menu_id', objMenu[1]);
		paramData.set('approval_data', JSON.stringify(this.dataList));
		paramData.set('current_enable_start_date', this.Item['filter_enable_start_date']);
		paramData.set('enable_start_date', this.Item['enable_start_date']);

		this._MApprovalMenuService.save(paramData).subscribe(res => {
			$('.loading').hide();
			if (res.status == 'success') {
				this._ToastrService.success('保存しました。');
				this.onSearch();
			}
		});
	}

	/*=================================
	 * Confirm Saving route users
	 *=================================*/
	onConfirmSaving() {
		this.modalConfirmSaving.close();
		this.savingData();
	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onModalClose(){
		this.modal.close();
	}

	/*=================================
	 * Push Array Data List
	 *=================================*/
	pushDataList(row) {
		row.m_user_id = this.clone(row.id);
		delete row.id;
		row.m_authority_id = this.authorityOptions[0].id;
		if(this.selectedItem) {
			for(let key in this.dataList) {
				if(this.dataList[key].id == this.selectedItem['id']) {
					row.id = this.clone(this.selectedItem['id']);
					this.dataList[key] = row;
					this.selectedItem = null;
					this.modal.close();
					return;
				}
			}

		} else {
			this.dataList.push(row);
			this.onSearchConcurrent();
		}
		this.modal.close();
	}

	/*=================================
	 * Open Modal Form Concurrent (user department)
	 *=================================*/
	onOpenConcurrent(item = null){
		let data = new UserConcurrent();

		this.selectedItem = item;
		this.modal.open();
		/*==============================================
		 * Get List Company
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCompanyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name };
						options.push(obj);
					}
					this.modalCompanyOptions = options;
				}
			}
		});

		/*==============================================
		 * Get List Position
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MPositionService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
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
	 	this.getDepartmentOptionModal(data);


	 	if(data){
	 		setTimeout(() => {
				this.processConcurrent = data;
	 		}, 300)
		}

		// Reload Empty Datatable
		let _list_data_URL = this._MUserService._list_data_URL + '?has_invisible_data=1';
	  	this.DTList.ajax.url(_list_data_URL).load();

	}

	/*=================================
	 * Create | update User Department
	 *=================================*/
	onSearchConcurrent() {
		// Reload Datatable
		let str_except_id = this.generateExceptID();
		let _list_data_URL = this._MUserService._list_data_URL + str_except_id + '&' + $.param(this.processConcurrent);
		this.DTList.ajax.url(_list_data_URL).load();

	}

	/*=================================
	 * Generate Except ID String
	 *=================================*/
	generateExceptID() {
		var str_except_id = '?';
		if (this.dataList.length) {
			str_except_id += 'except_id=';

			let arr_except_id = this.makeArrExceptID();
			str_except_id += arr_except_id.join();

			if (str_except_id == '?except_id=') {
				str_except_id = '?has_except_authority=0'
			} else {
				str_except_id = str_except_id + '&has_except_authority=0';
			}
		}
		return str_except_id;
	}

	/*=================================
	 * Make arr_except_id from listData
	 *=================================*/
	makeArrExceptID() {
		let arr_except_id = [];
		for (let key in this.dataList) {
			arr_except_id.push(this.dataList[key].m_user_id);

		}
		return arr_except_id;
	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectDepartmentChangeModal(event, area?: string, type?: string) {
		switch (area) {
			case "company":
				if (type == 'deselected') {
					this.processConcurrent['m_company_id'] = null;
				} else {
					this.processConcurrent['business_id'] = null;
				}
			case "business":
				if (type == 'deselected') {
					this.processConcurrent['business_id'] = null;
				} else {
					this.processConcurrent['division_id'] = null;
				}
			case "division":
				if (type == 'deselected') {
					this.processConcurrent['division_id'] = null;
				} else {
					this.processConcurrent['m_department_id'] = null;
				}
			case "department":
				if (type == 'deselected') {
					this.processConcurrent['m_department_id'] = null;
				}
				break;
		}

		if (!type) {
			let key_id = '';
			switch (area) {
				case "company":
					key_id = 'm_company_id';
					break;

				case "department":
					key_id = 'm_department_id';
					break;

				default:
					key_id = area + '_id';
					break;
			}

			this.processConcurrent[key_id] = event.id;
		}

		this.getDepartmentOptionModal(this.processConcurrent);
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
	getDepartmentOptionModal(request, area?: string) {
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		this.modalBusinessOptions = [{ id: request['business_id'], text: null }];
		this.modalDivisionOptions = [{ id: request['division_id'], text: null }];
		this.modalDepartmentOptions = [{ id: request['department_id'], text: null }];
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_company_id', request['m_company_id']);
		params.set('business_id', request['business_id']);
		params.set('division_id', request['division_id']);
		params.set('department_id', request['m_department_id']);
		this._MDepartmentService.getListOption(params).subscribe(res => {
			if (res.status == 'success') {
				if (res.data.options != null) {
					for (let key in res.data.options) {
						switch (key) {
							case "business":
								this.modalBusinessOptions = res.data.options[key];
								break;
							case "division":
								this.modalDivisionOptions = res.data.options[key];
								break;
							case "department":
								this.modalDepartmentOptions = res.data.options[key];
								break;
						}
					}

				}

				setTimeout(() => {
					if (res.data.m_company_id) this.processConcurrent['m_company_id'] = res.data.m_company_id;
					if (res.data.business_id) this.processConcurrent['business_id'] = res.data.business_id;
					if (res.data.division_id) this.processConcurrent['division_id'] = res.data.division_id;
					if (res.data.department_id) this.processConcurrent['m_department_id'] = res.data.department_id;
				}, 500);
			}
		});
	}

	/*=================================
	 * Export List Approval Menu
	 *=================================*/
	onDownload(form: NgForm) {
		if(form.valid){
			var windowReference = window.open();
			var params: URLSearchParams = new URLSearchParams();
			params.set('export_date', this.export_date);
			this._MApprovalMenuService.exportListApprovalMenu(params).subscribe(res => {
				if (res.status == 'success') {
					// windowReference.location.href = res.data.url;
					let url = res.data.url;
					window.location.href = url;
					windowReference.location.href = url;
					windowReference.close();
					this.modal_export.close();
				}
			});
		}
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e) {
		// Set value of select 2 to ngModel
		this.processConcurrent['m_position_id'] = e.id;
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e) {
		// Reset value of select 2 to ngModel
		this.processConcurrent['m_position_id'] = null;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
		this.modalConfirm.ngOnDestroy();
		this.modal_export.ngOnDestroy();
	}

	protected clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
}
