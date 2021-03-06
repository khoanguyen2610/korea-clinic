import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, EquipmentService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
declare var $: any;

@Component({
	selector: 'app-equipment-list',
	templateUrl: './equipment-list.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentListComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;
	private DTList;
	@ViewChild('modal') modal: ModalComponent;

	delete_id: number;
	url_list_data: String;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _EquipmentService: EquipmentService,

		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {
		this.url_list_data = this._EquipmentService._list_data_URL
	}

	ngOnInit(){

	}

	ngAfterViewInit(){
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			Configuration = this._Configuration;
		// this.DTList = $('#tbl-data').DataTable({
		// 	autoWidth: false,
		// 	pageLength: Configuration.DtbPageLength,
		// 	lengthMenu: Configuration.DtbLengthMenu,
		// 	lengthChange: true,
		// 	searching: false,
		// 	dom: '<"datatable-header clearfix"fli><"datatable-scroll table-responsive clearfix"tr><"datatable-footer clearfix"ip>',
		// 	order: [],
		// 	ajax: {
		// 		'url': _list_data_URL,
		// 		'type': 'GET',
		// 		'beforeSend': function (request) {
		// 			request.setRequestHeader('Authorization','Basic ' + self._Configuration.apiAuth);
		// 		},
		// 		xhrFields: {
		// 			withCredentials: true
		// 		}
		// 	},
		// });
	}

	onRoutingUpdate(id: number){
		this._Router.navigate(['/admin/equipment/form/update/', id]);
	}

	onOpenConfirm(id: number){
		this.delete_id = id;
		this.modal.open('sm');
	}

	onConfirmDelete(){
		this.modal.close();
		this._EquipmentService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('データを削除しました。');
				this.DTList.ajax.url(this._EquipmentService._list_data_URL).load();
			}
		})
	}

}
