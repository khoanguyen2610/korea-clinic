import { Component, OnInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { LabelPipe } from '../../../pipes';
import { MDepartmentService, MCompanyService, MCurrencyService, MUserService, MUserDepartmentService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-change-user-department-form',
	templateUrl: './change-user-department-form.component.html',
	providers: [ MCompanyService, MDepartmentService, MCurrencyService, MUserService, MUserDepartmentService  ]
})

export class ChangeUserDepartmentFormComponent implements OnInit{
	private DTList;
	private intervalRouteChanges;
	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modalinfo') modalinfo: ModalComponent;

	filter = {};
	replace = {};
	user_info = {};
	currencyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	users: Array<any> = [];
	url_list_data: String;
	_pipeLabel: any;

	constructor(
		private _Configuration: Configuration,
		private _MDepartmentService: MDepartmentService,
		private _MCurrencyService: MCurrencyService,
		private _MUserService: MUserService,
		private _MUserDepartmentService: MUserDepartmentService,
		private _ToastrService: ToastrService,
	){
		this._pipeLabel = new LabelPipe();
		/*==============================================
		 * Get List Currency
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCurrencyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { value: res.data[key].id, label: res.data[key].name + '(' + res.data[key].symbol + ')' };
						options.push(obj);
					}
					this.currencyOptions = options;
				}
			}
		});

		this.getDepartmentOption(this.filter);
	}

	ngOnInit(){
		this.intervalRouteChanges = setInterval(() => {
			this._Configuration.allow_change_page = (this.users.length == 0);
		}, 1000);
	}

	ngAfterViewInit() {
		this.url_list_data = this._MUserService._list_data_URL;
		let self = this,
			_list_data_URL = this.url_list_data + '?has_invisible_data=1',
			Configuration = this._Configuration;

		this.DTList = $('#tbl-data').DataTable({
			autoWidth: false,
			paging: false,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
			    'url': _list_data_URL,
			    'type': 'GET',
			    'beforeSend': function (request) {
			        request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
			    },
			    xhrFields: {
		            withCredentials: true
		        }
			},
			columns: [
						{ 'data': 'staff_no' },
						{ 'data': 'user_id' },
						{ 'data': 'fullname' },
						{ 'data': 'position_name' },
						{ 'data': 'business_name_code' },
						{ 'data': 'division_name_code' },
						{ 'data': 'department_name_code' },
						{ 'data': 'enable_start_date' },
						{ 'data': 'enable_end_date' },
						{ 'data': null }
					],
			columnDefs: [
							{
								targets: [2],
								render: function (data, type, full) {
									return '<a class="edit-record" href="#" id="btn_edit" title="編集">' + data + '</a>';
								}
							},
							{
								targets: [7, 8],
								className: 'text-center',
								render: function(data, type, full){
									let date_time = moment(data, 'YYYY-MM-DD');
									if(date_time.isValid()){
										return date_time.format(Configuration.formatDateTS);
									}else{
										return "";
									}
								}
							},
							{
								targets: [9],
								className: 'text-center',
								data: null,
								bSortable: false,
								render: function (data, type, full) {
									return '<a class="edit-record" href="#" id="btn_edit" title="詳細"><i class="fa fa-info"></i></a>';
								}
							},
			],
			order: [[0, "asc"]],
			fnRowCallback: function(row, data, index) {
				self.users.push({
					'm_user_id': data.id,
					'fullname': data.fullname,
					'fullname_kana': data.fullname_kana,
					'staff_no': data.staff_no,
					'm_department_id': data.m_department_id,
					'm_position_id': data.m_position_id
				});
			}
		});

		$('#tbl-data tbody').on( 'click', '#btn_edit', function () {
			let id: number = $(this).parents('tr').attr('id');
			self.onDetail(id);
			return false;
	    });
	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectDepartmentChange(event, area?:string, type?: string, index?: string){
		switch(area){
			case "company":
				if(type == 'deselected'){
					if(index == 'old'){
						this.filter['m_company_id'] = null;
					}else{
						this.replace['m_company_id'] = null;
					}
				}else{
					if(index == 'old'){
						this.filter['business_id'] = null;
					}else{
						this.replace['business_id'] = null;
					}
				}
			case "business":
				if(type == 'deselected'){
					if(index == 'old'){
						this.filter['business_id'] = null;
					}else{
						this.replace['business_id'] = null;
					}
					
				}else{
					if(index == 'old'){
						this.filter['division_id'] = null;
					}else{
						this.replace['division_id'] = null;
					}
				}
			case "division":
				if(type == 'deselected'){
					if(index == 'old'){
						this.filter['division_id'] = null;
					}else{
						this.replace['division_id'] = null;
					}
					
				}else{
					if(index == 'old'){
						this.filter['department_id'] = null;
					}else{
						this.replace['department_id'] = null;
					}
				}
			case "department":
				if(type == 'deselected'){
					if(index == 'old'){
						this.filter['department_id'] = null;
					}else{
						this.replace['department_id'] = null;
					}	
				}
				break;
		}

		if(type == 'selected') {
			let key_id = 'm_company_id';
			if (area != 'company') {
				key_id = area + '_id';
			}

			if(index == 'old'){
				this.filter[key_id] = event.id;
			}else{
				this.replace[key_id] = event.id;
			}
		}

		let request = {};
		if(index == 'old'){
			this.resetListUsers();
			request = this.filter;
		}else{
			request = this.replace;	
		}
		
		this.getDepartmentOption(request, index);
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
	getDepartmentOption(request, index?: string, area?:string){
		let self = this;
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		if(index){
			this.businessOptions[index] = [{ id: request['business_id'], text: null }];
			this.divisionOptions[index] = [{ id: request['division_id'], text: null }];
			this.departmentOptions[index] = [{ id: request['department_id'], text: null }];
		}else{
			this.businessOptions['old'] = [{ id: request['business_id'], text: null }];
			this.divisionOptions['old'] = [{ id: request['division_id'], text: null }];
			this.departmentOptions['old'] = [{ id: request['department_id'], text: null }];

			this.businessOptions['new'] = [{ id: request['business_id'], text: null }];
			this.divisionOptions['new'] = [{ id: request['division_id'], text: null }];
			this.departmentOptions['new'] = [{ id: request['department_id'], text: null }];
		}
		
		
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_company_id', request['m_company_id']);
		params.set('business_id', request['business_id']);
		params.set('division_id', request['division_id']);
		params.set('department_id', request['department_id']);
		this._MDepartmentService.getListOption(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data.options != null){
					for (let key in res.data.options) {
						switch (key) {
							case "business":
								if(index){
									this.businessOptions[index] = res.data.options[key];
								}else{
									this.businessOptions['old'] = res.data.options[key];
									this.businessOptions['new'] = res.data.options[key];
								}							
								break;
							case "division":
								if(index){
									this.divisionOptions[index] = res.data.options[key];
								}else{
									this.divisionOptions['old'] = res.data.options[key];
									this.divisionOptions['new'] = res.data.options[key];
								}
								break;
							case "department":
								if(index){
									this.departmentOptions[index] = res.data.options[key];
								}else{
									this.departmentOptions['old'] = res.data.options[key];
									this.departmentOptions['new'] = res.data.options[key];
								}
								break;
						}
					}

				}

				setTimeout(function(){
					switch(index){
						case 'old':
							if(res.data.m_company_id) self.filter['m_company_id'] = res.data.m_company_id;
							if(res.data.business_id) self.filter['business_id'] = res.data.business_id;
							if(res.data.division_id) self.filter['division_id'] = res.data.division_id;
							if(res.data.department_id) self.filter['department_id'] = res.data.department_id;
							break;
						case 'new':
							if(res.data.m_company_id) self.replace['m_company_id'] = res.data.m_company_id;
							if(res.data.business_id) self.replace['business_id'] = res.data.business_id;
							if(res.data.division_id) self.replace['division_id'] = res.data.division_id;
							if(res.data.department_id) self.replace['department_id'] = res.data.department_id;
							break;
						default:
							if(res.data.m_company_id) self.filter['m_company_id'] = res.data.m_company_id;
							if(res.data.business_id) self.filter['business_id'] = res.data.business_id;
							if(res.data.division_id) self.filter['division_id'] = res.data.division_id;
							if(res.data.department_id) self.filter['department_id'] = res.data.department_id;
							self.replace = Object.assign({},self.filter);
							break;
					}

				}, 500);
			}
		});
	}

	onSearch(){
		//reset users array
		this.users = [];
		if(this.filter['department_id'] && this.filter['enable_date']){
			let _list_data_URL = this._MUserService._list_data_URL + '?user_activation=1&' + $.param(this.filter);
			this.DTList.ajax.url(_list_data_URL).load();
		}else{
			this._ToastrService.error('部署を選択してください。');
		}
	}

	/*=======================================
	 * Validate to enable|disable button save
	 *=======================================*/	
	onValidate(){
		return !(this.filter['department_id'] && this.filter['enable_date'] && this.replace['department_id']);	
	}

	/*=======================================
	 * Save to new department
	 *=======================================*/
	onSave(){
		this.modal.close();
		if(this.filter['department_id'] && this.replace['department_id']){
			if(this.filter['department_id'] == this.replace['department_id']
				&& this.filter['division_id'] == this.replace['division_id']
				&& this.filter['business_id'] == this.replace['business_id']){
				this._ToastrService.error('新部署と旧部署が重なっています。');
			}else{
				if(this.users.length){
					let params: URLSearchParams = new URLSearchParams();
					params.set('enable_date', this.filter['enable_date']);
					params.set('m_department_id', this.replace['department_id']);
					params.set('m_user_department', JSON.stringify(this.users));
					this._MUserDepartmentService.changeUserDepartment(params).subscribe(res => {
						if(res.status == 'success'){
							this._ToastrService.success('部署異動を行いました。');
							this.replace = {};
							this.getDepartmentOption(this.replace, 'new');
							this.onSearch();
						}
					});
				}else{
					this._ToastrService.warning('部署異動の対象ユーザーがありません。再度、検索してください。');
				}
			}
		}else{
			this._ToastrService.error('部署を選択してください。');
		}
	}

	onClear(){
		this.filter = {};
		this.getDepartmentOption(this.filter);
		this.resetListUsers();
	}

	onDetail(id: number){
		this.modalinfo.open();
		let params: URLSearchParams = new URLSearchParams();
		params.set('has_user_department', 'true');

		this._MUserService.getByID(id, params).subscribe(res => {
			if (res.status == 'success') {
				this.user_info = res.data;
				let m_currency = this._pipeLabel.transform(this.currencyOptions,res.data.m_currency_id);
				let currency = m_currency.shift();
				this.user_info['currency_name'] = currency.label;
			}
		});
		
	}

	resetListUsers(){
		this.users = [];
		let _list_data_URL = this._MUserService._list_data_URL + '?has_invisible_data=1';
		this.DTList.ajax.url(_list_data_URL).load();
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
		this.modalinfo.ngOnDestroy();
		clearInterval(this.intervalRouteChanges);
	}
}