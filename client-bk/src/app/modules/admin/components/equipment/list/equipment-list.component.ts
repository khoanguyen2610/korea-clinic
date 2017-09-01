import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, EquipmentService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BreadcrumbComponent, FooterComponent, HeaderComponent, MainNavComponent } from '../../general';

declare var $: any;

@Component({
	selector: 'app-equipment-list',
	templateUrl: './equipment-list.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;
	@ViewChild('modal') modal: ModalComponent;

	delete_item_key: string;
	url_list_data: String;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _EquipmentService: EquipmentService,

		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {
		this.subscription = _ActivatedRoute.queryParams.subscribe((params:any) => {

		});

		this.url_list_data = this._EquipmentService._list_data_URL;
	}

	ngOnInit(){

	}

	ngAfterViewInit(){
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			Configuration = this._Configuration;
		this.DTList = $('#tbl-data').DataTable({
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
				{ 'data':'title' },
				{ 'data':'content' },
				{ 'data':'language_name' },
				{ 'data': null },
			],
			columnDefs: [
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
		this._Router.navigate(['/admin/equipment/form/update/' + id], {queryParams: { item_key: item_key }} );
	}

	onOpenConfirm(item_key: string){
		this.delete_item_key = item_key;
		this.modal.open();
	}

	onConfirmDelete(){
		this.modal.close();
		this._EquipmentService.deleteItemKey(this.delete_item_key).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('Deleted!');
				this.DTList.ajax.url(this._EquipmentService._list_data_URL).load();
			}
		})
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}
}