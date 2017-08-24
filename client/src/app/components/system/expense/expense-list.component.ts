import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from '../../../shared';
import { MExpenseItemService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './expense-list.component.html',
	providers: [ MExpenseItemService ]
})

export class ExpenseListComponent implements OnInit{
	private subscription: Subscription;
	private DTList;
	_param = {};
	filter = {};
	delete_id: number;
	@ViewChild('modal') modal: ModalComponent;
	url_list_data: String;

	public expense_type_code = [
		{'value':'01','label':'交通機関種別'},
		{'value':'02','label':'購入種別'},
		{'value':'04','label':'出張その他'},
		{'value':'05','label':'飲食種別(社内)'},
		{'value':'06','label':'飲食種別(社外)'},
	];

	public enable_flg = [
		{'value':'0','label':'無'},
		{'value':'1','label':'有'},
	];

	public receipt_flg = [
		{'value':'0','label':'不要'},
		{'value':'1','label':'要'},
	];

	constructor(
		private _Configuration: Configuration,
		private _MExpenseItemService: MExpenseItemService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router 
	){ }

	ngOnInit(){
		let url_params: URLSearchParams = new URLSearchParams();
		//set default value
		this.filter = {
			'type_code': '01'
		};
		this.subscription = this._ActivatedRoute.queryParams.subscribe((params:any) => {
		 	for(var k in params){
		 		url_params.set(k,params[k]);
		 		this.filter[k] = params[k];
		 	}
		 	if(url_params.toString()==''){
		 		url_params.set('type_code','01');
		 	}
		 	this.url_list_data = this._MExpenseItemService._list_data_URL + '?' + url_params.toString();
		})
	}

	ngAfterViewInit() {
		let self = this,
			_list_data_URL = this.url_list_data,
			en_flg = this.enable_flg,
			rc_flg = this.receipt_flg,
			Configuration = this._Configuration;
		//load datatable
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
				{ 'data':'item_name_code' },
				{ 'data':'item' },
				{ 'data':'item_e' },
				{ 'data':'enable_flg' },
				{ 'data':'receipt_flg' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
				{
					render: function(data, type, full){
						var html = '';
						$.each(en_flg,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
					className: 'text-center',
					targets: [3],
				},
				{
					render: function(data, type, full){
						var html = '';
						$.each(rc_flg,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
					className: 'text-center',
					targets: [4],
				},
				{
			        targets: [5],
					className: 'text-center',
			        data: null,
			        bSortable: false,
			        render: function (data, type, full) {
			            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
			        }
			    },
			    {
			        targets: [6],
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
		this._Router.navigate(['/system/expense/update/', id]);
	}

	onOpenConfirm(id: number){
		this.delete_id = id;
		this.modal.open('sm');
	}

	onConfirmDelete(){
		this.modal.close();
		this._MExpenseItemService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('データを削除しました。');
				this.DTList.ajax.url(this._MExpenseItemService._list_data_URL).load();
			}
		})
	}

	onChange(value: string){
		this.filter = { 'type_code': value },
		this.onSearch();
	}

	onSearch(){
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/system/expense'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._MExpenseItemService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	onReset(){
		this.filter = { 'type_code': '01' };
		this._Router.navigate(['/system/expense']);
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._MExpenseItemService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}
}