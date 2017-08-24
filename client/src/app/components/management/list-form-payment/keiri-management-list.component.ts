import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, ActivatedRoute } from "@angular/router";
import { URLSearchParams } from "@angular/http";
import { Subscription } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { TRequestService ,MCompanyService, MDepartmentService ,MMenuService, FormProcessService, GeneralService, AuthService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-keiri-management-list',
	templateUrl: './keiri-management-list.component.html',
	providers: [ TRequestService, MCompanyService, MDepartmentService, MMenuService, FormProcessService, GeneralService, AuthService ],
	host: { '(document:keyup)' : 'onEnterForm($event)' }
})

export class KeiriManagementListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;

	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	menuOptions: Array<any> = [];
	statusCheck = [];
	filter = {m_menu_id: ''};
	decimal: any;
	url_list_data: string;

	public petition_status_options = [
		{'value':'2','label':'審議中'},
		{'value':'3','label':'最終承認'},
		{'value':'10','label':'OBIC出力登録済'},
		{'value':'11','label':'振込データ出力登録済'},
		{'value':'1','label':'下書'},
		{'value':'4','label':'差戻'},
		{'value':'6','label':'取下'}
	];

	public receipt_arrival_options = [
		{'value':'none', 'label':'(指定なし)'},
		{'value':'0','label':'未着'},
		{'value':'1','label':'到着'}
	];

	public receipt_flg_options = [
		{'value':'none', 'label':'(指定なし)'},
		{'value':'1', 'label':'有り'},
		{'value':'0', 'label':'無し'}
	];

	constructor(
		private _Configuration: Configuration,
		private _FormProcessService: FormProcessService,
		private _GeneralService: GeneralService,
		private _Location: Location,
		private _MCompanyService: MCompanyService,
		private _MDepartmentService: MDepartmentService,
		private _MMenuService: MMenuService,
		private _TRequestService: TRequestService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	){
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
		// subscribe to router event
		let url_params: URLSearchParams = new URLSearchParams();
		this.subscription = this._ActivatedRoute.queryParams.subscribe((param: any) => {
			for(var k in param){
				url_params.set(k,param[k]);
				if(k == 'm_petition_status_id'){
					if(param[k]){
						let arr = param[k].split(",");
						for (let i in arr) {
							this.statusCheck[arr[i]] = true;
						}
					}
					this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
				}else{
					this.filter[k] = param[k];
				}
			}
		});
		this.url_list_data = this._FormProcessService._list_data_URL + '&request_area=management-list-form-payment&' + url_params.toString();

		/*==============================================
		 * Get List menu master 0.2 & 0.4
		 *==============================================*/
 		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('item_status', 'active');
		this._MMenuService.getAllMenuMaster(paramData).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						var str_type = res.data[key]._id;
						var arr_explode = str_type.split('_');
						if(arr_explode[0] == 'payment'){
							let obj = { id: res.data[key]._id, text: res.data[key].name };
							options.push(obj);
						}
					}
					this.menuOptions = options;
				}
			}
		});

		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCompanyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name };
						options.push(obj);
					}
					this.companyOptions = options;
				}
			}
		});

		this.getDepartmentOption(this.filter);
	}

	ngOnInit(){}

	ngAfterViewInit(){
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			decimal = this.decimal,
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
				{ 'data': 'date' },
				{ 'data': 'code' },
				{ 'data': 'menu_name' },
				{ 'data': 'name' },
				{ 'data': 'amount' },
				{ 'data': 'receipt_arrival' },
				{ 'data': 'receipt_flg' },
				{ 'data': 'fullname' },
				{ 'data': 'petition_status_name' },
				{ 'data': 'cor_settlement_amount' },
				{ 'data': 'last_approve_user_fullname' },
				{ 'data': 'obic_outeput_date' },
				{ 'data': 'zenginkyo_outeput_date' },
				{ 'data': 'zenginkyo_output_hold_flg' }
			],
			columnDefs: [
				{
			        targets: [0],
					className: 'text-center',
			        render: function (data, type, full) {
		        		var html = `<div class="g-radio">
			                        <label class="checkbox-inline">
			                            <input type="checkbox" name="cid[]" id="cid"  value="` + full.id + `">
			                            <div class="check"></div>
			                        </label>
			                    </div>`;
			            return html;
			        }
			    },
			    {
					targets: [4],
			        render: function (data, type, full) {
						var router_link = '';
						let queryParams = '?access_area=management-list-form-payment&previous_page=' + encodeURIComponent(self._Location.path());

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
									router_link = '/management/payment/detail/' + full.id + queryParams;
			        			}
		        				break;
			        	}
			        	let href_url = Configuration.base_href + router_link;
			        	//
						return '<a class="" href="'+ href_url +'" data-id="' + full.id + '" data-router-link="' + router_link + '" id="btn_detail" title="' + data + '">' + data + '</a>';
					}
				},
				{
					targets: [5, 10],
					render: function(data, type, full){
						return (data == null) ? '' : full.m_currency_symbol + decimal.transform(data);
					}
				},
				{
					targets: [6],
					render: function(data, type, full){
						return (data == 1) ? '到着' : '未着';
					}
				},
				{
					targets: [7],
					className: 'text-center',
					render: function(data, type, full){
						return (data == 1) ? '要' : '不要';
				}
				},
				{
					targets: [1, 12, 13],
					className: 'text-center',
					render: function(data, type, full){
						let date_time = moment(data, 'YYYY-MM-DD');
						if(date_time.isValid()){
							return date_time.format(Configuration.formatDateTS);
						}else{
							return "";
						}
					}
				},
				{
					targets: [14],
					className: 'text-center',
					render: function(data, type, full){
						return (data == 1) ? '保留' : null;
					}
				}
			],
			'fnDrawCallback': function ( oSettings ) {
				//check checkbox is checked
				if($('#checkAll').is(':checked')){
					$('#tbl-data tbody input:checkbox').prop('checked',true);
				}
			}
		});

		$('#tbl-data thead').on('click', '#checkAll', function() {
			$('#tbl-data tbody input:checkbox').not(this).prop('checked', this.checked);
		});

		$('#tbl-data tbody').on( 'click', '#btn_detail', function () {
			let router_link = $(this).data('router-link');
			self.onRoutingForm(router_link);
			return false;
	    });
	}

	onEnterForm($event){
		if($event.keyCode == 13){
			this.onSearch();
		}
	}

	/*====================================
	 * Router link - set router link for item from list data
	 *====================================*/
	onRoutingForm(router_link){
		this._Router.navigateByUrl(router_link);
	}

	/* ===================================
	 *  Select\Remove request menu
	 * ===================================*/
	onNgSelected(event){
		this.filter['m_menu_id'] = event.id;
	}

	onNgRemoved(event){
		this.filter['m_menu_id'] = null;
	}

	/*====================================
	 * Function filter data search
	 *====================================*/
	onSearch() {
		this.filter['m_petition_status_id'] = this.convertArrayToString(this.statusCheck);
		/*====================================
		 * Change URL when submit
		 *====================================*/
		this._Router.navigate(['/management/list-form-payment'], { queryParams: this.filter });
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let _list_data_URL = this._FormProcessService._list_data_URL + '&request_area=management-list-form-payment&' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();
	}

	/*====================================
	 * Redirect to link export list form
	 *====================================*/
	onExportExcel(){
		let str_cid_return: string = this.getFormIds();
		if(str_cid_return){
			let params: URLSearchParams = new URLSearchParams();
			params.set('petition_id',str_cid_return);
			let windowReference = window.open();
			this._TRequestService.exportListForm(params).subscribe(res => {
				if(res.status == 'success'){
					// windowReference.location.href = res.data.url;
					let url = res.data.url;
					window.location.href = url;
					windowReference.location.href = url;
					windowReference.close();
				}
			})
		}else{
			this._ToastrService.error('対象案件を選択してください。');
		}
	}

	/*====================================
	 * Redirect to link export PDF
	 *====================================*/
	onPrintPdf(){
		let str_cid_return: string = this.getFormIds();
		if(str_cid_return){
			let params: URLSearchParams = new URLSearchParams();
			params.set('petition_id',str_cid_return);
			params.set('format','keiri');
			let windowReference = window.open();
			this._GeneralService.exportFormPDF(params).subscribe(res => {
				if (res.status == 'success' && res.data != null) {
					windowReference.location.href = res.data.url;
				}
			});
		}else{
			this._ToastrService.error('対象案件を選択してください。');
		}
	}

	//get string contain forms's id
	getFormIds(){
		var items = [];
		var str_cid_return = '';
		$('#tbl-data tbody input:checkbox').each(function(){
			var elem = $(this);
			if(elem.is(':checked')){
				var id = elem.val();
				if(items.indexOf(id) == -1){
					items.push(id);
				}
			}
		})

		if(items.length){
			for(var i in items){
				str_cid_return += items[i] +',';
			}
			str_cid_return = str_cid_return.slice(0, -1);
		}
		return str_cid_return;
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = { m_menu_id: '' };
		this.statusCheck = [];
		this.DTList.order([]);
		this.onSearch();
	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectDepartmentChange(event, area?:string, type?: string){
		switch(area){
			case "company":
				if(type == 'deselected'){
					this.filter['m_company_id'] = null;
				}else{
					this.filter['business_id'] = null;
				}
			case "business":
				if(type == 'deselected'){
					this.filter['business_id'] = null;
				}else{
					this.filter['division_id'] = null;
				}
			case "division":
				if(type == 'deselected'){
					this.filter['division_id'] = null;
				}else{
					this.filter['m_department_id'] = null;
				}
			case "m_department":
				if(type == 'deselected'){
					this.filter['m_department_id'] = null;
				}
				break;
		}

		if(!type) {
			let key_id = 'm_company_id';
			if (area != 'company') {
				key_id = area + '_id';
			}
			this.filter[key_id] = event.id;
		}
		this.getDepartmentOption(this.filter);
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
	getDepartmentOption(request, area?:string){
		let self = this;
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		this.businessOptions = [{ id: request['business_id'], text: null }];
		this.divisionOptions = [{ id: request['division_id'], text: null }];
		this.departmentOptions = [{ id: request['department_id'], text: null }];

		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_company_id', request['m_company_id']);
		params.set('business_id', request['business_id']);
		params.set('division_id', request['division_id']);
		params.set('department_id', request['m_department_id']);
		this._MDepartmentService.getListOption(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data.options != null){
					for (let key in res.data.options) {
						switch (key) {
							case "business":
								this.businessOptions = res.data.options[key];
								break;
							case "division":
								this.divisionOptions = res.data.options[key];
								break;
							case "department":
								this.departmentOptions = res.data.options[key];
								break;
						}
					}

				}

				setTimeout(function(){
					if(res.data.m_company_id) self.filter['m_company_id'] = res.data.m_company_id;
					if(res.data.business_id) self.filter['business_id'] = res.data.business_id;
					if(res.data.division_id) self.filter['division_id'] = res.data.division_id;
					if(res.data.department_id) self.filter['m_department_id'] = res.data.department_id;
				}, 500);
			}
		});
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

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
