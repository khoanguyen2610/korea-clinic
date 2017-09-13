import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../../shared';
import { AuthService, NewsCategoryService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
declare let $:any;

@Component({
	selector: 'app-news-category-list',
	templateUrl: './news-category-list.component.html',
	providers: [ NewsCategoryService ]
})

export class NewsCategoryListComponent implements OnInit {
	private subscription: Subscription;
	// private subscriptionEvents: Subscription;
	private DTList;
	@ViewChild('modal') modal: ModalComponent;

	delete_id: number;
	url_list_data: String;
	filter = { language_code: 'vi' };

	public language_options = [
		{'id':'all', 'text':'All'},
		{'id':'vi', 'text':'Vietnam'},
		{'id':'en', 'text':'English'}
	];

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _NewsCategoryService: NewsCategoryService,

		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {

		// subscribe to router event
		let url_params: URLSearchParams = new URLSearchParams();
		this.subscription = _ActivatedRoute.queryParams.subscribe((param:any) => {
			for(var k in param){
				url_params.set(k,param[k]);
				this.filter[k] = param[k];
			}
		});

		if(!url_params.get('language_code')){
			url_params.set('language_code','vi');
		}

		this.url_list_data = this._NewsCategoryService._list_data_URL + '?recursive=true&image_resize_width=300&' + url_params.toString();
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
				{ 'data': 'order' },
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
					className: 'text-center',
					targets: [2,3]
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
					targets: [4]
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
		this._Router.navigate(['/admin/news-category/form/update/' + id], {queryParams: { item_key: item_key }} );
	}

	onOpenConfirm(id: number){
		this.delete_id = id;
		this.modal.open();
	}

	onConfirmDelete(){
		this.modal.close();
		this._NewsCategoryService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('Record has been deleted successfully.');
				this.DTList.ajax.url(this.url_list_data).load();
			}
		})
	}

	onSearch(){
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/admin/news-category/list'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._NewsCategoryService._list_data_URL + '?recursive=true&image_resize_width=300&' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	onReset() {
		this.filter = { language_code : 'vi' };
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/admin/news-category/list']);
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._NewsCategoryService._list_data_URL + '?recursive=true&image_resize_width=300&' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}

}
