import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { URLSearchParams } from "@angular/http";
import { Subscription } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MMenuService, FormProcessService, AuthService, GeneralService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;


@Component({
	selector: 'app-management-list',
	templateUrl: './management-list.component.html',
	providers: [ MMenuService, FormProcessService, AuthService, GeneralService ]
})
export class ManagementListComponent implements OnInit {
	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	private subscription: Subscription;
	private DTList;

	menuOptions: Array<any> = [];
	url_list_data: String;
	current_user_info = {};
	_param = {};
	filter = {comment: 'none', notice_confirm_code: 'none', priority_flg: 'none', approval_user: 'me'};

	statusCheck = [];
	authorityCheck = [];
	approvalStatusCheck = [];

	public petition_status_options = [
		{'value':'2','label':'審議中'},
		{'value':'3','label':'最終承認'},
		{'value':'5','label':'否認'},
		{'value':'4','label':'差戻'},
		{'value':'6','label':'取下'},
		{'value':'7','label':'完結'}
	];

	public authority_options = [
		{'value':'2','label':'審議'},
		{'value':'3','label':'最終審議'},
		{'value':'4','label':'同報'}
	];

	public approval_status_options = [
		{'value':'1','label':'未処理'},
		{'value':'2','label':'承認'},
		{'value':'4','label':'否認'},
		{'value':'3','label':'差戻'},
		{'value':'6','label':'同報確認'},
		{'value':'7','label':'後閲確認待ち'},
		{'value':'8','label':'後閲確認済'},
		{'value':'intend','label':'承認予定'},
	];

	public comment_options = [
		{'value':'none','label':'(指定なし)'},
		{'value':'yes','label':'あり'},
		{'value':'no','label':'なし'},
		{'value':'unread','label':'未読'}
	];

	public notice_confirm_options = [
		{'value':'none','label':'(指定なし)'},
		{'value':'no','label':'未確認'},
		{'value':'yes','label':'確認済'}
	];

	public priority_options = [
		{'value':'none','label':'(指定なし)'},
		{'value':'no','label':'通常'},
		{'value':'yes','label':'優先'}
	];

	public approval_user = [
		{'value':'all','label':'全て'},
		{'value':'me','label':'自分のみ'}
	];

