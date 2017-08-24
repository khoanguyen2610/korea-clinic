import { Component, OnInit, ViewChild, } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { MDepartmentService, MCompanyService, MApprovalMenuService, MPositionService, MUserService, TProposalService, TApprovalStatusService, MAuthorityService, AuthService, ApprovalRoutesService } from '../../../services';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';
import { LocalStorageService } from 'angular-2-local-storage';

declare let $: any;
declare let moment: any;
declare let proposal_create: any;

@Component({
	selector: 'app-proposal-routes',
	templateUrl: './proposal-routes.component.html',
	providers: [MDepartmentService, MCompanyService, MApprovalMenuService, MPositionService, MUserService, TProposalService, TApprovalStatusService, MAuthorityService, AuthService, ApprovalRoutesService]
})
export class ProposalRoutesComponent implements OnInit {
	private subscription: Subscription;
	private querySubscription: Subscription;
	private DTList;

	dataList = [];
	listMenu = [];

	authorityOptions: Array<any> = [];
	modalCompanyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	modalBusinessOptions: Array<any> = [];
	modalDivisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	modalDepartmentOptions: Array<any> = [];
	positionOptions: Array<any> = [];
	approvingUser = {};

	Item = {};
	_params = {};
	param = {};

	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	processConcurrent = new UserConcurrent();
	url_list_data: String;
	selectedItem = {};
	remove_item = {};
	error_same_date = false;
	current_user_info = {};
	user_create_form = {};
	arr_except_id = [];


