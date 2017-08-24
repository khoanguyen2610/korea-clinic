import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { AuthService, MRequestMenuService, MExpenseItemService, MTripAreaService, TRequestService, TRequestTravelingExpensesService, GeneralService } from '../../../services';
import { TRequest, TRequestTravelingExpenses, TRequestDietary } from '../../../models';
import { LabelPipe } from '../../../pipes';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { LocalStorageService } from 'angular-2-local-storage';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;
declare let proposal_create: any;
const METHOD = {
	COPY: 'copy',
	CREATE: 'create',
	UPDATE: 'update',
};

@Component({
	selector: 'app-payment-form',
	templateUrl: './payment-form.component.html',
	providers: [MExpenseItemService, MRequestMenuService, MTripAreaService, TRequestService, GeneralService]
})

export class PaymentFormComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;
	@ViewChild('modal') modal: ModalComponent;
	//declare model
	TRequest = new TRequest();
	TRequestDietary = new TRequestDietary();
	TRequestTravel = new TRequestTravelingExpenses();
	codeRequestMenu: Array<any> = [];
	requestMenu: Array<any> = [];
	expenseItemFlag: Array<any> = [];
	expenseItemOption: Array<any> = [];
	formOption: Array<any> = [];
	triptypeOption: Array<any> = [];
	tripareaOption: Array<any> = [];
	withdrawalOption: Array<any> = [];
	costArray: Array<any> = [];
	purchaseArray: Array<any> = [];
	transportArray: Array<any> = [];
	registeredCostArray: Array<any> = [];
	otherArray: Array<any> = [];
	_params: any;
	_pipeLabel: any;
	current_user_info: any;
	currency_symbol: any;
	decimal: any;
	change_menu_when_update: boolean = false;
	change_type_when_update: boolean = false;
	delete_and_create: boolean = false;
	is_draft_validated: boolean = false;
	is_pre_travel: boolean;
	not_confirm: boolean = false;
	required_other: boolean = false;
	curRouting?: string;
	menu_label: string;
	reference_code: string;
	cost_fee: number = 0;
	next_request_menu_id: number;
	next_type: number;
	m_user_id: number;
	m_currency_id: number;
	position_id: number;
	receipt_flg: number;
	traveling_fee: number = 0;
	transport_purchase_fee: number = 0;
	total: number = 0;

	uploadProgress: any;
	files_type = [];
	files_upload = 0;
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;

	public request_type = [
		{'value':1,'label':'精算・申請'},
		{'value':2,'label':'仮払'},
	];

	public priority_flg = [
		{'value':0,'label':'通常'},
		{'value':1,'label':'優先'},
	];

	public change_route = [
		{'value':0,'label':'無'},
		{'value':1,'label':'有'},
	];

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _MTripAreaService: MTripAreaService,
		private _MExpenseItemService: MExpenseItemService,
		private _MRequestMenuService: MRequestMenuService,
		private _TRequestService: TRequestService,
		private _GeneralService: GeneralService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _LocalStorageService: LocalStorageService
	) {
		this.current_user_info = this._AuthService.getCurrent();
		this._pipeLabel = new LabelPipe();
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
		//=============== Get Params On Url ===============
		this.subscription = this._ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.loadPage();
			}
		});

		/*=============== Get request menu options ===============*/
		let request_menu_params: URLSearchParams = new URLSearchParams();
		request_menu_params.set('enable_flg','1');
		this._MRequestMenuService.getAll(request_menu_params).subscribe(res => {
			if(res.status == 'success'){
				if(res.data){
					var options = [];
					var code = [];
					for (let key in res.data) {
						let obj = { value: res.data[key].id, label: res.data[key].name };
						options.push(obj);
						let objs = { value: res.data[key].id, label: res.data[key].code };
						code.push(objs);
						//set menu label
						if(res.data[key].id == this._params.m_request_menu_id){
							this.menu_label = res.data[key].name
						}
					}
					this.requestMenu = options;
					this.codeRequestMenu = code;
				}
			}
		});

		this.files_type = this._Configuration.upload_file_extension;
	}

	ngOnInit() {
		proposal_create.toggleMenu();
	}

	loadPage(){
		switch(this._params.method){
			case 'create':
				this.currency_symbol = this.current_user_info.currency_symbol;
				this.position_id = this.current_user_info.position_id;
				this.m_user_id = this.current_user_info.id;
				this.m_currency_id = this.current_user_info.m_currency_id;
				this.initPage(+this._params.m_request_menu_id, +this._params.type);
				break;
			case 'copy':
			case 'update':
				if(this._params.id != null){
					this.initData();
				}else{
					this._Router.navigate(['/']);
				}
				break;
		}
	}

	initPage(m_request_menu_id: number, type: number){
		this.initDefaultValues(m_request_menu_id, type);
		this.initTriptype(m_request_menu_id);
		this.initExpenseItem(m_request_menu_id);
	}

	initDefaultValues(m_request_menu_id: number, type: number){
		//reset all objectives
		this.TRequest = new TRequest();
		this.TRequestDietary = new TRequestDietary();
		this.TRequestTravel = new TRequestTravelingExpenses();
		//set default value
		setTimeout(() => {
			this.TRequest.m_request_menu_id = m_request_menu_id;
			this.TRequest.type = type;
			this.TRequest.priority_flg = 0;
			this.TRequest.change_route = 0;
			this.TRequest.amount = 0;
			this.TRequest.suspense_payments = 0;
			this.TRequest.settlement_amount = 0;
			this.TRequest.date = moment().format(this._Configuration.formatDate);
			this.is_pre_travel = (m_request_menu_id == 2 || m_request_menu_id == 3);
		})
		//reset all properties
		this.change_menu_when_update = false;
		this.change_type_when_update = false;
		this.is_draft_validated = false;
		this.reference_code = null;
		this.cost_fee = 0;
		this.transport_purchase_fee = 0;
		this.traveling_fee = 0;
		this.total = 0;
		this.costArray = [];
		this.transportArray = [];
		this.purchaseArray = [];
		this.otherArray = [];
		this.registeredCostArray = [];
		//set menu label
		this.requestMenu.forEach(item => {
			if(item.value == m_request_menu_id.toString()){
				this.menu_label = item.label;
				return false;
			}
		})

		// reset file upload
		this.uploader = new FileUploader({});
		for (let k in this.TRequest['files_attach']) {
			this.TRequest['files_attach'][k].is_deleted = true;
		}
	}

	initTriptype(m_request_menu_id: number){
		var options = [],
			area = [],
			item = [],
			type = 0;
		switch (m_request_menu_id) {
			case 2:
			case 4:
				type = 1;
				this.TRequestTravel.business_trip_class = type.toString();
				options.push({id: type, text: '国内'});
				break;
			case 3:
			case 5:
				type = 2;
				this.TRequestTravel.business_trip_class = type.toString();
				options.push({id: type, text: '海外'});
				break;
			default:
				break;
		}
		this.TRequestTravel.m_trip_area_id = null;
		this.triptypeOption = options;

		//initial trip area, withdrawal, reference form options
		if(type){
			/*=============== get trip area form options ===============*/
			let area_params: URLSearchParams = new URLSearchParams();
			area_params.set('type',type.toString());
			area_params.set('item_status','active');
			this.tripareaOption.push({ id: this.TRequestTravel['m_trip_area_id'], text: null });
			this._MTripAreaService.getAll(area_params).subscribe(res => {
				if(res.status=='success'){
					if(res.data){
						for (let key in res.data) {
							area.push({ id: res.data[key].id, text: res.data[key].name });
						}
						this.tripareaOption = area;
					}
				}
			});

			/*=============== get withdrawal form options ===============*/
			this._TRequestService.getWithdrawalList().subscribe(res => {
				if(res.status=='success'){
					if(res.data){
						for (let key in res.data) {
	                        item.push({ id: res.data[key].id, text: res.data[key].item });
						}
						this.withdrawalOption = item;
					}
				}
			});

			/*=============== get reference form options ===============*/
			let reference_params: URLSearchParams = new URLSearchParams();
			reference_params.set('m_request_menu_id',m_request_menu_id.toString());
			this._TRequestService.getReferenceFormList(reference_params).subscribe(res => {
				if(res.status=='success'){
					var options = [];
					for (let key in res.data) {
						options.push({ id: res.data[key].id, text: res.data[key].name });
					}
					this.formOption = options;
				}
			});
		}
	}

	initExpenseItem(m_request_menu_id: number){
		if(m_request_menu_id==6 || m_request_menu_id==8 || m_request_menu_id==9){
			let type_code: string;
			switch (m_request_menu_id) {
				case 6:
					type_code = '02';
					break;
				case 8:
					type_code = '05';
					break;
				case 9:
					type_code = '06';
					break;
			}
			let params: URLSearchParams = new URLSearchParams();
			params.set('type_code', type_code);
			params.set('item_status', 'active');
			this._MExpenseItemService.getAll(params).subscribe(res => {
				if(res.status=='success'){
					if(res.data){
						var options = [];
						var flags = [];
	                    for (let key in res.data) {
							options.push({ id: res.data[key].id, text: res.data[key].item });
							flags.push({ value: res.data[key].id, label: res.data[key].receipt_flg });
	                    }
	                    this.expenseItemOption = options;
	                    this.expenseItemFlag = flags;
					}
				}
			});
		}
	}

	//initial original data of form
	initData(){
		this.uploader = new FileUploader({});
		this._TRequestService.getByID(this._params.id).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					//redirect to homepage if form's petition status is not 1 and action is update
					if(+res.data.m_petition_status_id > 1 && this._params.method == METHOD.UPDATE){
						this._Router.navigate(['/']);
						return;
					}

					this.initPage(+res.data.m_request_menu_id, +res.data.type);

					if (res.data['files_attach']) {
						for (let key in res.data['files_attach']) {
							var filename = res.data['files_attach'][key].filename;
							var file_type = filename.split('.');
							let item: any = { file: { name: filename, type: file_type[1], is_download: true }, _file: { id: res.data['files_attach'][key].id, name: filename, type: file_type[1], is_keeping: true } };
							this.uploader.queue.push(item);
						}
					}
					//set user info
					if(this._params.method=='update'){
						this.current_user_info = res.data.user_create_form;
						this.currency_symbol = res.data.currency_symbol;
						this.m_user_id = res.data.user_create_form.m_user_id;
						this.m_currency_id = res.data.m_currency_id;
						this.position_id = this.current_user_info.m_position_id;
					}

					if(this._params.method=='copy'){
						this.currency_symbol = this.current_user_info.currency_symbol;
						this.m_user_id = this.current_user_info.id;
						this.m_currency_id = this.current_user_info.m_currency_id;
						this.position_id = this.current_user_info.position_id;
					}

					//after page had initialed, wait 1 second to populate data
					setTimeout(() => {
						//set traveling expenses
						if(res.data.t_request_traveling_expenses){
							/** set traveling data **/
							let t_request_traveling_expenses = res.data.t_request_traveling_expenses;
							// delete t_request_traveling_expenses.quote_t_request_id;
							//transform format t_request_traveling_expenses fields
							t_request_traveling_expenses.approximate_amount = this.decimal.transform(t_request_traveling_expenses.approximate_amount);
							let departure_time: string = t_request_traveling_expenses.departure_time;
							t_request_traveling_expenses.departure_time = departure_time ? departure_time.substring(0,departure_time.lastIndexOf(':')) : null;
							let end_time: string = t_request_traveling_expenses.end_time;
							t_request_traveling_expenses.end_time = end_time ? end_time.substring(0,end_time.lastIndexOf(':')) : null;
							t_request_traveling_expenses.lodging_days = t_request_traveling_expenses.lodging_days ? parseFloat(t_request_traveling_expenses.lodging_days) : null;
							t_request_traveling_expenses.perdiem_days = t_request_traveling_expenses.perdiem_days ? parseFloat(t_request_traveling_expenses.perdiem_days) : null;
							t_request_traveling_expenses.lodging_receipt_flg = (t_request_traveling_expenses.lodging_receipt_flg==1)?1:null;
							if(t_request_traveling_expenses.departure_transportation_id == 0){
								t_request_traveling_expenses.departure_transportation_id = null;
							}
							if(t_request_traveling_expenses.end_transportation_id == 0){
								t_request_traveling_expenses.end_transportation_id = null;
							}
							if(t_request_traveling_expenses.m_trip_area_id == 0){
								t_request_traveling_expenses.m_trip_area_id = null;
							}

							this.TRequestTravel = t_request_traveling_expenses;
							let other_fee: number = 0;
							/** set other array and amount of traveling fee **/
							this.otherArray = Object.keys(t_request_traveling_expenses.other).map(index => {
									let obj = t_request_traveling_expenses.other[index];
									other_fee += +obj.payments;
									obj.payments = this.decimal.transform(obj.payments);
									return obj;
								});
								this.traveling_fee = +t_request_traveling_expenses.perdiem_fee + +t_request_traveling_expenses.lodging_fee + other_fee;
						}

						/** set dietary data **/
						if(res.data.t_request_dietary){
							let t_request_dietary = res.data.t_request_dietary;
							t_request_dietary.participant_num = this.decimal.transform(t_request_dietary.participant_num);
							this.TRequestDietary = t_request_dietary;
							res.data.m_expense_item_id = t_request_dietary.m_expense_item_id;
						}
						/** set transport array **/
						if(res.data.t_request_transport_spec.length){
							let transport_fee: number = 0;
							this.transportArray = Object.keys(res.data.t_request_transport_spec).map(index => {
								let obj = res.data.t_request_transport_spec[index];
								let parseDate = Date.parse(obj.use_date);
								obj.use_date = moment(parseDate).format(this._Configuration.formatDate);
								transport_fee += +obj.transportation_spec_fee;
								obj.transportation_spec_fee = this.decimal.transform(obj.transportation_spec_fee);
								return obj;
							});
							this.transport_purchase_fee = transport_fee;
						}
						/** set purchase array **/
						if(res.data.t_purchase_reception_spec.length){
							let purchase_fee: number = 0;
							this.purchaseArray = Object.keys(res.data.t_purchase_reception_spec).map(index => {
								let obj = res.data.t_purchase_reception_spec[index];
								let parseDate = Date.parse(obj.reception_date);
								obj.reception_date = moment(parseDate).format(this._Configuration.formatDate);
								purchase_fee += +obj.payments;
								obj.payments = this.decimal.transform(obj.payments);
								this.receipt_flg = obj.receipt_flg;
								return obj;
							});
							this.transport_purchase_fee = purchase_fee;
						}
						//set amount
						this.total = this.transport_purchase_fee + this.traveling_fee;
						/** set cost divide array **/
						if(res.data.t_cost_divide){
							this.registeredCostArray = Object.keys(res.data.t_cost_divide).map(index => {
								let obj = res.data.t_cost_divide[index];
								obj.divide_cost = this.decimal.transform(obj.divide_cost);
								return obj;
							});
						}
						delete res.data.t_request_traveling_expenses;
						delete res.data.t_request_dietary;
						delete res.data.t_request_transport_spec;
						delete res.data.t_purchase_reception_spec;
						delete res.data.t_cost_divide;
						delete res.data.routes;
						res.data.suspense_payments = this.decimal.transform(res.data.suspense_payments);
						//set moment({}) will get current date
						let parseDate = (this._params.method == 'update') ? Date.parse(res.data.date) : {};
						res.data.date = moment(parseDate).format(this._Configuration.formatDate);
						this.TRequest = res.data;
					},1000);
				}else{
					this._Router.navigate(['/']);
				}
			}else{
				this._Router.navigate(['/']);
			}
		});
	}

	//update purchase array
	setPurchaseArray(purchaseArray){
		this.purchaseArray = purchaseArray;
	}

	//update transport array
	setTransportArray(transportArray){
		this.transportArray = transportArray;
	}

	//update cost divide array
	setCostArray(costArray){
		let fee: string;
		let amount: number = 0;
		costArray.forEach(item => {
			fee = item.divide_cost.toString().replace(/,/g,'');
			amount += parseFloat(fee);
		});
		this.cost_fee = amount;
		this.costArray = costArray;
	}

	//check validate data of table t_request_traveling_expenses_other
	onCheckRequiredOther(required_other){
		this.required_other = required_other;
	}

	//change request menu
	onChangeMenu(m_request_menu_id: number){
		//detect user chose other request menu when method is update
		if(this._params.method=='update'){
			this.change_menu_when_update = true;
			if(m_request_menu_id==this.TRequest.m_request_menu_id){
				this.change_menu_when_update = false;
				return;
			}else{
				if(this.not_confirm){
					//if user don't want to delete, restored radio button's previous value
					this.delete_and_create = false;
					this.not_confirm = false;
					this.change_menu_when_update = false;
					var default_request_menu = this.TRequest.m_request_menu_id;
					$('input[name=m_request_menu_id]:radio').each(function(){
						if($(this).val() == default_request_menu){
							$(this).prop('checked',true);
						}
					});
					return;
				}else{
					if(this.delete_and_create){
						this.delete_and_create = false;
						this.not_confirm = false;
					}else{
						this.next_request_menu_id = m_request_menu_id;
						this.delete_and_create = true;
						this.modal.open('sm');
						return;
					}
				}
			}
		}

		if(this.TRequest.type == 2){
			m_request_menu_id = 6;
		}
		let type:number = this.TRequest.type;
		this._Router.navigate(['/payment/form/create', m_request_menu_id, type]);
	}

	//change request type
	onChangeType(type: number){
		if(this._params.method=='update'){
			this.change_type_when_update = true;
			if(type==this.TRequest.type){
				this.change_type_when_update = false;
				return;
			}else{
				if(this.not_confirm){
					this.delete_and_create = false;
					this.not_confirm = false;
					this.change_type_when_update = false;
					var default_type = this.TRequest.type;
					setTimeout(function(){
						$('input[name=type]:radio').each(function(){
							if($(this).val() == default_type){
								$(this).prop('checked',true);
							}
						})
					},500);
					return;
				}else{
					if(this.delete_and_create){
						this.delete_and_create = false;
						this.not_confirm = false;
					}else{
						this.next_type = type;
						this.delete_and_create = true;
						this.modal.open('sm');
						return;
					}
				}
			}
		}

		if(type == 2){
			this.TRequest.m_request_menu_id = 6;
		}
		let m_request_menu_id:number = this.TRequest.m_request_menu_id;
		this._Router.navigate(['/payment/form/create', m_request_menu_id, type]);
	}

	//set receipt_flg when user change m_expense_item_id value
	onChangeExpense(event){
		let flags = this._pipeLabel.transform(this.expenseItemFlag, event.id);
		let flag = flags.shift();
		this.receipt_flg = flag.label;
		this.TRequest.m_expense_item_id = event.id;
	}

	//choose reference form
	onChangeReferenceForm(event){
		this.TRequestTravel.quote_t_request_id = event.id;
	}

	//reset form payment
	onClear(form: NgForm, event){
		let m_request_menu_id: number = this.TRequest.m_request_menu_id;
		let type: number = this.TRequest.type;
		form.reset();
		this.initPage(+m_request_menu_id, +type);
		event.preventDefault();
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
		this.TRequest.suspense_payments = suspense_payments;
		this.calculate();
	}

	//populate data from reference form
	onReferenceForm(value){
		let id = value;
		this._TRequestService.getByID(id).subscribe(res =>{
			if(res.status=='success'){
				if(res.data){
					setTimeout(() => {
						this.TRequest.destination = res.data.destination;
						this.TRequest.reason = res.data.reason;
						this.TRequest.priority_flg = res.data.priority_flg;
						this.TRequest.change_route = res.data.change_route;
						this.reference_code = res.data.code;
						//set TRequestTravel object
						let t_request_traveling_expenses = res.data.t_request_traveling_expenses;
						let parseDate = Date.parse(res.data.t_request_traveling_expenses.end_date);
						this.TRequestTravel.settlement_date = moment(parseDate).format(this._Configuration.formatDate);
						this.TRequestTravel.business_trip_destination = t_request_traveling_expenses.business_trip_destination;
						this.TRequestTravel.accommodation = t_request_traveling_expenses.accommodation;
						this.TRequestTravel.contact_address = t_request_traveling_expenses.contact_address;
						this.TRequestTravel.m_trip_area_id = t_request_traveling_expenses.m_trip_area_id;
						this.TRequestTravel.departure_date = t_request_traveling_expenses.departure_date;
						this.TRequestTravel.departure_transportation_id = t_request_traveling_expenses.departure_transportation_id;
						let departure_time: string = t_request_traveling_expenses.departure_time;
						this.TRequestTravel.departure_time = departure_time.substring(0,departure_time.lastIndexOf(':'));
						this.TRequestTravel.departure_flight = t_request_traveling_expenses.departure_flight;
						this.TRequestTravel.end_date = t_request_traveling_expenses.end_date;
						this.TRequestTravel.end_transportation_id = t_request_traveling_expenses.end_transportation_id;
						let end_time: string = t_request_traveling_expenses.end_time;
						this.TRequestTravel.end_time = end_time.substring(0,end_time.lastIndexOf(':'));
						this.TRequestTravel.end_flight = t_request_traveling_expenses.end_flight;
						this.TRequestTravel.memo = t_request_traveling_expenses.memo;
						this.TRequestTravel.perdiem_daily = t_request_traveling_expenses.perdiem_daily;
						this.TRequestTravel.perdiem_days = t_request_traveling_expenses.perdiem_days?parseFloat(t_request_traveling_expenses.perdiem_days):null;
						this.TRequestTravel.perdiem_fee = t_request_traveling_expenses.perdiem_fee;
						this.TRequestTravel.lodging_daily = t_request_traveling_expenses.lodging_daily;
						this.TRequestTravel.lodging_days = t_request_traveling_expenses.lodging_days?parseFloat(t_request_traveling_expenses.lodging_days):null;
						this.TRequestTravel.lodging_fee = t_request_traveling_expenses.lodging_fee;
						this.TRequestTravel.lodging_receipt_flg = (t_request_traveling_expenses.lodging_receipt_flg==1)?1:null;
						this.otherArray = Object.keys(t_request_traveling_expenses.other).map(index => {
							let obj = t_request_traveling_expenses.other[index];
							obj.payments = this.decimal.transform(obj.payments);
							return obj;
						});
					}, 1000);
				}
			}
		});
	}

	//calculate amount of money and bind to form
	private calculate(){
		if(this.TRequest.type==2){
			this.TRequest.amount = 0;
			this.TRequest.settlement_amount = 0;
		}else{
			setTimeout(() => {
				let suspense_payments: number = 0;
				this.TRequest.amount = this.total;
				if(this.TRequest.suspense_payments){
					suspense_payments = +this.TRequest.suspense_payments.toString().replace(/,/g,'');
				}
				this.TRequest.settlement_amount = this.total - suspense_payments;
			}, 300);
		}

	}

	//validate required fields
	validateRequiredField(type: string){
		this.is_draft_validated = true;
		switch (+this.TRequest.m_request_menu_id) {
			case 1:
				if(!this.TRequest.destination) return false;
				break;
			case 2:
			case 3:
			case 4:
			case 5:
				if(!this.TRequest.destination) return false;
				if(type == 'apply'){
					if(!this.TRequestTravel.m_trip_area_id) return false;
					if(!this.TRequestTravel.departure_date) return false;
					if(!this.TRequestTravel.departure_transportation_id) return false;
					if(!this.TRequestTravel.departure_time) return false;
					if(!this.TRequestTravel.end_date) return false;
				}
				break;
			case 6:
				if(!this.TRequest.m_expense_item_id) return false;
				break;
			case 8:
				if(!this.TRequest.m_expense_item_id) return false;
				if(type == 'apply'){
					if(!this.TRequestDietary.participant_name) return false;
					if(!this.TRequestDietary.participant_num) return false;
				}
				break;
			case 9:
				if(!this.TRequest.m_expense_item_id) return false;
				if(type == 'apply'){
					if(!this.TRequestDietary.other_company_name) return false;
					if(!this.TRequestDietary.our_company_participant_name) return false;
					if(!this.TRequestDietary.participant_num) return false;
				}
				break;
			default:
				break;
		}
		if(typeof this.TRequest.reason == "string"){
			this.TRequest.reason = this.TRequest.reason.trim();
		}
		if(!this.TRequest.reason) return false;
		//validate select field m_expense_item_id of form traveling expenses
		if(this.required_other){
			this._ToastrService.error('必須項目に情報を入力してください。');
			return false;
		}
		//validate amount of money equal to divide cost
		if(!((this.total == this.cost_fee) || (this.cost_fee == 0))){
			this._ToastrService.error('精算金額に対して按分金額の相違があります。');
			return false;
		}
		return true;
	}

	//save form payment
	onSave(form: NgForm, type: string){
		if(!this.validateRequiredField(type)){
			return;
		}

		$('.loading').show();
		let formData: FormData = new FormData();
		let files = [];

		if (this.uploader.queue.length) {
			for (let key in this.uploader.queue) {
				var upload = this.uploader.queue[key]._file;
				//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
				var objUpload = new Blob([upload]);
				if (upload['id']) {
					// formData.append("uploads[" + upload['id'] + "]", objUpload, upload.name);
					// formData.append("upload_inputs[" + upload['id'] + "]", upload, upload.name);
				} else {
					formData.append("uploads[]", objUpload, upload.name);
					// formData.append("uploads[]", upload, upload.name);
				}
			}
		}

		if (this._params['method'] != METHOD.CREATE) {
			formData.append('files_attach', JSON.stringify(this.TRequest['files_attach']));
		}

		// let params: URLSearchParams = new URLSearchParams();
		formData.append('type',this.TRequest.type);
		formData.append('m_request_menu_id',this.TRequest.m_request_menu_id);
		formData.append('m_user_id',this.m_user_id);
		formData.append('date',this.TRequest.date);
		formData.append('destination',this.TRequest.destination);
		formData.append('reason',this.TRequest.reason);
		formData.append('priority_flg',this.TRequest.priority_flg);
		formData.append('change_route',this.TRequest.change_route);
		formData.append('amount',this.TRequest.amount);
		formData.append('suspense_payments',this.TRequest.suspense_payments);
		formData.append('settlement_amount',this.TRequest.settlement_amount);
		formData.append('cor_amount',this.TRequest.amount);
		formData.append('cor_suspense_payments',this.TRequest.suspense_payments);
		formData.append('cor_settlement_amount',this.TRequest.settlement_amount);
		formData.append('m_currency_id',this.m_currency_id);
		formData.append('t_cost_divide',JSON.stringify(this.costArray));
		formData.append('method',this._params.method);
		//get code request menu
		let request_menu = this._pipeLabel.transform(this.codeRequestMenu,this.TRequest.m_request_menu_id.toString());
		let menu_code = request_menu.shift();
		formData.append('m_menu_code',menu_code.label);
		//get reference form id
		if(this._params.method == 'copy'){
			formData.append('copy_petition_id',this._params.id);
		}
		switch (+this.TRequest.m_request_menu_id) {
			//form transportation
			case 1:
				formData.append('t_request_transport_spec',JSON.stringify(this.transportArray));
				break;
			//form pre-travel
			case 2:
			case 3:
				formData.append('t_request_traveling_expenses',JSON.stringify(this.TRequestTravel));
				break;
			//form traveling
			case 4:
			case 5:
				formData.append('reference_form_id',this.TRequestTravel.quote_t_request_id);
				formData.append('t_request_transport_spec',JSON.stringify(this.transportArray));
				formData.append('t_request_traveling_expenses',JSON.stringify(this.TRequestTravel));
				break;
			//form purchase
			case 6:
				this.purchaseArray.forEach(item => {
					item.receipt_flg = this.receipt_flg;
				});
				formData.append('m_expense_item_id',this.TRequest.m_expense_item_id.toString());
				formData.append('t_purchase_reception_spec',JSON.stringify(this.purchaseArray));
				break;
			//form dietary
			case 8:
			case 9:
				this.TRequestDietary.m_expense_item_id = this.TRequest.m_expense_item_id;
				this.purchaseArray.forEach(item => {
					item.receipt_flg = this.receipt_flg;
				});
				formData.append('m_expense_item_id',this.TRequest.m_expense_item_id.toString());
				formData.append('t_purchase_reception_spec',JSON.stringify(this.purchaseArray));
				formData.append('t_request_dietary',JSON.stringify(this.TRequestDietary));
				break;
			default:
				// code...
				break;
		}

		if (this._params['method'] == METHOD.COPY) {
			formData.append('copy_petition_id', this._params['id']);
		}

		this._TRequestService.getObserver()
			.subscribe(progress => {
				this.uploadProgress = progress;

			});
		try {
			this._TRequestService.upload(formData, this.TRequest.id).then((res) => {
				if (res.status == 'success') {
					if (type == 'draft') {
						this._ToastrService.success('起案を保存しました。');
						this._Router.navigate(['/']);
					} else {
						let time = new Date().getTime();
						this.createSessionCreatedForm(2, res.record_id, time);
						if (this.TRequest.change_route == 1) {
							this._Router.navigate(['/payment/set-routes', res.record_id]);
						} else {
							let current_path = '/payment/form/update/' + res.record_id;
							this._Router.navigate(['/payment/detail', res.record_id], { queryParams: { previous_page: encodeURIComponent(current_path) } });
						}
					}

				}

			});
		} catch (error) {
			document.write(error)
		}
	}

	/*====================================
	 * Create Session Created Form
	 *====================================*/
	createSessionCreatedForm(petition_type, petition_id, time) {
		this._LocalStorageService.set(petition_type + '_' + petition_id, { petition_id: petition_id, time: time });
	}

	/*====================================
	 * Function delete payment form
	 *====================================*/
	onConfirmDelete() {
		this.modal.close();
		this._TRequestService.delete(this._params.id).subscribe(res => {
			if (res.status == 'success') {
				this._ToastrService.success('データを削除しました。');
				if(this.delete_and_create){
					if(this.change_menu_when_update) this.onChangeMenu(this.next_request_menu_id);
					if(this.change_type_when_update) this.onChangeType(this.next_type);
				}else{
					this._Router.navigate(['/']);
				}
			}
		})
	}

	onNotConfirm(){
		this.not_confirm = true;
		if(this.change_menu_when_update) this.onChangeMenu(this.next_request_menu_id);
		if(this.change_type_when_update) this.onChangeType(this.next_type);
		this.modal.close();
	}

	/*==============================================
	 * Download Form
	 *==============================================*/
	onDownloadForm(attachment_id, type: string) {
		/*==============================================
		 * Get Link Download File
		 *==============================================*/
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

	/*==============================================
	 * Remove file on stack
	 *==============================================*/
	onRemoveFile(index, file_id) {
		if (this.uploader.queue.length) {
			this.uploader.queue.splice(index, 1);
		}

		if (file_id) { // check id of file
			this.TRequest['files_attach'][file_id].is_deleted = true;
		}

	}

	/*====================================
	 * Validate Form File Type
	 *====================================*/
	onValidateFormFileType() {
		this.uploader['error_limit_files'] = false;

		let pre_upload_files = +this.uploader.queue.length; // previous drag upload files
		setTimeout(() => {

			let after_upload_files = +this.uploader.queue.length; // after drag upload files
			if (after_upload_files <= this._Configuration.limit_files) {
				if (after_upload_files != this.files_upload) {
					let uploader = [];
					for (let key in this.uploader.queue) {
						var checked = false;
						var ext = this.uploader.queue[key]._file.name.split('.').pop();
						ext = ext.toLowerCase();

						for (let k in this.files_type) {

							if (ext.indexOf(this.files_type[k]) > -1) {
								checked = true;
								break;
							}
						}

						if (!checked) {
							var msgInvalidFileType = this.uploader.queue[key]._file.type + 'は無効なファイル形式です。' + this.files_type.join() + '形式のファイルのみサポートしています'
							this._ToastrService.error(msgInvalidFileType);
							checked = false;
						}

						if (this.uploader.queue[key]._file.size > this._Configuration.limit_file_size) {
							var msgSizeTooLarge = 'ファイル' + this.uploader.queue[key]._file.name + ' (' + Math.round(this.uploader.queue[key]._file.size / (1024 * 1024)) + 'MB)はアップロード可能な上限容量' + this._Configuration.limit_file_size / (1024 * 1024) + 'MBを超えています'
							this._ToastrService.error(msgSizeTooLarge);
							checked = false;
						}

						if (!checked) {
							// this.uploader.queue.splice(+key, 1);
							this.uploader.queue[key].isError = true;
						} else {
							this.uploader.queue[key]._file['is_keeping'] = true;
							uploader.push(this.uploader.queue[key]);
						}


					}
					this.uploader.queue = uploader;
					this.files_upload = this.uploader.queue.length;
				}
			} else {

				// Case over limit files > 10
				this._ToastrService.error('アップロード可能な上限数(10個)を超えているので、アップロードできません。');

				let queue = [];
				for (let i in this.uploader.queue) {
					if (this.uploader.queue[i]._file['is_keeping']) {
						queue.push(this.uploader.queue[i]);
					}
				}
				this.uploader.queue = queue;
			}


		}, 500);

	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		this.onValidateFormFileType();
		this.hasAnotherDropZoneOver = e;
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
		this.modal.ngOnDestroy();
	}
}
