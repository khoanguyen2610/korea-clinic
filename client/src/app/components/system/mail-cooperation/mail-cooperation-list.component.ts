import { Component, OnInit, ViewChild,  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { MDepartmentService, MCompanyService, TMailCooperationService, MPositionService, MUserService, MMenuService, MAuthorityService } from '../../../services';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-system-mail-cooperation-list',
	templateUrl: './mail-cooperation-list.component.html',
	providers: [MDepartmentService, MCompanyService, TMailCooperationService, MPositionService, MUserService, MMenuService, MAuthorityService]
})
export class MailCooperationListComponent implements OnInit {
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
	modaldivisionMenuOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	modalDepartmentOptions: Array<any> = [];
	enableStartDateOptions: Array<any> = [];
	positionOptions: Array<any> = [];

	Item = {};
	_param = {};

	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	processConcurrent = new UserConcurrent();
	url_list_data: String;
	selectedItem = {};
	remove_index: any;
	error_same_date = false;
	delete_id: number;
	delete_fullname: string = '';

	constructor(private _Router: Router, 
		private _Configuration: Configuration, 
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _TMailCooperationService: TMailCooperationService,
		private _MPositionService: MPositionService,
		private _MUserService: MUserService,
		private _MMenuService: MMenuService,
		private _MAuthorityService: MAuthorityService,
		private _ActivatedRoute: ActivatedRoute,
		private _ToastrService: ToastrService
	) { 
		let self = this;
		
		// subscribe to router event
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this._param = param;
		});

	}

	ngOnInit(){}


	/*====================================
	 * Routing Update
	 *====================================*/
	onRoutingUpdate(id: number) {
		this._Router.navigate(['/system/mail-cooperation/update/', id]);
	}


	ngAfterViewInit(){
		this.url_list_data = this._TMailCooperationService._list_data_URL;
		let self = this,
			_list_data_URL = this.url_list_data,
			Configuration = this._Configuration;
		this.DTList = $('#tbl-data').DataTable({
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
				{ 'data': 'staff_no' },
				{ 'data': 'fullname' },
				{ 'data': 'company_name' },
				{ 'data': 'business_name' },
				{ 'data': 'division_name' },
				{ 'data': 'department_name' },
				{ 'data': 'position_name' },
				{ 'data': 'menu_name' },
				{ 'data': 'approval_status_name' },
				{ 'data': 'to_email' },

			],
			columnDefs: [
				{
					targets: [7],
					data: null,
					render: function(data, type, full) {
						if (full.petition_type === '1') {
							return data;
						} else {
							return full.menu_request_name;
						}
					}
				},
				{
					targets: [10],
					className: 'text-center',
					data: null,
					bSortable: false,
					render: function(data, type, full) {
						return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
					}
				}, {
					targets: [11],
					className: 'text-center',
					data: null,
					bSortable: false,
					render: function(data, type, full) {
						return '<a class="del-record" data-full-name="' + full.fullname + '" href="#" id="btn_delete" title="削除"><i class="fa fa-trash"></i></a>';
					}
				}
			],
			order: [
				[0, "asc"]
			]
		})

		$('#tbl-data tbody').on('click', '#btn_edit', function() {
			let id = $(this).parents('tr').attr('id');
			self.onRoutingUpdate(id);
			return false;
		})

		$('#tbl-data tbody').on('click', '#btn_delete', function() {
			let id = $(this).parents('tr').attr('id');
			let fullname = $(this).data('full-name');
			self.onOpenConfirm(id, fullname);
			return false;
		})
	}

	/*====================================
	 * Function open modal confirm delete
	 *====================================*/
	onOpenConfirm(id: number, fullname?: string) {
		this.delete_id = id;
		this.delete_fullname = fullname;
		this.modalConfirm.open('sm');
	}

	/*=================================
	 * Delete row data
	 *=================================*/
	onDelete() {
		this._TMailCooperationService.delete(this.delete_id).subscribe(res => {
			if (res.status == 'success') {
				this._ToastrService.success('削除しました。');
				// Reload DataTable
				let _list_data_URL = this._TMailCooperationService._list_data_URL;
				this.DTList.ajax.url(_list_data_URL).load();
				this.modalConfirm.close();
			}
		})
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
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