	constructor(private _Router: Router,
		private _Location: Location,
		private _Configuration: Configuration,
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _MApprovalMenuService: MApprovalMenuService,
		private _MPositionService: MPositionService,
		private _MUserService: MUserService,
		private _TProposalService: TProposalService,
		private _TApprovalStatusService: TApprovalStatusService,
		private _MAuthorityService: MAuthorityService,
		private _ActivatedRoute: ActivatedRoute,
		private _ToastrService: ToastrService,
		private _AuthService: AuthService,
		private _ApprovalRoutesService: ApprovalRoutesService,
		private _LocalStorageService: LocalStorageService
	) {
		let routing = this._Router.url;
		let self = this;

		// subscribe to router event
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		)

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => this.param = param
		)

		this.dataList[1] = [];
		this.dataList[21] = [];
		this.dataList[22] = [];
		this.dataList[3] = [];
		this.dataList[41] = [];
		this.dataList[42] = [];

	}

	ngOnInit() {
		proposal_create.toggleMenu();

		this.current_user_info = this._AuthService.getCurrent();
		this.getAuthorityOptions();
		this._TProposalService.getByID(this._params['id']).subscribe(res => {
			if (res.status == 'success' && res.data) {
				if (+res.data['m_petition_status_id'] != 1 && +this.param['permission'] != 1) {
					this._Router.navigate(['/']);
				}

				if (+res.data['m_petition_status_id'] == 1 && !this.checkSessionCreatedForm(1, res.data['id'])) {
					this._Router.navigate(['/proposal/form/update', this._params['id']]);
					return;
				}
				this.Item = res.data;
				this.user_create_form = this.Item['user_create_form'];
				if (this.Item['priority_flg'] === '0') {
					this.Item['priority_flg'] = '通常';
				} else {
					this.Item['priority_flg'] = '優先';
				}

				if (this.Item['change_route'] === '0') {
					this.Item['change_route'] = '無';
				} else {
					this.Item['change_route'] = '有';
				}

				// Check exist routes user
				if(this.Item['routes']) {
					this.approvingUser = this.getApprovingUser(this.Item['routes']);
					this.dataList = this.convertDataList(this.Item['routes']);

				} else {
					this.getMasterRoutes(res.data);
				}

			} else {
				this._ToastrService.error('データはありません。');
				this._Router.navigate(['/']);
			}
		});

	}

	/*==============================================
	 * Get List master routes
	 *==============================================*/
	convertDataList(routes) {
		let dataList = [];
		for (let key in routes) {

			let route = routes[key];

			// map authority id into element of dataList
			if (!dataList[route.m_authority_id]) {
				dataList[route.m_authority_id] = [];
			}
			dataList[route.m_authority_id].push(routes[key]);
		}
		for (let i = 1; i <= 4; i++) {
			if (!dataList[i] && i != 2 && i!=4) {
				dataList[i] = [];
			}
		}
		dataList = this.parseDataListFromSpecificAuthority(dataList, 2);
		dataList = this.parseDataListFromSpecificAuthority(dataList, 4);
		return dataList;
	}

	/*==============================================
	 * Parse dataList From Specific Authority
	 *==============================================*/
	parseDataListFromSpecificAuthority(dataList, number) {
		let data = [];
		if (dataList[number]) {
			data = JSON.parse(JSON.stringify(dataList[number]));
			delete dataList[number];
		}

		let last_key = 0;
		number = number * 10;
		dataList[number + 1] = [];
		dataList[number + 2] = [];
		for(let key in data) {
			if (data[key].m_approval_status_id || this.approvingUser['id'] == data[key].id) {
				last_key = +key;
				dataList[number + 1].push(data[key]);
			} else {
				dataList[number + 2].push(data[key]);
			}
		}
		return dataList;
	}


	/*==============================================
	 * Convert dataList into listRows
	 *==============================================*/
	convertDataListIntoListRow() {
		let listRow = [];
		let dataList = JSON.parse(JSON.stringify(this.dataList));
		if (dataList[3].length) {
			dataList[31] = JSON.parse(JSON.stringify(dataList[3]));
			delete dataList[3];
		}

		for (let key in dataList) {
			for (let k in dataList[key]) {
				listRow.push(dataList[key][k]);
			}
		}
		return listRow;
	}

	/*==============================================
	 * Get List master routes
	 *==============================================*/
	getMasterRoutes(Item){

 		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('menu_type', 'menu');
		paramData.set('m_menu_id', Item['m_menu_id']);
		paramData.set('m_department_id', this.current_user_info['active_m_department_id']);
		paramData.set('user_check', '1');

		this._ApprovalRoutesService.getMasterRoutes(paramData).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					for(let key in res.data) {
						delete res.data[key].id;
					}
					this.dataList = this.convertDataList(res.data);
				}
			}
		});

	}

	/*==============================================
	 * Get User Route
	 *==============================================*/
	getListUserRoute(m_menu_id) {

		var objMenu = [];
		let paramData: URLSearchParams = new URLSearchParams();
		if (m_menu_id) {
			objMenu = m_menu_id.split("_");
			paramData.set('menu_type', objMenu[0]);
			paramData.set('m_menu_id', objMenu[1]);
		}

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
	 * Get List Authority
	 *====================================*/
	getAuthorityOptions() {
		this.authorityOptions = [{ id: null, text: null }];
		this._MAuthorityService.getAll().subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
					var options = [];
					for (let key in res.data) {
						if (res.data[key].name != '最終審議') {
							let obj = { id: res.data[key].id, text: res.data[key].name };
							options.push(obj);
						}

					}
					this.authorityOptions = options;
				}
			}
		});
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

	ngAfterViewInit() {
		this.url_list_data = this._MUserService._list_data_URL;
		let self = this,
			_list_data_URL = this.url_list_data + '?has_invisible_data=1',
			Configuration = this._Configuration;
		this.DTList = $('#tbl-data-proposal-detail').DataTable({
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
	 * Change Authority in row
	 *=================================*/
	onChangeAuthority(prev_m_authority_id, item, index) {
		if (this.param['permission'] != 1 || (this.param['permission'] == 1 && this.approvingUser['m_authority_id'] == 2 && item.m_user_id != this.dataList[1][0].m_user_id)) {
			let listRow = this.convertDataListIntoListRow();
			let str_id = this.checkAuthorityUsers(listRow);
			let arr_except_id = str_id.split(',');

			if (arr_except_id.indexOf(item.m_user_id) < 0) {
				this.dataList[prev_m_authority_id*10 + 2].splice(index, 1);
				this.dataList[item.m_authority_id*10 + 2].push(item);
			} else {
				setTimeout(() => {
					item.m_authority_id = prev_m_authority_id;
				}, 1000);

			}
		} else {
			if (prev_m_authority_id == 4) {
				setTimeout(() => {
					item.m_authority_id = prev_m_authority_id;
				}, 1000);
			}

		}
	}

	/*=================================
	 * Remove element on Data List
	 *=================================*/
	onRemoveDataList() {
		this.modalConfirm.close();
		this.dataList[this.remove_item['authority']*10 + 2].splice(this.remove_item['index'], 1);
	}

	/*====================================
	 * Function open modal confirm delete
	 *====================================*/
	onOpenModalConfirm(m_authority_id:number, index: number, fullname: string) {
		this.remove_item['authority'] = m_authority_id;
		this.remove_item['index'] = index;
		this.remove_item['fullname'] = fullname;
		this.modalConfirm.open('sm');
	}

	/*=================================
	 * Back Button
	 *=================================*/
	onBack(id) {
		if(this.param['permission']) {
			this._Router.navigate(['/proposal/detail', id], { queryParams: { previous_page: this.param['previous_page'] } });
		} else {
			this._Router.navigate(['/proposal/form/update', id]);
		}
	}

	/*=================================
	 * Create | Update Approval Department
	 *=================================*/
	onSave() {

		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('menu_type', 'menu');
		paramData.set('m_menu_id', this.Item['m_menu_id']);
		paramData.set('m_department_id', this.current_user_info['active_m_department_id']);
		paramData.set('user_check', '1');
		paramData.set('routes', JSON.stringify(this.convertDataListIntoListRow()));

		this._TApprovalStatusService.setRoutes(paramData, this._params['id']).subscribe(res => {
			if (res.status == 'success') {
				this._ToastrService.success('保存しました。');
				if (this.param['permission'] == 1 && this.param['previous_page']) {
					this._Router.navigate(['/proposal/detail', this._params['id']], { queryParams: { previous_page: this.param['previous_page'] } });
				} else {
					let current_path = this._Location.path();
					this._Router.navigate(['/proposal/detail', this._params['id']], { queryParams: { previous_page: encodeURIComponent(current_path) } });
				}

			}
		});
	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onModalClose() {
		this.modal.close();
	}

	/*=================================
	 * Push Array Data List
	 *=================================*/
	pushDataList(row) {
		row.resource_data = 'staff';
		row.unit = 'part';
		row.segment = '部品';
		row.m_user_id = this.clone(row.id);
		delete row.id;

		if (this.selectedItem) {
			for (let key in this.dataList) {
				if (this.dataList[key].id == this.selectedItem['id']) {
					row.id = this.clone(this.selectedItem['id']);
					row.m_authority_id = this.selectedItem['m_authority_id'];
					this.dataList[this.selectedItem['m_authority_id'] * 10 + 2][this.selectedItem['index']] = row;
					this.selectedItem = null;
					this.modal.close();
					return;
				}
			}

		} else {
			let m_authority_id: any;
			let approvingUser = this.approvingUser;
			if (this.param['permission'] == 1 && approvingUser['m_authority_id'] != 2) {
				switch (String(approvingUser['m_authority_id'])) {
					case "3":
						m_authority_id = +approvingUser['m_authority_id'] + 1;
						break;
					case "4":
						this.modal.close();
						return;
				}

			} else {
				m_authority_id = this.authorityOptions[0].id;
				let checked = false;

				if (this.dataList[1][0].m_user_id == row.m_user_id) { // Check first row datalist with user inserted
					m_authority_id = 2;
					checked = true;

				} else {
					for (let key in this.dataList[21]) {

						if (this.dataList[21][key].m_user_id == row.m_user_id) {
							m_authority_id = this.dataList[21][key].m_authority_id;
							checked = true;
							break;
						}
					}

					for (let key in this.dataList[22]) {

						if (this.dataList[22][key].m_user_id == row.m_user_id) {
							m_authority_id = this.dataList[22][key].m_authority_id;
							checked = true;
							break;
						}
					}
				}



				for (let key in this.dataList[41]) {

					if (this.dataList[41][key].m_user_id == row.m_user_id) {
						m_authority_id = this.dataList[41][key].m_authority_id;
						checked = true;
						break;
					}
				}

				for (let key in this.dataList[42]) {

					if (this.dataList[42][key].m_user_id == row.m_user_id) {
						m_authority_id = this.dataList[42][key].m_authority_id;
						checked = true;
						break;
					}
				}

				if (checked) {
					if (m_authority_id == 2) {
						m_authority_id = 4;
					} else {
						m_authority_id = 2;
					}
				}
			}


			row.m_authority_id = m_authority_id;
			this.dataList[m_authority_id * 10 + 2].push(row);
			this.onSearchConcurrent();
		}
		this.modal.close();
	}

	/*=================================
	 * Get approving user
	 *=================================*/
	getApprovingUser(dataList) {
		let last_key = 0;
		for (let key in dataList) {
			if (dataList[key].m_approval_status_id == 1) {
				last_key = +key;
				break;
			}
		}
		dataList[last_key].index = last_key;
		return dataList[last_key];
	}

	/*=================================
	 * Open Modal Form Concurrent (user department)
	 *=================================*/
	onOpenConcurrent(index = null, item = null) {
		let self = this;
		let data = new UserConcurrent();

		this.selectedItem = item;
		if (item != null) {
			this.selectedItem['index'] = index;
		}
		this.modal.open();
		/*==============================================
		 * Get List Company
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCompanyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
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


		if (data) {
			setTimeout(function() {
				self.processConcurrent = data;
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
		let _list_data_URL = '';
		if (str_except_id == '?') {
			_list_data_URL = this._MUserService._list_data_URL + str_except_id + $.param(this.processConcurrent);
		} else {
			_list_data_URL = this._MUserService._list_data_URL + str_except_id + '&' + $.param(this.processConcurrent);
		}

		this.DTList.ajax.url(_list_data_URL).load();

	}

	/*=================================
	 * Generate Except ID String
	 *=================================*/
	generateExceptID() {
		let str_except_id = '?';
		if (this.dataList[21].length || this.dataList[22].length || this.dataList[41].length || this.dataList[42].length) {
			str_except_id += 'except_id=';
			let listRow = this.convertDataListIntoListRow();
			let str_id = this.checkAuthorityUsers(listRow);

			str_except_id += str_id;
			if (str_except_id == '?except_id=') {
				str_except_id = '?has_except_authority=0'
			} else {
				str_except_id = str_except_id.substr(0, str_except_id.length - 1) + '&has_except_authority=0';
			}

		}

		return str_except_id;
	}

	/*=================================
	 * Check user with 2 authority
	 *=================================*/
	checkAuthorityUsers(data) {
		let str_except_id = this.current_user_info['id'] + ',';
		if(data.length) {

			if (this.param['permission'] == 1 && this.approvingUser['m_authority_id'] != 2) {
				for (let key in data) {

					if (data[key].m_authority_id == 4) {
						str_except_id += data[key].m_user_id + ',';
					}
				}
			} else {
				for (let key in data) {

					var count = 0;
					for (let k in data) {
						if (data[k].m_user_id == data[key].m_user_id && (data[k].m_authority_id != 3)) {
							count++;
							if (count == 2) {
								str_except_id += data[k].m_user_id + ',';
								break;
							}
						}
					}

				}
			}

		}

		return str_except_id;

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

	/*==============================================
	 * Check Session Created Form
	 *==============================================*/
	checkSessionCreatedForm(pettion_type, petition_id) {
		let sessionForm = this._LocalStorageService.get(pettion_type + '_' + petition_id);
		if (sessionForm) {
			return true;
		}
		return false;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.querySubscription.unsubscribe();
		this.modal.ngOnDestroy();
		this.modalConfirm.ngOnDestroy();
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
