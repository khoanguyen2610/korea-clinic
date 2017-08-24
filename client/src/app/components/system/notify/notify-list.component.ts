import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { Configuration } from '../../../shared';
import { TNotifyService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './notify-list.component.html',
	providers: [TNotifyService]
})

export class NotifyListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;
	_param = {};
	filter = {};
	delete_id: number;
	@ViewChild('modal') modal: ModalComponent;

	public release_flg = [
		{'value':'none','label':'(指定なし)'},
		{'value':'0','label':'非公開'},
		{'value':'1','label':'公開'}
	];

	public notice_type = [
		{'value':'none','label':'(指定なし)'},
		{'value':'01','label':'バージョンアップ'},
		{'value':'02','label':'お知らせ'},
		{'value':'03','label':'メンテナンス'},
		{'value':'99','label':'その他'}
	];
	url_list_data: String;

	constructor(
		private _Configuration: Configuration,
		private _TNotifyService: TNotifyService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	) { }

	ngOnInit() {
		let url_params: URLSearchParams = new URLSearchParams();
		//set default value
		this.filter = {
			type : 'none',
			release_flg : 'none'
		};
		this.subscription = this._ActivatedRoute.queryParams.subscribe((params:any) => {
		 	for(var k in params){
		 		url_params.set(k,params[k]);
		 		this.filter[k] = params[k];
		 	}
		 	this.url_list_data = this._TNotifyService._list_data_URL + '?' + url_params.toString();
		})
	}

	ngAfterViewInit() {
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			nt  = this.notice_type,
			rf  = this.release_flg,
			Configuration = this._Configuration;
			//truncate.transform('test truncate string',['20','....']);
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
				{ 'data':'date' },
				{ 'data':'type' },
				{ 'data':'title' },
				{ 'data':'content_dtb_output' },
				{ 'data':'release_flg' },
				{ 'data': null },
				{ 'data': null }
			],
			columnDefs: [
				{
					render: function(data, type, full){
						var parsedDate = Date.parse(data);
					   	if(isNaN(parsedDate)){
					   		return "";
					   	}else{
							return moment(parsedDate).format(Configuration.formatDateTS);
					   	}
					},
					targets: [0],
				},
				{
					render: function(data, type, full){
						var html = '';
						$.each(nt,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
					targets: [1],
				},
				{
					render: function(data, type, full){
						var html = '';
						$.each(rf,function(i,arr){
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
			        render: function (data, type, full) {
			            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
			        },
			        data: null,
			        bSortable: false,
					className: 'text-center',
			        targets: [5]
			    },
			    {
			        
			        render: function (data, type, full) {
			            return '<a class="del-record" href="#" id="btn_delete" title="削除"><i class="fa fa-trash"></i></a>';
			        },
			        data: null,
			        bSortable: false,
					className: 'text-center',
			        targets: [6]
			    }
		    ],
			order: [[0, "desc"]],
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
		this._Router.navigate(['/system/notify/update/', id]);
	}

	onOpenConfirm(id: number){
		this.delete_id = id;
		this.modal.open('sm');
	}

	onConfirmDelete(){
		this.modal.close();
		this._TNotifyService.delete(this.delete_id).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('データを削除しました。');
				this.DTList.ajax.url(this._TNotifyService._list_data_URL).load();
			}
		})
	}

	onSearch() {
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/system/notify'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._TNotifyService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	onReset(){
		this.filter = {
			type : 'none',
			release_flg : 'none'
		};
		this._Router.navigate(['/system/notify']);
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._TNotifyService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.modal.ngOnDestroy();
	}
}
