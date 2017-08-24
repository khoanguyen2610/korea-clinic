import { Component, ViewChild, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { TRequestService, AuthService, MAuthorityService, MUserService, GeneralService, FormProcessService } from '../../../services';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';


import { ManagementPaymentTransportDetailComponent, ManagementPaymentPurchaseDetailComponent,
        ManagementPaymentDietaryDetailComponent, ManagementPaymentTravelDetailComponent,
        ManagementPaymentCostDetailComponent, ManagementPaymentPreTravelDetailComponent } from '../';

declare let $: any;
declare let moment: any;
declare let proposal_create: any;
declare let window: any;

@Component({
	selector: 'app-management-payment-detail',
	templateUrl: './management-payment-detail.component.html',
	providers: [ TRequestService, MAuthorityService, MUserService, GeneralService, FormProcessService ]
})

export class ManagementPaymentDetailComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;
	private querySubscription: Subscription;
	private DTList;
	public uploader: FileUploader = new FileUploader({});
	@ViewChild('modalUpdate') modalUpdate: ModalComponent;
	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	@ViewChild('modalReceipt') modalReceipt: ModalComponent;
	@ViewChild('modalZenginkyo') modalZenginkyo: ModalComponent;
	@ViewChild('modalWaitingConfirm') modalWaitingConfirm: ModalComponent;

	_params: any;
	_queryParams = {};
	current_user_info: any;
	user_create_form = {};
	t_request_dietary = {};
	t_request_traveling_expenses = {};

	dataItem = {};
	dataList = [];
	dataInput = [];
	dataPetition = [];
	dataComment = [{ children: [{ children: [], parent: 0 }], parent: 0 }];
	formType = {
		confirm_msg: '',
		type: '',
		value: null,
	};

	arrID: Array<any> = [];
	authorityOptions: Array<any> = [];
	costArray: Array<any> = [];
	purchaseArray: Array<any> = [];
	transportArray: Array<any> = [];
	Item = {};
	curRouting?: string;
	decimal: any;
	petition_id: any;
	petition_type = '2';
	url_list_data: string;
	current_receipt_arrival: number;
	disable_export_fb: boolean;
	display_cost: boolean = true;
	display_destination: boolean;
	is_approval: boolean = false;
	modify: boolean;
	approval_status_id: number;
	selected_index_user_id: number;
	selected_user_id: number;
	traveling_fee: number = 0;
	transport_purchase_fee: number = 0;
	total: number = 0;
	access_area: any;
	creator_id: any;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _FormProcessService: FormProcessService,
		private _GeneralService: GeneralService,
		private _MAuthorityService: MAuthorityService,
		private _MUserService: MUserService,
		private _TRequestService: TRequestService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	) {
		// subscribe to router event
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);
		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this._queryParams = param;
				this.access_area = param.access_area;
			}
		);
		this.current_user_info = this._AuthService.getCurrent();
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.getAuthorityOptions();
				this.loadPaymentData();
			}
		});
	}

	ngOnInit() {
		proposal_create.toggleMenu();
	}

	loadPaymentData(){
		this.uploader = new FileUploader({});
		this._TRequestService.getByID(this._params.id).subscribe(res => {
			if(res.status=='success' && res.data){

				if(res.data.suspense_payments == null){
					res.data.suspense_payments =  0;
				}

				res.data.cor_suspense_payments = res.data.cor_suspense_payments ? this.decimal.transform(res.data.cor_suspense_payments) : 0;

				//get form data
				this.Item = res.data;
				this.petition_id = res.data.id;
				this.creator_id = res.data.m_user_id;
				this.user_create_form = res.data.user_create_form;

				//get travel data
				if(res.data.t_request_traveling_expenses){
					let departure_time: string = res.data.t_request_traveling_expenses.departure_time;
					res.data.t_request_traveling_expenses.departure_time = departure_time.substring(0,departure_time.lastIndexOf(':'));
					let end_time: string = res.data.t_request_traveling_expenses.end_time;
					res.data.t_request_traveling_expenses.end_time = end_time.substring(0,end_time.lastIndexOf(':'));
					let cor_perdiem_fee =	res.data.t_request_traveling_expenses.cor_perdiem_fee ? res.data.t_request_traveling_expenses.cor_perdiem_fee : res.data.t_request_traveling_expenses.perdiem_fee;
					res.data.t_request_traveling_expenses.cor_perdiem_fee = this.decimal.transform(cor_perdiem_fee);
					let cor_lodging_fee = res.data.t_request_traveling_expenses.cor_lodging_fee ? res.data.t_request_traveling_expenses.cor_lodging_fee : res.data.t_request_traveling_expenses.lodging_fee;
					res.data.t_request_traveling_expenses.cor_lodging_fee = this.decimal.transform(cor_lodging_fee);
					let cor_other_fee: number = 0;
					Object.keys(res.data.t_request_traveling_expenses.other).map(index => {
						let obj = res.data.t_request_traveling_expenses.other[index];
						let money = obj.cor_payments ? obj.cor_payments : obj.payments;
						cor_other_fee += +money;
						obj.cor_payments = this.decimal.transform(money);
						return obj;
					});
					this.traveling_fee = +cor_perdiem_fee + +cor_lodging_fee + cor_other_fee;
				}
				this.t_request_traveling_expenses = res.data.t_request_traveling_expenses;
				//get dietary data
				this.t_request_dietary = res.data.t_request_dietary;
				//get divide cost array
				this.costArray = Object.keys(res.data.t_cost_divide).map(index => {
					let obj = res.data.t_cost_divide[index];
					let money = obj.cor_divide_cost ? obj.cor_divide_cost : obj.divide_cost;
					obj.cor_divide_cost = this.decimal.transform(money);
					return obj;
				});
				//get purchase array
				if(res.data.t_purchase_reception_spec.length){
					let purchase_fee: number = 0;
					this.purchaseArray = Object.keys(res.data.t_purchase_reception_spec).map(index => {
						let obj = res.data.t_purchase_reception_spec[index];
						let parseDate = Date.parse(obj.reception_date);
						obj.reception_date = moment(parseDate).format(this._Configuration.formatDate);
						let money = obj.cor_payments ? obj.cor_payments : obj.payments;
						purchase_fee += +money;
						obj.cor_payments = this.decimal.transform(money);
						obj.payments = this.decimal.transform(obj.payments);
						return obj;
					});
					this.transport_purchase_fee = purchase_fee;
				}

				//get transport array
				if(res.data.t_request_transport_spec.length){
					let transport_fee: number = 0;
					this.transportArray = Object.keys(res.data.t_request_transport_spec).map(index => {
						let obj = res.data.t_request_transport_spec[index];
						let parseDate = Date.parse(obj.use_date);
						obj.use_date = moment(parseDate).format(this._Configuration.formatDate);
						let money = obj.cor_transportation_spec_fee ? obj.cor_transportation_spec_fee : obj.transportation_spec_fee;
						transport_fee += +money;
						obj.cor_transportation_spec_fee = this.decimal.transform(money);
						obj.transportation_spec_fee = this.decimal.transform(obj.transportation_spec_fee);
						return obj;
					});
					this.transport_purchase_fee = transport_fee;
				}

				this.total = this.traveling_fee + this.transport_purchase_fee;
				this.display_cost = (res.data.type == 1 && res.data.m_request_menu_id != 2 && res.data.m_request_menu_id != 3);
				//this.disable_export_fb = (res.data.zenginkyo_outeput_date == '9999-12-31 00:00:00');
				this.disable_export_fb = (res.data.zenginkyo_output_prevent_flg == 1);
				this.current_receipt_arrival = res.data.receipt_arrival;
				//m_petition_status_id in [3,10,11] <=> petition status code in [02,11,12]
				let can_modify = [3,10,11];
				this.modify = ((can_modify.indexOf(+res.data.m_petition_status_id) != -1) && (res.data.zenginkyo_outeput_date == null));
				let request_menu_id = [1,2,3,4,5];
				this.display_destination = (request_menu_id.indexOf(+res.data.m_request_menu_id) != -1);
				// Push data in list comment
				var dataComment = [];
				for (let key in res.data['comments']) {
					dataComment.push(res.data['comments'][key]);
				}
				this.dataComment = dataComment;
				// Push data in list data
				this.dataList = res.data.routes;
				let is_first = true;
				for(let key in this.dataList) {
					if (this.dataList[key].approval_datetime) {
						this.is_approval = true;
						this.dataList[key].approval_datetime = moment(this.dataList[key].approval_datetime).format(this._Configuration.formatDateMinTS);
					}
					if (this.current_user_info['id'] == this.dataList[key].m_user_id && is_first) {
						this.approval_status_id = this.dataList[key].m_approval_status_id;
						this.selected_index_user_id = +key;
						is_first = false;
					}

					//Khoa Nguyen - fix 2017-03-10
					//Case user has 2 authority broadcast & approve
					if (this.current_user_info['id'] == this.dataList[key].m_user_id
						&& (this.dataList[key].m_approval_status_id == 1 || this.dataList[key].m_approval_status_id == 7)) {
						this.approval_status_id = this.dataList[key].m_approval_status_id;
						this.selected_index_user_id = +key;
					}
				}


				if (this.Item['priority_flg'] === '0') {
					this.Item['priority_flg'] = '通常';
				} else {
					this.Item['priority_flg'] = '優先';
				}

				if (this.Item['change_route'] === '0') {
					this.Item['change_route'] = '無';
				} else {
					this.Item['change_route'] = '有';
				}
				this.Item['date'] = moment(this.Item['date']).format(this._Configuration.formatDate);

				// Add files_attach into Form Attachment
				for (let key in res.data.files_attach) {
					var filename = res.data.files_attach[key].filename;
					var file_type = filename.split('.')
					let item: any = { file: { name: filename, type: file_type[1], is_download: true }, _file: { id: res.data.files_attach[key].id, name: filename, type: file_type[1], is_keeping: true } };
					this.uploader.queue.push(item);
				}

				// Push data in list petition
				var dataPetition = [];
				for (let key in res.data['copy_petition']) {
					dataPetition.push(res.data['copy_petition'][key]);
				}
				this.dataPetition = dataPetition;

				// Pass param dataItem
				this.dataItem['petition_id'] = res.data.id;
				this.dataItem['petition_type'] = 2;
				this.dataItem['m_user_id'] = res.data.m_user_id;
				this.dataItem['parent'] = 0;
			} else{
				this._ToastrService.error('データはありません。');
				this._Router.navigate(['/']);
			}
		})
	}

	//get array next, prev id
	setListIds(ids){
		this.arrID = ids;
	}
	//update cost array
	setCostArray(costArray){
		this.costArray = costArray;
	}

	//update purchase array
	setPurchaseArray(purchaseArray){
		this.purchaseArray = purchaseArray;
	}

	//update transport array
	setTransportArray(transportArray){
		this.transportArray = transportArray;
	}

	//update object traveling
	setTRequestTravelingExpenses(t_request_traveling_expenses){
		this.t_request_traveling_expenses = t_request_traveling_expenses;
	}

	//update amount when traveling fee has been changed
	onUpdateTravelingFee(traveling_fee: number){
		this.traveling_fee = traveling_fee;
		this.total = this.traveling_fee + this.transport_purchase_fee;
		this.calculate();
	}

	//update amount when transpor\purchase has been changed
	onUpdateAmount(amount: number){
		this.transport_purchase_fee = amount;
		this.total = this.traveling_fee + this.transport_purchase_fee;
		this.calculate();
	}

	onUpdateSuspense(suspense_payments: number){
		this.Item['cor_suspense_payments'] = suspense_payments;
		this.calculate();
	}

	/*====================================
	 * Function link to detail ID
	 *====================================*/
	onLinkDetailID(id) {
		let queryParams = '';
		if (typeof this._queryParams['previous_page'] !== 'undefined') {
			queryParams = '?access_area=management-list-form-payment&previous_page=' + encodeURIComponent(this._queryParams['previous_page']);
		}

		this._Router.navigateByUrl('management/payment/detail/' + id + queryParams);
	}

	//update receipt_arrival
	onUpdateReceiptArrival(value: number){
		this.modalReceipt.close();
		//form's approval status is 01
		if(this.Item['m_petition_status_id'] == 2){
			this.current_receipt_arrival = value;
			let params: URLSearchParams = new URLSearchParams();
			params.set('id', this.Item['id']);
			params.set('receipt_arrival',value.toString());
			this._TRequestService.updateReceiptArrival(params, this.Item['id']).subscribe(res => {
				if(res.status == 'success'){
					this._ToastrService.success(value ? '領収書到着済みに変更しました' : '領収書未着に変更しました');
				}
			});
		}else{
			this.onSetButtonStyle(this.current_receipt_arrival);
			this._ToastrService.error('この精算申請は既に最終承認されているため、変更できません。');
		}
	}

	//update zenginkyo_output_hold_flg
	onUpdateZenginkyoOutputHoldFlg(value: number){
		this.modalZenginkyo.close();
		let params: URLSearchParams = new URLSearchParams();
		params.set('id', this.Item['id']);
		params.set('zenginkyo_output_hold_flg',value.toString());
		this._TRequestService.updateZenginkyoOutputHoldFlg(params, this.Item['id']).subscribe(res => {
			if(res.status == 'success'){
				if(value == -1){
					this.disable_export_fb = true;
					this.modify = false;
					this.Item['zenginkyo_outeput_date'] = '9999-12-31 00:00:00';
				}else{
					this.Item['zenginkyo_output_hold_flg'] = value;
				}
				this._ToastrService.success(res.message);
			}
		})
	}

	onSetButtonStyle(value: number){
		let color:string = (this.current_receipt_arrival == value) ? '#1555c4' : '#25a9cb';
		return {
			'background-color': color,
			'border-color': color
		}
	}

	/*=================================
	 * Process type of button
	 *=================================*/
	onClickButton(type: string, value?: number) {
		if(type == 'back_management_list_form_payment' && this._queryParams['previous_page']){
			this._Router.navigateByUrl(decodeURIComponent(this._queryParams['previous_page']));
			return;
		}
		switch (type) {
			case 'receipt_arrival':
				if(this.current_receipt_arrival == value){
					break;
				}
				this.formType.confirm_msg = value ? '領収書到着済みにします、よろしいでしょうか？' : '領収書未着にします、よろしいでしょうか？';
				this.formType.value = value;
				this.modalReceipt.open('sm');
				break;
			case 'zenginkyo_output_hold_flg':
				this.formType.value = value;
				let msg: string;
				if(value == 1){
					msg = '振込データの出力を保留します。よろしいですか？';
				}else if(value == 0){
					msg = '振込データ出力保留を解除します。よろしいですか？';
				}else{
					msg = '一度出力除外にすると、振込データは作成されません。よろしいですか？';
				}
				this.formType.confirm_msg = msg;
				this.modalZenginkyo.open('sm');
				break;
			case 'last_approve': // 3-02
				this.formType.confirm_msg = '最終承認します、よろしいですか？';
				this.formType.type = type;
				this.modalConfirm.open('sm');
				break;
			case 'obic_registration': // 10-11
				this.formType.confirm_msg = '外部データ出力登録します、よろしいですか？※まだ出力はされません';
				this.formType.type = type;
				this.modalConfirm.open('sm');
				break;
			case 'return': // 4-03
				this.formType.confirm_msg = 'この精算申請を差戻します、よろしいですか？';
				this.formType.type = type;
				this.modalConfirm.open('sm');
				break;
			case 'export_pdf':
				let params: URLSearchParams = new URLSearchParams();
				params.set('petition_id',this._params.id);
				params.set('format', 'keiri');
				let windowReference = window.open();
				this._GeneralService.exportFormPDF(params).subscribe(res => {
					if (res.status == 'success' && res.data != null) {
						windowReference.location.href = res.data.url;
					}
				});
				break;
		}
	}

	private calculate(){
		if(this.Item['type']==2){

		}else{
			setTimeout(() => {
				let suspense_payments: number = 0;
				this.Item['cor_amount'] = this.total;
				if(this.Item['cor_suspense_payments']){
					suspense_payments = +this.Item['cor_suspense_payments'].replace(/,/g,'');
				}
				this.Item['cor_settlement_amount'] = this.total - suspense_payments;
			}, 300);
		}
	}

	/*====================================
	 * Get List Authority
	 *====================================*/
	getAuthorityOptions() {
		this.authorityOptions = [{ value: null, label: null }];
		this._MAuthorityService.getAll().subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
					var options = [];
					for (let key in res.data) {
						if (res.data[key].name != '最終審議') {
							let obj = { value: res.data[key].id, label: res.data[key].name };
							options.push(obj);
						}

					}
					this.authorityOptions = options;
				}
			}
		});
	}

	/*==============================================
	 * Download Form
	 *==============================================*/
	onDownloadForm(attachment_id, type: string) {
		// Get Link Download File
		var params: URLSearchParams = new URLSearchParams();
		params.set('attachment_id', attachment_id);
		params.set('attachment_type', type); // form_attachment, form_input
		params.set('m_user_id', this.current_user_info['id']);

		var windowReference = window.open();
		this._GeneralService.dowloadForm(params).subscribe(res => {
			if (res.status == 'success' && res.data != null) {
				// windowReference.location.href = res.data.url;
                let url = res.data.url;
				window.location.href = url;
				windowReference.location.href = url;
				windowReference.close();
			}
		});

	}

	getReplied(value){
		this._TRequestService.getByID(this._params.id).subscribe(res => {
			if(res.status=='success' && res.data){
				// Push data in list comment
				var dataComment = [];
				for (let key in res.data['comments']) {
					dataComment.push(res.data['comments'][key]);
				}
				this.dataComment = dataComment;
			}
		})
	}

	onConfirmUpdate(){
		//validate cor divide cost is equal to cor amount
		if(this.costArray.length){
			let fee: string;
			let cost_fee: number = 0;
			this.costArray.forEach(item => {
				fee = item.cor_divide_cost.toString().replace(/,/g,'');
				cost_fee += parseFloat(fee);
			})

			if(!((this.total == cost_fee) || (cost_fee == 0))){
				this._ToastrService.error('精算金額に対して按分金額の相違があります。');
				return false;
			}
		}
		//open modal
		this.modalUpdate.open('sm');
	}

	/*==============================================
	 * Change Approval User
	 *==============================================*/
	onChangeApprovalUser() {
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('process_type', 'waiting_confirm');
		paramData.set('petition_type', String(this.petition_type));
		paramData.set('petition_id', String(this.petition_id));
		paramData.set('m_user_id', String(this.selected_user_id));
		paramData.set('request_m_user_id', this.current_user_info['id']);

		this._FormProcessService.singleProcess(paramData).subscribe(res => {
			if (res.status == 'success') {
				this.loadPaymentData();
				this.modalWaitingConfirm.close();
			}
		})
	}

	/*==============================================
	 * Open Dialog Waiting Confirm
	 *==============================================*/
	onWaitingConfirmDialog(user_id) {
		this.selected_user_id = user_id;
		this.modalWaitingConfirm.open('sm');
	}

	/*=================================
	 * Process confirm msg
	 *=================================*/
	onApproved(type: string) {
		this.modalConfirm.close();
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('process_type', type);
		paramData.set('petition_type', String(this.petition_type));
		paramData.set('petition_id', String(this.petition_id));
		paramData.set('m_user_id', this.current_user_info['id']);
		paramData.set('request_m_user_id', this.current_user_info['id']);

		this._FormProcessService.singleProcess(paramData).subscribe(res => {
			if(res.status == 'success'){
				let msg: string;
				switch(type){
					case 'obic_registration':
						msg = '外部データ出力登録しました。';
						break;
					case 'last_approve':
						msg = '最終承認しました。';
						break;
					case 'return':
						msg = '差戻しました。';
						break;
				}
				this._ToastrService.success(msg);
				if(this.arrID['next']) {
					this.onLinkDetailID(this.arrID['next']);
				}else if (this.arrID['previous']) {
					this.onLinkDetailID(this.arrID['previous']);
				}else{
					if(this._queryParams['previous_page']) {
						this._Router.navigateByUrl(decodeURIComponent(this._queryParams['previous_page']));
					}
				}
			}
		});
	}

	onSave(){
		this.modalUpdate.close();
		let params: URLSearchParams = new URLSearchParams();
		params.set('id', this.Item['id']);
		params.set('m_request_menu_id',this.Item['m_request_menu_id']);
		params.set('cor_amount', this.Item['cor_amount']);
		params.set('cor_suspense_payments', this.Item['cor_suspense_payments']);
		params.set('cor_settlement_amount', this.Item['cor_settlement_amount']);
		params.set('t_request_transport_spec', JSON.stringify(this.transportArray));
		params.set('t_purchase_reception_spec', JSON.stringify(this.purchaseArray));
		params.set('t_cost_divide', JSON.stringify(this.costArray));
		params.set('method','update');

		if(this.t_request_traveling_expenses){
			if(typeof this.t_request_traveling_expenses['other'] != 'string'){
				this.t_request_traveling_expenses['other'] = JSON.stringify(this.t_request_traveling_expenses['other']);
			}
			params.set('t_request_traveling_expenses', JSON.stringify(this.t_request_traveling_expenses));
		}

		if(this.t_request_dietary){
			params.set('m_expense_item_id',this.t_request_dietary['m_expense_item_id']);
		}else{
			params.set('m_expense_item_id',this.Item['m_expense_item_id']);
		}

		this._TRequestService.save(params, this.Item['id']).subscribe(res => {
			if(res.status == 'success'){
				this._ToastrService.success('金額を修正しました。');
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
		this.querySubscription.unsubscribe();
		this.modalConfirm.ngOnDestroy();
		this.modalReceipt.ngOnDestroy();
		this.modalUpdate.ngOnDestroy();
		this.modalZenginkyo.ngOnDestroy();
		this.modalWaitingConfirm.ngOnDestroy();
	}
}
