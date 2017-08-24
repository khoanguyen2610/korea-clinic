import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MNoticeFeeService, MTaxService, MCurrencyService, MRequestMenuService } from '../../../services';
import { MNoticeFee, MTax, MCurrency } from '../../../models';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './type-finalization-list.component.html',
	providers: [ MNoticeFeeService, MTaxService, MCurrencyService, MRequestMenuService ]
})

export class TypeFinalizationListComponent implements OnInit{
	//declare datatables variables
	private DTListTax;
	private DTListNoticeFee;
	private DTListCurrency;
	//declare modal variables
	@ViewChild('modaldelete') modaldelete: ModalComponent;
	@ViewChild('modalnotice') modalnotice: ModalComponent;
	@ViewChild('modaltax') modaltax: ModalComponent;
	@ViewChild('modalcurrency') modalcurrency: ModalComponent;
	//declare model variables
	MCurrency = new MCurrency();
	MNotice = new MNoticeFee();
	MTax = new MTax();
	//declare variables
	validateErrors = {};
	requestMenuOption: Array<any> = [];
	requestMenu: Array<any> = [];
	decimal: any;
	delete_id: number;
	selected_table: string;
	isCreate = true;
	demo: number = 40000;

	constructor(
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
		private _MNoticeFeeService: MNoticeFeeService,
		private _MTaxService: MTaxService,
		private _MCurrencyService: MCurrencyService,
		private _MRequestMenuService: MRequestMenuService
	){ 
		let url_params: URLSearchParams = new URLSearchParams();
		url_params.set('filter_notice_amount','true');
		url_params.set('enable_flg','1');
		this.requestMenuOption.push({ id: this.MNotice['m_request_menu_id'], text: null });
		this._MRequestMenuService.getAll(url_params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].name };
                        options.push(obj);
                    }
                    this.requestMenuOption = options;
				}
			}
		});
	}

	ngOnInit(){
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
	}

	ngAfterViewInit() {
		let self = this,
			Configuration = this._Configuration;
		//load datatable
		this.DTListNoticeFee = $('#tbl-notice_fee').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
			    'url': self._MNoticeFeeService._list_data_URL,
			    'type': 'GET',
			    'beforeSend': function (request) {
			        request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
			    },
			    xhrFields: {
		            withCredentials: true
		        }
			},
			columns: [
				{ 'data':'request_menu_name' },
				{ 'data':'amount' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
				{
					targets: [1],
					className: 'text-right',
					render: function(data, type, full){
						return self.decimal.transform(data);
					}
				},
				{
			        targets: [2],
					className: 'text-center',
			        data: null,
			        bSortable: false,
			        render: function (data, type, full) {
			            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
			        }
			    },
			    {
			        targets: [3],
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

		this.DTListTax = $('#tbl-tax').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
			    'url': self._MTaxService._list_data_URL,
			    'type': 'GET',
			    'beforeSend': function (request) {
			        request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
			    }
			},
			columns: [
				{ 'data':'value' },
				{ 'data':'enable_start_date' },
				{ 'data':'enable_end_date' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
				{
					targets: [0],
					className: 'text-center',
					render: function(data, type, full){
						return data + '%';
					}	
				},
				{
					targets: [1],
					className: 'text-center',
					render: function(data, type, full){
						var parsedDate = Date.parse(data);
					   	if(isNaN(parsedDate)){
					   		return "";
					   	}else{
							return moment(parsedDate).format(Configuration.formatDateTS);
					   	}
					}
						
				},
				{
					targets: [2],
					className: 'text-center',
					render: function(data, type, full){
						var parsedDate = Date.parse(data);
					   	if(isNaN(parsedDate)){
					   		return "";
					   	}else{
							return moment(parsedDate).format(Configuration.formatDateTS);
					   	}
					}
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

		this.DTListCurrency = $('#tbl-currency').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
			    'url': self._MCurrencyService._list_data_URL,
			    'type': 'GET',
			    'beforeSend': function (request) {
			        request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
			    }
			},
			columns: [
				{ 'data':'name' },
				{ 'data':'name_e', 'class' : 'text-center' },
				{ 'data':'symbol', 'class' : 'text-center' },
				{ 'data': null },
				{ 'data': null },
			],
			columnDefs: [
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

		$('#tbl-notice_fee tbody, #tbl-tax tbody, #tbl-currency tbody').on( 'click', '#btn_edit', function () {
			let id: number = $(this).parents('tr').attr('id');
			var table = $(this).parents('table').attr('id');
			var start = table.indexOf('-');
			self.selected_table = table.substring(start+1);
			self.isCreate = false;
			switch(self.selected_table){
				case 'currency':
					self.onOpenFormCurrency(id);
					break;
				case 'notice_fee':
					self.onOpenFormNotice(id);
					break;
				case 'tax':
					self.onOpenFormTax(id);
					break;
			}
			return false;
	    });

	    $('#tbl-notice_fee tbody, #tbl-tax tbody, #tbl-currency tbody').on( 'click', '#btn_delete', function () {
			self.delete_id = $(this).parents('tr').attr('id');
			var table = $(this).parents('table').attr('id');
			var start = table.indexOf('-');
			self.selected_table = table.substring(start+1);
			self.onOpenConfirm();
			return false;
	    });
	}

	//open modal form
	onOpenFormCurrency(id?:number){
		if(typeof id != 'undefined'){
			this._MCurrencyService.getByID(id).subscribe(res => {
				if(res.status == 'success'){
					this.MCurrency = res.data;
				}
			})
		}
		this.modalcurrency.open();
	}

	onOpenFormNotice(id?:number){
		if(typeof id != 'undefined'){
			this.MNotice['m_request_menu_id'] = null;
			this._MNoticeFeeService.getByID(id).subscribe(res => {
				if(res.status == 'success'){
					res.data.amount = this.decimal.transform(res.data.amount);
					this.MNotice = res.data;
				}
			})
		}
		this.modalnotice.open();
	}

	onOpenFormTax(id?:number){
		if(typeof id != 'undefined'){
			this._MTaxService.getByID(id).subscribe(res => {
				if(res.status == 'success'){
					if(res.data.enable_end_date == null){
						res.data.enable_end_date = '';
					}
					this.MTax = res.data;
				}
			})
		}
		this.modaltax.open();
	}

	onCloseForm(form: NgForm, modal: ModalComponent){
		form.reset();
		modal.close();
		this.validateErrors = {};
		this.isCreate = true;
	}

	//open modal confirm
	onOpenConfirm(){
		this.modaldelete.open('sm');
	}

	onConfirmDelete(){
		this.modaldelete.close();
		switch(this.selected_table){
			case 'currency':
				this._MCurrencyService.delete(this.delete_id).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('データを削除しました。');
						this.DTListCurrency.ajax.url(this._MCurrencyService._list_data_URL).load();
					}
				})
				break;
			case 'notice_fee':
				this._MNoticeFeeService.delete(this.delete_id).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('データを削除しました。');
						this.DTListNoticeFee.ajax.url(this._MNoticeFeeService._list_data_URL).load();
					}
				})
				break;
			case 'tax':
				this._MTaxService.delete(this.delete_id).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('データを削除しました。');
						this.DTListTax.ajax.url(this._MTaxService._list_data_URL).load();
					}
				})
				break;
		}
	}

    /*====================================
     * Event selected of ng2-select - MIT
     *====================================*/
    onNgSelected(e, area){
        // Set value of select 2 to ngModel
        switch (area) {
            case "request_menu":
                this.MNotice['m_request_menu_id'] = e.id;
                break;
        }
    }

	//save form notice
	onSubmitNotice(form: NgForm){
		if(form.valid){
			this.validateErrors = {};
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('m_request_menu_id', this.MNotice['m_request_menu_id'].toString());
			paramData.set('amount', this.MNotice['amount']);
			if(!this.isCreate){
				paramData.set('id', this.MNotice['id'].toString());
				this._MNoticeFeeService.save(paramData,this.MNotice['id']).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('情報を登録しました。');
						this.DTListNoticeFee.ajax.url(this._MNoticeFeeService._list_data_URL).load();
					}else{
						this.validateErrors = res.error;
					}
				});
			}else{
				this._MNoticeFeeService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						form.reset();
						this._ToastrService.success('情報を登録しました。');
						this.DTListNoticeFee.ajax.url(this._MNoticeFeeService._list_data_URL).load();
					}else{
						this.validateErrors = res.error;
					}
				});
			}
		}
	}

	//save form tax
	onSubmitTax(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('value', this.MTax['value']);
			paramData.set('enable_start_date', this.MTax['enable_start_date'].toString());
			paramData.set('enable_end_date', this.MTax['enable_end_date'].toString());
			if(!this.isCreate){
				paramData.set('id', this.MTax['id'].toString());
				this._MTaxService.save(paramData,this.MTax['id']).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('情報を登録しました。');
						this.DTListTax.ajax.url(this._MTaxService._list_data_URL).load();
					}
				});
			}else{
				this._MTaxService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						form.reset();
						this._ToastrService.success('情報を登録しました。');
						this.DTListTax.ajax.url(this._MTaxService._list_data_URL).load();
					}
				});
			}
		}
	}

	//save form currency
	onSubmitCurrency(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('name', this.MCurrency['name']);
			paramData.set('name_e', this.MCurrency['name_e']);
			paramData.set('symbol', this.MCurrency['symbol']);
			
			if(!this.isCreate){
				paramData.set('id', this.MCurrency['id'].toString());
				this._MCurrencyService.save(paramData,this.MCurrency['id']).subscribe(res => {
					if(res.status == 'success'){
						this._ToastrService.success('情報を登録しました。');
						this.DTListCurrency.ajax.url(this._MCurrencyService._list_data_URL).load();
					}
				});
			}else{
				this._MCurrencyService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						form.reset();
						this._ToastrService.success('情報を登録しました。');
						this.DTListCurrency.ajax.url(this._MCurrencyService._list_data_URL).load();
					}
				});
			}
		}
	}

	onChange(event){
		var parsedDate = Date.parse(event);
		this.MTax.enable_end_date = isNaN(parsedDate)?'':moment(parsedDate).format(this._Configuration.formatDateTS);
	}

	ngOnDestroy(){
		this.modalcurrency.ngOnDestroy();
		this.modaldelete.ngOnDestroy();
		this.modalnotice.ngOnDestroy();
		this.modaltax.ngOnDestroy();
	}
}