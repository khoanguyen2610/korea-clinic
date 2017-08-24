import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MObicClientService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './obicclient-list.component.html',
	providers: [ MObicClientService ]
})

export class ObicClientListComponent implements OnInit{
	private DTList;
	delete_id: number;
	@ViewChild('modal') modal: ModalComponent; 
	public client_type = [
		{'value':'1','label':'自社'},
		{'value':'2','label':'他社'}
	];

	constructor(
		private _Configuration: Configuration,
		private _MObicClientService: MObicClientService,
		private _ToastrService: ToastrService,
		private _Router: Router 
	){ }

	ngOnInit(){ }

	ngAfterViewInit() {
		let self = this;
		//load datatable
		let _list_data_URL = this._MObicClientService._list_data_URL,
			Configuration = this._Configuration,
			ct = this.client_type;
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
				{ 'data':'client_code' },
				{ 'data':'client_type' },
				{ 'data':'client_name' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
				{
					render: function(data, type, full){
						var html = '';
						$.each(ct,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
					className: 'text-center',
					targets: [1],
				},
				{
			        targets: [3],
					className: 'text-center',
			        data: null,
			        bSortable: false,
			        render: function (data, type, full) {
			            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
			        }
			    },
			    {
			        targets: [4],
					className: 'text-center',
			        data: null,
			        bSortable: false,
			        render: function (data, type, full) {
			            return '<a class="del-record" href="#" id="btn_delete" title="削除"><i class="fa fa-trash"></i></a>';
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
			self.onOpenConfirm(id);
			return false;
	    });
	}

	onRoutingUpdate(id: number){
		this._Router.navigate(['/system/obic-client/update/', id]);
	}

	onOpenConfirm(id: number){
		this.delete_id = id;
		this.modal.open('sm');
	}

	onConfirmDelete(){
		this.modal.close();
		this._MObicClientService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('データを削除しました。');
				this.DTList.ajax.url(this._MObicClientService._list_data_URL).load();
			}
		})
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
	}
}