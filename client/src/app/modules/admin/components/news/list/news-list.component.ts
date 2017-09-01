import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, NewsService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BreadcrumbComponent, FooterComponent, HeaderComponent, MainNavComponent } from '../../general';

declare var $: any;

@Component({
	selector: 'app-news-list',
	templateUrl: './news-list.component.html',
	providers: [ NewsService ]
})

export class NewsListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;
	@ViewChild('modal') modal: ModalComponent;

	delete_item_key: string;
	url_list_data: String;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _NewsService: NewsService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {
		this.subscription = _ActivatedRoute.queryParams.subscribe((params:any) => {

		});

		this.url_list_data = this._NewsService._list_data_URL + '?language_code=vi';
	}

	ngOnInit(){

	}

	ngAfterViewInit(){
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			Configuration = this._Configuration;
		let datatable = this.DTList = $('#tbl-data').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthMenu: Configuration.DtbLengthMenu,
			lengthChange: true,
			searching: false,
			dom: '<"datatable-header clearfix"fli><"datatable-scroll table-responsive clearfix"tr><"datatable-footer clearfix"ip>',
			order: [],
			ajax: {
				'url': _list_data_URL,
				'type': 'GET',
				'beforeSend': function (request) {
					request.setRequestHeader('Authorization','Basic ' + self._Configuration.apiAuth);
				},
				xhrFields: {
					withCredentials: true
				}
			},
			columns: [
				{ 'data' : null },
				{ 'data' : 'image_url' },
				{ 'data' : 'title' },
				{ 'data' : null },
			],
			columnDefs: [
				{
					searchable: false,
					bSortable: false,
					targets: [0]
				},
				{
					render: function (data, type, full) {
						var	html = '<img src="' + data + '" height="80">';
						return html;
					},
					bSortable: false,
					className: 'text-center',
					targets: [1]
				},
				{
					render: function (data, type, full) {
						var html = '<a class="btn btn-xs purple edit-record" href="#" id="btn_edit"><i class="fa fa-pencil"></i></a>'
								 + '&nbsp;'
								 + '<a class="btn btn-xs red del-record" href="#" id="btn_delete" ><i class="fa fa-trash"></i></a>';
						return html;
					},
					data: null,
					bSortable: false,
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
			let tr = $(this).parents('tr');
			let obj = self.DTList.row(tr).data();
			self.onOpenConfirm(obj.item_key);
			return false;
		});
	}

	onRoutingUpdate(id: number, item_key: string){
		this._Router.navigate(['/admin/news/form/update/' + id], {queryParams: { item_key: item_key }} );
	}

	onOpenConfirm(item_key: string){
		this.delete_item_key = item_key;
		this.modal.open();
	}

	onConfirmDelete(){
		this.modal.close();
		this._NewsService.deleteItemKey(this.delete_item_key).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('Deleted!');
				this.DTList.ajax.url(this._NewsService._list_data_URL).load();
			}
		})
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}
}