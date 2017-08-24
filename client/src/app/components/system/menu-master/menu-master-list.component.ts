import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import { MMenuService, MDepartmentService } from '../../../services';
import { MMenu } from '../../../models';
import { Configuration } from '../../../shared';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
@Component({
	selector: 'app-system-menu-master-list',
	templateUrl: './menu-master-list.component.html',
	providers: [MMenuService, MDepartmentService]
})
export class MenuMasterListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;

	_param = {};
	filter = {};
	filterModal = {};
	clients = [];
	dataModal = [];
	departments: Array<any> = [];
	objStatus = [
		{value: 0, label: '無効'},
		{value: 1, label: '有効'}
	];
	@ViewChild('modal') modal: ModalComponent;

	constructor(
		private _MMenuService: MMenuService,
		private _MDepartmentService: MDepartmentService,
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router) {

		// subscribe to router event
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this._param = param;
		});

		// Add more element for objStatus
		this.objStatus.push({value: 2, label: '下書'});

		if (this._param['name']) {
			this.filter['name'] = this._param['name'];
		}

		if (this._param['enable_flg']) {
			this.filter['enable_flg'] = this._param['enable_flg'];
		} else {
			//Set default status enable flg
			this.filter['enable_flg'] = '1';
		}


	}

	ngOnInit() {
		// Get list division
		let params: URLSearchParams = new URLSearchParams();
		params.set('level', '2');
		params.set('item_status', 'active');
		params.set('has_menu_master', 'true');
		this.departments = [{ id: null, text: null }];
		this._MDepartmentService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				var departments = [];
				for (let key in res.data) {
					departments.push({ id: res.data[key].id, text: res.data[key].name });
				}
				this.departments = departments;

				if (this._param['m_department_id']) {
					setTimeout(() => {
						this.filter['m_department_id'] = this._param['m_department_id']
					}, 1000)
				}
			}
		});

	}

	ngAfterViewInit() {
		let self = this,
			_list_data_URL = this._MMenuService._list_data_URL + '?' + $.param(this.filter),
			objStatus = this.objStatus,
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
				{ 'data': 'name' },
				{ 'data': 'description' },
				{ 'data': 'department_name' },
				{ 'data': 'position_name' },
				{ 'data': 'enable_flg' },
				{ 'data': 'add_file_flg' }
			],
			columnDefs: [
				{
					"render": function(data, type, row) {
						var html = '';
						$.each(objStatus,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
					targets: [4]
				},
				{
					"render": function(data, type, row) {
						var html = '';
						$.each(objStatus,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
					targets: [5]
				},
				{
					targets: [6],
					className: 'text-center',
					data: null,
					render: function(data, type, full) {
						return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
					}
				}
			],
			order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) { }
		});

		$('#tbl-data tbody').on('click', '#btn_edit', function() {
			let id: number = $(this).parents('tr').attr('id');
			self.onRoutingUpdate(id);
			return false;
		});

	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e){
		// Set value of select 2 to ngModel
		this.filter['m_department_id'] = e.id;
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e){
		// Reset value of select 2 to ngModel
		this.filter['m_department_id'] = null;
	}



	/*====================================
	 * Search Filter
	 *====================================*/
	onSearch() {
		// Reload Datatable
		let _list_data_URL = this._MMenuService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();

		// Change URL when submit
		this._Router.navigate(['/system/menu-master'], { queryParams: this.filter });
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {
			enable_flg: '1'
		};

		this.onSearch();

	}

	/*====================================
	 * Routing Update
	 *====================================*/
	onRoutingUpdate(id: number) {
		this._Router.navigate(['/system/menu-master/update/', id]);
	}

	/*====================================
	 * Open Modal Sortable
	 *====================================*/
	onChangeSelectModal(e) {
		// Set value of select 2 to ngModel
		this.filterModal['m_department_id'] = e.id;
		// Get list department
		let params: URLSearchParams = new URLSearchParams();
		params.set('enable_flg', '1');
		params.set('item_status', 'active');
		params.set('m_department_id', this.filterModal['m_department_id']);
		params.set('sort_order', 'ASC');

		this._MMenuService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				var departments = [];
				for (let key in res.data) {
					departments.push({id: res.data[key].id, name: res.data[key].name });
				}
				this.dataModal = departments;

			}
		});

	}

	/*====================================
	 * Save Order
	 *====================================*/
	onSaveOrder() {
		if(this.dataModal.length){
			let params: URLSearchParams = new URLSearchParams();
			for (let key in this.dataModal) {
				params.append('ids[]', this.dataModal[key].id);
			}

			this._MMenuService.updateOrder(params).subscribe(res => {
				if (res.status == 'success') {
					this._ToastrService.success('様式の順位を調整しました。');
				}
			});
		}
	}

	/*====================================
	 * Open modal popup
	 *====================================*/
	onOpenModal() {
		this.modal.open();
		this.filterModal = {};
		this.dataModal = [];
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}
}
