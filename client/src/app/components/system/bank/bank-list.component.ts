/*
* @Author: th_le
* @Date:   2016-11-29 13:09:27
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-20 13:13:25
*/
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { URLSearchParams } from "@angular/http";
import { Subscription } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
// import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { BreadcrumbComponent } from '../../general';
import { Configuration } from '../../../shared';
import { MBankService } from '../../../services';

declare let $: any;

@Component({
	selector: "app-bank-list",
	templateUrl: 'bank-list.component.html',
	providers: [ MBankService ]
})

export class BankListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;
	delete_id: number;
	filter = {};
	@ViewChild('modal') modal: ModalComponent;

	constructor( private _Configuration: Configuration, private _MBankService: MBankService, private _Router: Router, private _ToastrService: ToastrService, private _ActivatedRoute: ActivatedRoute, private _Location: Location ){
		let url_params: URLSearchParams = new URLSearchParams();
		this.subscription = this._ActivatedRoute.queryParams.subscribe((params: any) => {
			for(var k in params){
				url_params.set(k, params[k]);
				this.filter[k] = params[k];
			}
		})
	}

	ngOnInit () {}

	ngAfterViewInit() {
		let self = this,
			_list_data_URL = this._MBankService._list_data_URL,
			Configuration = this._Configuration;

		this.DTList = $('#tbl-data').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
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
				{ 'data':'code', 'class': 'text-center' },
				{ 'data':'name' },
				{ 'data':'name_kana' },
				{ 'data':'name_e' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
				{
					targets: [1],
					data: null,
					render: function (data, type, full) {
						return '<a class="" href="#" id="btn_branch" title="' + data + '">' + data + '</a>';
					}
				},{
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

		$('#tbl-data tbody').on('click', '#btn_branch', function(){
			let id: number = $(this).parents('tr').attr('id');
			self.onRoutingBranches(id);
			return false;
		});
	}

	/*====================================
	 * Navigate bank form update
	 *===================================*/
	onRoutingUpdate(id: number){
		this._Router.navigate(['/system/bank/update', id]);
	}

	/*====================================
	 * Open dialog confirm delete
	 *===================================*/
	onOpenConfirm(id: number) {
		this.delete_id = id;
		this.modal.open('sm');
	}

	/*======================================
	 * Navigate list brank branches of bank
	 *=====================================*/
	onRoutingBranches(id: number) {
		this._Router.navigate(['/system/bank-branch'], { queryParams: {m_bank_id : id} });
	}

	/*====================================
	 * Delete bank item
	 *===================================*/
	onConfirmDelete(){
		this.modal.close();
		this._MBankService.delete(this.delete_id).subscribe( res => {
			if(res.status == "success"){
				this._ToastrService.success('情報を登録しました。');
				this.DTList.ajax.url(this._MBankService._list_data_URL).load();
			}
		})
	}

	/*====================================
	 * Filter bank(s)
	 *===================================*/
	onSearch(){
		// Change URL when submit
		this._Router.navigate(['/system/bank'], {queryParams: this.filter});
		// Reload DataTable
		let _list_data_URL = this._MBankService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	/*========================================
	 * Clear filter input and reload DataTable
	 *=======================================*/
	onReset(){
		this.filter = {};
		this.onSearch();
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}
}