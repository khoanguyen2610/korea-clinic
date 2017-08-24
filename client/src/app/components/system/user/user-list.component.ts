import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MUserService, MDepartmentService, MCompanyService, MPositionService, AuthService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;
declare let window: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './user-list.component.html',
	providers: [MUserService, MDepartmentService, MCompanyService, MPositionService, AuthService]
})

export class UserListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;
	delete_id: number;
	delete_fullname: string = '';
	_filter = {};
	filter = {};
	url_list_data: String;
	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	positionOptions: Array<any> = [];
	current_user_info = {};

	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modal_export') modal_export: ModalComponent;

	export_date: string = '';


	constructor(
		private _Configuration: Configuration,
		private _MUserService: MUserService,
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _MPositionService: MPositionService,
		private _ActivatedRoute: ActivatedRoute,
		private _ToastrService: ToastrService,
		private _AuthService: AuthService,
		private _Router: Router
	) {
		//current user
		this.current_user_info = this._AuthService.getCurrent();

		let self = this;
		this.export_date = moment().format(_Configuration.formatDateTS);
		let url_params: URLSearchParams = new URLSearchParams();
		this.subscription = this._ActivatedRoute.queryParams.subscribe((params:any) => {
		 	for(var k in params){
		 		url_params.set(k,params[k]);
		 		this.filter[k] = params[k];
		 	}
		 	this.url_list_data = this._MUserService._list_data_URL + '?' + url_params.toString();
		})
		/*==============================================
		 * Get List Company
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this.companyOptions = [{ id: this.filter['m_company_id'], text: null }];
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
		this.positionOptions = [{ id: this.filter['m_position_id'], text: null }];
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
	 	this.getDepartmentOption(this.filter);
	}

	ngOnInit(){

	}
	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e, area){
		// Set value of select 2 to ngModel
		switch (area) {
			case "posistion":
				this.filter['m_position_id'] = e.id;
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
				this.filter['m_position_id'] = null;
				break;
		}
	}

	onSelectFilterChange(event, area?:string, type?: string){
		switch (area) {
			case "company":
				if(type == 'deselected'){
					this.filter['m_company_id'] = null;
				}else{
					this.filter['business_id'] = null;
				}
			case "business":
				if(type == 'deselected'){
					this.filter['business_id'] = null;
				}else{
					this.filter['division_id'] = null;
				}
			case "division":
				if(type == 'deselected'){
					this.filter['division_id'] = null;
				}else{
					this.filter['department_id'] = null;
				}
			case "department":
				if(type == 'deselected'){
					this.filter['department_id'] = null;
				}
				break;
		}

		if(!type) {
			let key_id = 'm_company_id';
			if (area != 'company') {
				key_id = area + '_id';
			}
			this.filter[key_id] = event.id;
		}

		this.getDepartmentOption(this.filter);
	}

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
		params.set('department_id', request['department_id']);
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
					if(res.data.m_company_id) self.filter['m_company_id'] = res.data.m_company_id;
					if(res.data.business_id) self.filter['business_id'] = res.data.business_id;
					if(res.data.division_id) self.filter['division_id'] = res.data.division_id;
					if(res.data.department_id) self.filter['department_id'] = res.data.department_id;
				}, 500);
			}
		});
	}

	ngAfterViewInit() {
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			Configuration = this._Configuration;
			//truncate.transform('test truncate string',['20','....']);

		this.DTList = $('#tbl-data').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
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
						{ 'data':'staff_no' },
						{ 'data':'user_id' },
						{ 'data':'fullname' },
						{ 'data':'position_name' },
						{ 'data':'business_name_code' },
						{ 'data':'division_name_code' },
						{ 'data':'department_name_code' },
						{ 'data': null },
						{ 'data': null },
					],
			columnDefs: [
							{
						        targets: [7],
								className: 'text-center',
						        data: null,
						        bSortable: false,
						        render: function (data, type, full) {
						            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
						        }
						    },
						    {
						        targets: [8],
								className: 'text-center',
						        data: null,
						        bSortable: false,
						        visible: (self.current_user_info['permission_system'] || self.current_user_info['permission_hr'])?true:false,
						        render: function (data, type, full) {
						        	if(self.current_user_info['permission_system'] || self.current_user_info['permission_hr'] ){
						            	return '<a class="del-record" data-full-name="' + full.fullname + '" href="#" id="btn_delete" title="削除"><i class="fa fa-trash"></i></a>';
						            }
						            return "";
						        }
						    }
						],
			order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) {}
		});

		$('#tbl-data tbody').on( 'click', '#btn_edit', function () {
			let id: number = $(this).parents('tr').attr('id');
			self.onRoutingUpdate(id);
			return false;
		});

	    $('#tbl-data tbody').on( 'click', '#btn_delete', function () {
			let id: number = $(this).parents('tr').attr('id');
			let fullname = $(this).data('full-name');
			self.onOpenConfirm(id, fullname);
			return false;
	    });
	}

	onRoutingUpdate(id: number){
		this._Router.navigate(['/system/user/update/', id]);
	}


	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {};
		this.getDepartmentOption(this.filter);
		this.onSearch();
	}

	/*====================================
	 * Function filter data search
	 *====================================*/
	onSearch() {
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/system/user'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._MUserService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	/*====================================
	 * Function open modal confirm delete
	 *====================================*/
	onOpenConfirm(id: number, fullname?:string){
		this.delete_id = id;
		this.delete_fullname = fullname;
		this.modal.open('sm');
	}

	/*====================================
	 * Function delete user
	 *====================================*/
	onConfirmDelete(){
		let _list_data_URL = this._MUserService._list_data_URL + '?' + $.param(this.filter);
		this.modal.close();
		this._MUserService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('データを削除しました。');
				this.DTList.ajax.url(_list_data_URL).load();
			}
		})
	}

	/*====================================
	 * Function export list user
	 *====================================*/
	onExportUser(form: NgForm){
		if(form.valid){
			var params: URLSearchParams = new URLSearchParams();
			params.set('export_date', this.export_date);

			var windowReference = window.open();
			this._MUserService.exportListUser(params).subscribe(res => {
				if(res.status == 'success'){
					// windowReference.location.href = res.data.url;
					let url = res.data.url;
					window.location.href = url;
					windowReference.location.href = url;
					windowReference.close();
					this.modal_export.close();
				}
			})
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
		this.modal_export.ngOnDestroy();
	}
}
