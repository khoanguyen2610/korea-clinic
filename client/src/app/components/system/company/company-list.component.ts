import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { BreadcrumbComponent } from '../../general';
import { Configuration } from '../../../shared';
import { MCompanyService } from '../../../services';

declare let $: any;

@Component({
	selector: 'app-company-list',
	templateUrl: './company-list.component.html',
	providers: [ MCompanyService ]
})
export class CompanyListComponent implements OnInit {
	private DTList;
	delete_id: number;
	@ViewChild('modal') modal: ModalComponent;

	constructor(
		private _Configuration: Configuration,
		private _MCompanyService: MCompanyService,
		private _ToastrService: ToastrService,
		private _Router: Router,
		private _Location: Location
	) { }

	ngOnInit() {

	}

	ngAfterViewInit(){
		let self = this;
		//load datatable
		let _list_data_URL = this._MCompanyService._list_data_URL,
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
				'beforeSend': function (request) {
					request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
				},
			    xhrFields: {
		            withCredentials: true
		        }
			},
			columns: [
				{ 'data':'code' },
				{ 'data':'name' },
				{ 'data':'name_e' },
				{ 'data':'domain' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
				{
					targets: [4],
					className: 'text-center',
					data: null,
					bSortable: false,
					render: function (data, type, full) {
							return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
						}
				}, {
					targets: [5],
					className: 'text-center',
					data: null,
					bSortable: false,
					render: function (data, type, full) {
						return '<a class="del-record" href="#" id="btn_delete" title="削除"><i class="fa fa-trash"></i></a>';
					}
				}
			],
			order: [
				[0, "asc"]
			]
		});

		$('#tbl-data tbody').on('click', '#btn_edit', function(){
			let id: number = $(this).parents('tr').attr('id');
			self.onRoutingUpdate(id);
			return false;
		});

		$('#tbl-data tbody').on('click', '#btn_delete', function(){
			let id: number = $(this).parents('tr').attr('id');
			self.onOpenConfirm(id);
			return false;
		});
	}

	onRoutingUpdate(id: number) {
		this._Router.navigate(['/system/company/update', id])
	}

	onOpenConfirm(id: number) {
		this.delete_id = id;
		this.modal.open('sm');
	}

	onConfirmDelete(){
		this.modal.close();
		this._MCompanyService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('データを削除しました。');
				this.DTList.ajax.url(this._MCompanyService._list_data_URL).load();
			}
		})
	}

	ngOnDestroy(){
        this.modal.ngOnDestroy();
    }
 }
