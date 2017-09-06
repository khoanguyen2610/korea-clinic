import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, ServiceCategoryService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
declare let $:any;

@Component({
	selector: 'app-service-category-list',
	templateUrl: './service-category-list.component.html',
	providers: [ ServiceCategoryService ]
})

export class ServiceCategoryListComponent implements OnInit {
	private subscription: Subscription;
	// private subscriptionEvents: Subscription;
	private DTList;
	@ViewChild('modal') modal: ModalComponent;

	delete_id: number;
	url_list_data: String;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _ServiceCategoryService: ServiceCategoryService,

		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {
		this.subscription = _ActivatedRoute.queryParams.subscribe((params:any) => {

		});

		this.url_list_data = this._ServiceCategoryService._list_data_URL + '?language_code=vi&recursive=true';
	}

	ngOnInit(){

	}

	ngAfterViewInit() {
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			Configuration = this._Configuration;
		var datatable = this.DTList = $('#tbl-data').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			// order: [[1, 'asc']],
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
				{ 'data': null },
				{ 'data': 'title' },
				{ 'data': 'language_name' },
				{ 'data': null },
			],
			columnDefs: [
				{
					searchable: false,
					orderable: false,
					targets: [0]
				},
				{
					className: 'text-left',
					orderable: false,
					targets: [1]
				},
				{
					render: function(data, type, full) {
						var html = '<a class="btn btn-xs purple edit-record" id="btn_edit"><i class="fa fa-pencil"></i></a>'
							+ '&nbsp;'
							+ '<a class="btn btn-xs red del-record" id="btn_delete" ><i class="fa fa-trash"></i></a>';
						return html;
					},
					data: null,
					bSortable: false,
					orderable: false,
					className: 'text-center',
					targets: [3]
				},
			]
		});

		datatable.on('order.dt search.dt', function() {
			datatable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function(cell, i) {
				cell.innerHTML = i + 1;
			});
		}).draw();


		$('#tbl-data tbody').on( 'click', '#btn_edit', function () {
			let tr = $(this).parents('tr');
			let obj = self.DTList.row(tr).data();
			self.onRoutingUpdate(obj.id, obj.item_key);
			return false;
		});

		$('#tbl-data tbody').on( 'click', '#btn_delete', function () {
			let id: number = $(this).parents('tr').attr('id');
			self.onOpenConfirm(id);
			return false;
		});
	}

	onRoutingUpdate(id: number, item_key: string){
		this._Router.navigate(['/admin/service-category/form/update/' + id], {queryParams: { item_key: item_key }} );
	}

	onOpenConfirm(id: number){
		this.delete_id = id;
		this.modal.open();
	}

	onConfirmDelete(){
		this.modal.close();
		this._ServiceCategoryService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('Record has been deleted successfully.');
				this.DTList.ajax.url(this._ServiceCategoryService._list_data_URL).load();
			}
		})
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}

}
