import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { URLSearchParams } from "@angular/http";
import { Subscription } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MMenuService, FormProcessService, AuthService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;


@Component({
	selector: 'app-list-form',
	templateUrl: './list-form.component.html',
	providers: [ MMenuService, FormProcessService, AuthService ]
})
export class ListFormComponent implements OnInit {
	private subscription: Subscription;
	private DTList;

	menuOptions: Array<any> = [];
	apply_user: Array<any> = [];
	url_list_data: String;
	current_user_info = {};
	_param = {};
	filter = {comment: 'none', notice_confirm_code: 'none', priority_flg: 'none', apply_user: 'me'};

	statusCheck = [];

	public petition_status_options = [
		{'value':'1','label':'下書'},
		{'value':'2','label':'審議中'},
		{'value':'3','label':'最終承認'},
		{'value':'5','label':'否認'},
		{'value':'6','label':'取下'},
		{'value':'4_uncheck','label':'差戻未読'},
		{'value':'4_check','label':'差戻既読'},
		{'value':'7','label':'完結'}
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

	

	constructor( private _Configuration: Configuration,
		private _MMenuService: MMenuService,
		private _FormProcessService: FormProcessService,
		private _AuthService: AuthService,
		private _Router: Router,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Location: Location ){

		//current user
		this.current_user_info = this._AuthService.getCurrent();

		let user_position_code = parseInt(this.current_user_info['position_code']);
		if(user_position_code >= 2 && user_position_code <= 6){
			this.apply_user.push({'value':'me','label':'自分のみ'}, { value: 'department', label: '全て(部門内)' });	
		}else if(user_position_code >= 7 && user_position_code <= 13){
			this.apply_user.push({'value':'me','label':'自分のみ'}, { value: 'department', label: '全て(部門内)' }, { value: 'division', label: '全て(事業部内)' });
		}else if(user_position_code == 99){
			this.apply_user.push({'value':'me','label':'自分のみ'}, { value: 'department', label: '全て(部門内)' }, { value: 'division', label: '全て(事業部内)' }, { value: 'manager', label: '全て(管理用)' });
		}

		if(this.statusCheck.length <= 0 ){
			this.statusCheck[1] = true;
			this.statusCheck[2] = true;
			this.statusCheck[3] = true;
			this.statusCheck['4_check'] = true;
			this.statusCheck['4_uncheck'] = true;
			this.statusCheck[5] = true;
			this.statusCheck[6] = true;
			this.statusCheck[7] = true;
		}

		// subscribe to router event
		let url_params: URLSearchParams = new URLSearchParams();
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				for(var k in param){
			 		url_params.set(k, param[k]);
			 		switch (k) {
			 			case "m_petition_status_id":
			 				if(param[k]){
								let arr = param[k].split(",");
								this.statusCheck = [];
								for (let i in arr) {
									this.statusCheck[arr[i]] = true;
								}
							}
							this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
			 				break;
			 			default:
			 				this.filter[k] = param[k];
			 				break;
			 		}
			 	}

			 	if(!url_params.has('apply_user')){
			 		url_params.set('apply_user', 'me');
			 	}
			 	if(!url_params.has('m_petition_status_id')){
			 		url_params.append('m_petition_status_id', this.convertArrayToString(this.statusCheck));
			 	}
			 	this.url_list_data = this._FormProcessService._list_data_URL + '&request_area=user-list-form&' + url_params.toString();
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

	ngOnInit() {

	}

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
			// bSort: false,
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
				{ 'data': 'date' },
				{ 'data': 'comment_id', bSortable : false },
				{ 'data': 'priority_flg', bSortable : false },
				{ 'data': 'menu_name' },
				{ 'data': 'name' },
				{ 'data': 'code' },
				{ 'data': 'petition_status_name' },
				{ 'data': 'fullname' },
				{ 'data': 'last_approve_user_fullname' },
				{ 'data': 'last_approve_date' },
			],
			columnDefs: [
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
			        targets: [4],
			        render: function (data, type, full) {
			        	var router_link = '';
						let queryParams = '?access_area=user-list-form&previous_page=' + encodeURIComponent(self._Location.path());
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
			        targets: [6],
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
			    	targets: [0, 9],
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
			fnDrawCallback: function(oSettings) {}
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

	onUpdatePetitionStatusChecked(value){
		this.filter['apply_user'] = value;
		this.statusCheck['1'] = (value == 'me');
	}

	/*====================================
	 * Function filter data search
	 *====================================*/
	onSearch() {
		this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/list-form'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._FormProcessService._list_data_URL + '&request_area=user-list-form&' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {comment: 'none', notice_confirm_code: 'none', priority_flg: 'none', apply_user: 'me'};
		this.statusCheck = [];
		this.statusCheck[1] = true;
		this.statusCheck[2] = true;
		this.statusCheck[3] = true;
		this.statusCheck['4_check'] = true;
		this.statusCheck['4_uncheck'] = true;
		this.statusCheck[5] = true;
		this.statusCheck[6] = true;
		this.statusCheck[7] = true;

		this.DTList.order([]);

		this.onSearch();
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


}
