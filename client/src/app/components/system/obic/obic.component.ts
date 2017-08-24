import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from "@angular/http";
import { Configuration } from '../../../shared';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TRequestService , FormProcessService, AuthService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;
declare let window: any;

@Component({
	selector: 'app-obic',
	templateUrl: './obic.component.html',
	providers: [ TRequestService, FormProcessService, AuthService ]
})

export class ObicComponent implements OnInit{
	private DTList;
	@ViewChild('modal') modal: ModalComponent;
	current_user_info: any;
	decimal: any;
	windowReference: any;
	filter = {'date': null, 'type' : 10, 'expense_type_code': 0};
	user = {};
	validateErrors = {};
	m_user_id: number;
	url_list_data: string;

	public type = [
		{'value': 10, 'label':'OBICデータ'},
		{'value': 11, 'label':'振込データ'},
	];

	public codeOptions = [
		{'value' : 0, 'label' : 'パターン1(計上月＜支払月)'},
		{'value' : 1, 'label' : 'パターン0(計上月＝支払月)'}
	]

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _FormProcessService: FormProcessService,
		private _TRequestService: TRequestService,
	){
		this.current_user_info = this._AuthService.getCurrent();
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
		let url_params: URLSearchParams = new URLSearchParams();
		url_params.set('m_petition_status_id','10');
		this.url_list_data = this._FormProcessService._list_data_URL + '&request_area=management-list-form-payment-obic&' + url_params.toString();
	}

	ngOnInit(){ }

	ngAfterViewInit(){
		//load datatables
		let self = this,
			_list_data_URL = this.url_list_data,
			decimal = this.decimal,
			Configuration = this._Configuration;
		this.DTList = $('#tbl-data').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			order: [],
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
				{ 'data': 'date' },
				{ 'data': 'code' },
				{ 'data': 'menu_name' },
				{ 'data': 'name' },
				{ 'data': 'amount' },
				{ 'data': 'fullname' },
				{ 'data': 'petition_status_name' },
				{ 'data': 'cor_settlement_amount' },
				{ 'data': 'obic_outeput_date' },
			],
			columnDefs: [
				{
					targets: [0, 8],
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
					targets: [4, 7],
					render: function(data, type, full){
						return (data == null) ? '' : full.m_currency_symbol + decimal.transform(data);
					}
				}
			]
		});
	}

	onChangeType(value: number){
		this.filter.type = value;
		/*====================================
		 * Reload Datatable
		 *====================================*/
		let url_params: URLSearchParams = new URLSearchParams();
		url_params.set('m_petition_status_id', String(value));
		//choose display form export fb
		if(value == 11){
			url_params.set('fb_export','1');
		}
		let _list_data_URL = this._FormProcessService._list_data_URL + '&request_area=management-list-form-payment-obic&' + url_params.toString();
		this.DTList.ajax.url(_list_data_URL).load();
	}

	onCloseModal(form: NgForm){
		this.validateErrors = {};
		form.reset();
		this.modal.close();
	}

	onCheckIdentity(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('user_id', this.user['user_id']);
			paramData.set('password', this.user['password']);
			paramData.set('export_type', (this.filter.type == 10) ? 'obic' : 'fb');

			this._AuthService.checkIdentity(paramData).subscribe(res => {
				if(res.status == 'success'){
					this.onCloseModal(form);
					this.m_user_id = res.data.id;
					this.onExport();
				}else{
					this.validateErrors = res.error;
				}
			})
		}
	}

	onExport(){
		var windowReference = window.open();

		let param: URLSearchParams = new URLSearchParams();
		param.set('date', String(this.filter.date));
		param.set('type', String(this.filter.type));
		param.set('expense_type_code', String(this.filter.expense_type_code));
		param.set('m_user_id', String(this.m_user_id));
		this._TRequestService.exportObicFb(param).subscribe(res => {
			if(res.status == 'success' && res.data != null){
				// windowReference.location.href = res.data.url;
				let url = res.data.url;
				window.location.href = url;
				windowReference.location.href = url;
				windowReference.close();
				/*====================================
				 * Reload Datatable
				 *====================================*/
				this.onChangeType(this.filter.type);
			}
		});
	}

	onUpdatePetitionStatus(cid){
		if(cid){
			let process_type = (this.filter.type == 10) ? 'obic_export' : 'fb_export';
			for(let k in cid){
				let paramData: URLSearchParams = new URLSearchParams();
				paramData.set('process_type', process_type);
				paramData.set('petition_type', '2');
				paramData.set('petition_id', String(cid[k]));
				paramData.set('m_user_id', String(this.m_user_id));
				paramData.set('request_m_user_id', String(this.m_user_id));
				this._FormProcessService.singleProcess(paramData).subscribe(res => {

				})
			}
		}
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
	}
}