	constructor( private _Configuration: Configuration,
		private _MMenuService: MMenuService,
		private _FormProcessService: FormProcessService,
		private _AuthService: AuthService,
		private _GeneralService: GeneralService,
		private _Router: Router,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Location: Location ){

		//current user
		this.current_user_info = this._AuthService.getCurrent();

		// subscribe to router event
		let url_params: URLSearchParams = new URLSearchParams();
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				for(var k in param){
			 		url_params.set(k,param[k]);
			 		switch (k) {
			 			case "m_petition_status_id":
			 				if(param[k]){
								let arr = param[k].split(",");
								for (let i in arr) {
									this.statusCheck[arr[i]] = true;
								}
							}
							this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
			 				break;
			 			case "authority_id":
			 				if(param[k]){
			 					let arr = param[k].split(",");
								for (let i in arr) {
									this.authorityCheck[arr[i]] = true;
								}
							}
							this.filter['authority_id'] = this.convertArrayToString(this.authorityCheck);
			 				break;
			 			case "approval_status_id":
			 				if(param[k]){
			 					let arr = param[k].split(",");
								for (let i in arr) {
									this.approvalStatusCheck[arr[i]] = true;
								}
							}
							this.filter['approval_status_id'] = this.convertArrayToString(this.approvalStatusCheck);
			 				break;
			 			default:
			 				this.filter[k] = param[k];
			 				break;
			 		}
			 	}

			 	if(!url_params.has('approval_user')){
			 		url_params.set('approval_user', 'me');
			 	}

			 	this.url_list_data = this._FormProcessService._list_data_URL + '&request_area=management-list-form&' + url_params.toString();
		});

		/*==============================================
		 * Get List menu master 0.2 & 0.4
		 *==============================================*/
		this.menuOptions = [{ id: this.filter['m_menu_id'], text: null }];
 		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('item_status', 'active');
		this._MMenuService.getAllMenuMaster(paramData).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key]._id, text: res.data[key].name };
						options.push(obj);
					}
					this.menuOptions = options;
				}
			}
		});
	}

	ngOnInit() {}

	ngAfterViewInit() {

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
				{ 'data': null, bSortable : false },
				{ 'data': 'comment_id', 'class' : 'mobile_hidden', bSortable : false },
				{ 'data': 'priority_flg', 'class' : 'mobile_hidden', bSortable : false },
				{ 'data': 'petition_status_name', 'class' : 'mobile_hidden' },
				{ 'data': 'authority_name', 'class' : 'mobile_hidden' },
				{ 'data': 'approval_status_name', 'class' : 'mobile_hidden' },
				{ 'data': 'menu_name' },
				{ 'data': 'name', 'class' : 'word-style' },
				{ 'data': 'date', 'class' : 'mobile_hidden' },
				{ 'data': 'fullname' },
				{ 'data': 'last_approve_date', 'class' : 'mobile_hidden' },
				{ 'data': 'code', 'class' : 'mobile_hidden' },
			],
			columnDefs: [
				{
			        targets: [0],
					className: 'text-center',
			        render: function (data, type, full) {
			        	var html = '';
			        	/*============================================================
			        	 * Checkbox with m_approval_status_id = 1 - 00|未処理
			        	 * and authority_id = 2 - 02|審議
			        	 *============================================================*/
			        	let allow_petition_status = [2, 3, 8, 9, 10, 11]; //form status = 2|01|審議中 = 3|02|最終承認 = 8|07|領収書到着 = 9|06|領収書未着 = 10|11|OBIC出力登録 = 11|12|FB出力登録
			        	let allow_authority = [2, 4]; //form authority_id = 2|02|審議 = 4|04|同報
			        	if(full.approval_status_m_user_id == self.current_user_info['id']
			        		&& full.m_approval_status_id == 1
			        		&& allow_authority.indexOf(parseInt(full.authority_id)) >= 0
			        		&& allow_petition_status.indexOf(parseInt(full.m_petition_status_id)) >= 0){
			        		let petition_type = 'menu_';
			        		if(full.petition_type == 2) petition_type = 'payment_';
			        		let id = petition_type + full.id;
			        		let authority_id = full.authority_id;
			        		html = `<div class="g-radio">
				                        <label class="checkbox-inline">
				                            <input type="checkbox" name="cid[]" id="cid" data-authority-id="` + authority_id + `" value="` + id + `">
				                            <div class="check"></div>
				                        </label>
				                    </div>`;
			        	}
			            return html;
			        }
			    },
				{
			        targets: [1],
					className: 'text-center',
			        render: function (data, type, full) {
			        	var html = '';
			        	if(data){
			        		html = '<span><i class="fa fa-pencil-square-o"></i></span>';
			        	}
			            return html;
			        }
			    },
			    {
			        targets: [2],
					className: 'text-center',
			        render: function (data, type, full) {
			        	var html = '';
			        	if(data == 1){
			        		html = '<span class="mark_priority">急</span>';
			        	}
			            return html;
			        }
			    },
			    {
			        targets: [3],
					className: 'text-center',
			        render: function (data, type, full) {
			        	var html = data;
			        	if(full.m_petition_status_id == 10 || full.m_petition_status_id == 11){
			        		html = '最終承認';
			        	}
			            return html;
			        }
			    },
			    {
			        targets: [7],
			        render: function (data, type, full) {
						var router_link = '';
						let queryParams = '?access_area=management-list-form&previous_page=' + encodeURIComponent(self._Location.path());

			        	switch (full.petition_type) {
			        		case '1':
			        			if(full.m_petition_status_id == '1'){
			        				router_link = '/proposal/form/update/' + full.id;
			        			}else{
									router_link = '/proposal/detail/' + full.id + queryParams;
			        			}
			        			break;
			        		case '2':
			        			if(full.m_petition_status_id == '1'){
			        				router_link = '/payment/form/update/' + full.id;
			        			}else{
									router_link = '/payment/detail/' + full.id + queryParams;
			        			}
		        				break;
			        	}
			        	let href_url = Configuration.base_href + router_link;
			        	//
						return '<a class="" href="'+ href_url +'" data-id="' + full.id + '" data-router-link="' + router_link + '" id="btn_detail" title="' + data + '">' + data + '</a>';
					}
			    },
			    {
			    	targets: [8, 10],
					className: 'text-center',
					render: function(data, type, full){
						let date_time = moment(data, 'YYYY-MM-DD');
						if(date_time.isValid()){
							return date_time.format(Configuration.formatDateTS);
						}else{
							return "";
						}
					}
				}
		    ],
			// order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) {
				//remove checkall
				$('#checkAll').prop('checked', false);
			}
		});

		$('#tbl-data thead').on( 'click', '#checkAll', function () {
			$('#tbl-data tbody input:checkbox').not(this).prop('checked', this.checked);
	    });

		$('#tbl-data tbody').on( 'click', '#btn_detail', function () {
			let router_link = $(this).data('router-link');
			self.onRoutingForm(router_link);
			return false;
	    });
	}

	/*====================================
	 * Router link - set router link for item from list data
	 *====================================*/
	onRoutingForm(router_link){
		this._Router.navigateByUrl(router_link);
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e){
		// Set value of select 2 to ngModel
		this.filter['m_menu_id'] = e.id;
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e){
		// Reset value of select 2 to ngModel
		this.filter['m_menu_id'] = null;
	}

	/*====================================
	 * Function filter data search
	 *====================================*/
	onSearch() {
		this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
		this.filter['authority_id'] = this.convertArrayToString(this.authorityCheck);
		this.filter['approval_status_id'] = this.convertArrayToString(this.approvalStatusCheck);
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/management/list-form'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._FormProcessService._list_data_URL + '&request_area=management-list-form&' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {comment: 'none', notice_confirm_code: 'none', priority_flg: 'none', approval_user: 'me'};
		this.statusCheck = [];
		this.authorityCheck = [];
		this.approvalStatusCheck = [];

		this.DTList.order([]);

		this.onSearch();
	}

	/*====================================
	 * Open confirm popup form
	 *====================================*/
	onConfirmMultiProcess(){
		this.modalConfirm.open('sm');
	}

	/*====================================
	 * Export form 0.2 & 0.4
	 *====================================*/
	onExport(){
		this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
		this.filter['authority_id'] = this.convertArrayToString(this.authorityCheck);
		this.filter['approval_status_id'] = this.convertArrayToString(this.approvalStatusCheck);

		let params: URLSearchParams = new URLSearchParams();
		for(let k in this.filter){
			params.set(k, this.filter[k]);
		}
		params.set('has_export', '1');
		params.set('m_user_id', this.current_user_info['id']);

		var windowReference = window.open();
		this._GeneralService.exportFormProcess(params).subscribe(res => {
			if (res.status == 'success' && res.data != null) {
				// windowReference.location.href = res.data.url;
				let url = res.data.url;
				window.location.href = url;
				windowReference.location.href = url;
				windowReference.close();
			}
		});
	}

	/*====================================
	 * Approval multi form
	 *====================================*/
	onMultiProcess(){
		var items = [];
		$('#tbl-data tbody input:checkbox').each(function(){
			let elem = $(this);
			if(elem.is(':checked')){
				let authority_id = elem.data('authority-id');
				items.push({id: elem.val(), authority_id: authority_id});
			}
		})

		if(items.length){
			/*==============================================
			 * POST - process multiple approval form
			 *==============================================*/
			var params: URLSearchParams = new URLSearchParams();
			params.set('items', JSON.stringify(items));
			this._FormProcessService.multiple_approval(params).subscribe(res => {
				if(res.status == 'success') {
					/*====================================
					 * Reload Datatable
					 *====================================*/
					let _list_data_URL = this._FormProcessService._list_data_URL + '&request_area=management-list-form&' + $.param(this.filter);
					this.DTList.ajax.url(_list_data_URL).load();
					this._ToastrService.success('一括承認しました。');
				}else{
					this._ToastrService.error('起案を処理できませんでした。');
				}
			});

		}else{
			this._ToastrService.error('起案を処理できませんでした。');
		}
		this.modalConfirm.close();
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	convertArrayToString(options) {
		var str_return = '';
		for(let key in options){
			if(options[key] == true){
				str_return += key +',';
			}
		}
		if(str_return.length > 0){
			str_return = str_return.slice(0, -1);
		}
		return str_return;
	}

	ngOnDestroy(){
		this.modalConfirm.ngOnDestroy();
	}

}
