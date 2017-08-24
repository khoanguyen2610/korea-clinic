import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../shared';
import { MExpenseItemService, MTripPerdiemAllowanceService } from '../../../../services';
import { TRequestTravelingExpenses, TRequestTravelingExpensesOther } from '../../../../models';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare let $: any;
declare let moment: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'payment-travel',
	templateUrl: './payment-travel-form.component.html',
	providers: [ MExpenseItemService, MTripPerdiemAllowanceService ]
})

export class PaymentTravelFormComponent implements OnInit, OnChanges, AfterViewInit{
	@Input('travel') Item: TRequestTravelingExpenses;
	@Input() currency_symbol: string;
	@Input() is_draft_validated: boolean;
	@Input() m_position_id: number;
	@Input('triptype') triptypeOption: Array<any> = [];
	@Input('triparea') tripareaOption: Array<any> = [];
	@Input('withdrawal') withdrawalOption: Array<any> = [];
	@Input('other') otherArray: Array<any> = [];
	@Output('amount') amountOutput = new EventEmitter();
	@Output('validation') validationOutput = new EventEmitter();
	expenseItemOption: Array<any> = [];
	Item01 = new TRequestTravelingExpensesOther();
	Item02 = new TRequestTravelingExpensesOther();
	Item03 = new TRequestTravelingExpensesOther();
	required01: boolean = false;
	required02: boolean = false;
	required03: boolean = false;
	decimal: any;
	width: any;

	constructor(
		private _Configuration: Configuration,
		private _MExpenseItemService: MExpenseItemService,
		private _MTripPerdiemAllowanceService: MTripPerdiemAllowanceService,
		private _DomSanitizer: DomSanitizer
	){
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
		/*=============== Get request menu options ===============*/
		let params: URLSearchParams = new URLSearchParams();
		params.set('type_code','01');
		params.set('item_status','active');
		params.set('enable_flg','1');
		this.expenseItemOption.push({ id: null, text: null });
		this._MExpenseItemService.getAll(params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].item };
                        options.push(obj);
                    }
                    this.expenseItemOption = options;
				}
			}
		});
	}

	ngOnInit(){}

	ngAfterViewInit(){
		let Configuration = this._Configuration;
		//reload jquery plugin
		$('.daterange-single').datetimepicker({
			locale: 'ja',
			format: Configuration.formatDate,
    	});

		$('.timepicker').timepicker({
			'showDuration': true,
			'timeFormat': 'H:i',
			'step' : 10
		});

		
  		//cleave number format
  		applyCleaveJs();

		//calculate width .select-box-2
		setTimeout(() => {
			let minus_width = (+this.Item.business_trip_class == 1) ? '0px' : '130px';
			this.width = this._DomSanitizer.bypassSecurityTrustStyle('calc(50% - ' + minus_width + ')');	
		});
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		//listen the event change of otherArray when user load reference form from PaymentFormComponent
		if(this.otherArray.length){
			let other = this.otherArray;
			if(typeof other[0]!='undefined'){
				this.Item01 = other[0];
			} 
			if(typeof other[1]!='undefined'){
				this.Item02 = other[1];
			}
			if(typeof other[2]!='undefined'){
				this.Item03 = other[2];
			}
			this.onChangeExpenseOther();
		}else{
			if(!this.is_draft_validated){
				this.Item01 = new TRequestTravelingExpensesOther();
				this.Item02 = new TRequestTravelingExpensesOther();
				this.Item03 = new TRequestTravelingExpensesOther();
				this.setValidateRequired();	
			}
		}

		if(this.Item.m_trip_area_id){
			this.onSetFee(this.Item.m_trip_area_id, true);
		}
	}

	//update amount when detect m_trip_area_id has selected
	onSetFee(event, reload?: boolean){
		let m_trip_area_id = (reload == true) ? event : event.id;
		this.Item.m_trip_area_id = m_trip_area_id;
		let params: URLSearchParams = new URLSearchParams();
		params.set('m_trip_area_id', m_trip_area_id);
		params.set('m_position_id', this.m_position_id.toString());
		params.set('item_status', 'active');
		this._MTripPerdiemAllowanceService.getAll(params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					let item = res.data.shift();
					this.calculate(item.perdiem, item.allowance);
				}
			}
		});
	}

	//set transport
	onChangeTransport(event, field: string){
		this.Item[field] = event.id;
	}

	//update amount when detect loging fee has change
	onChangeLodging(value: number){
		let perdiem: number = this.Item.perdiem_daily;
		let allowance: number = value;
		this.calculate(perdiem, allowance);
	}

	//update amount when user input other fee
	onChangeOtherFee(value: number){
		let perdiem: number = this.Item.perdiem_daily;
		let allowance: number = this.Item.lodging_daily;
		this.calculate(perdiem, allowance);
		this.setValidateRequired();
	}

	//update amount when user input travel days
	onChangeTravelDays(value: number){
		let perdiem: number = this.Item.perdiem_daily;
		let allowance: number = this.Item.lodging_daily;
		if(typeof perdiem != 'undefined' && typeof allowance != 'undefined'){
			this.calculate(perdiem, allowance);
		}
	}

	//update t_request_traveling_expenses when user selected expense item
	onChangeExpenseOther(){
		this.setValidateRequired();
		this.Item.other = JSON.stringify([this.Item01,this.Item02,this.Item03]);
	}

	//check validate field m_expense_item_id of table t_request_traveling_expenses_other when user input other fields 
	private setValidateRequired(){
		this.required01 = this.Item01.m_expense_item_id ? false : ((this.Item01.description || this.Item01.payments) ? true : false);	
		this.required02 = this.Item02.m_expense_item_id ? false : ((this.Item02.description || this.Item02.payments) ? true : false);	
		this.required03 = this.Item03.m_expense_item_id ? false : ((this.Item03.description || this.Item03.payments) ? true : false);
		let required = (this.required01 || this.required02 || this.required03);
		this.validationOutput.emit(required);
	}

	//calculate traveling amount
	private calculate(perdiem: number, allowance: number){
		if(typeof perdiem == 'undefined') perdiem = 0;
		if(typeof allowance == 'undefined') allowance = 0;
		let perdiem_days: number = this.Item.perdiem_days;
		let lodging_days: number = this.Item.lodging_days;
		let perdiem_fee: number = 0;
		let lodging_fee: number = 0;
		let other_payments_1: number = this.Item01.payments;
		let other_payments_2: number = this.Item02.payments;
		let other_payments_3: number = this.Item03.payments;
		let amount: number = 0;
		//calculate perdiem_fee
		perdiem = +perdiem.toString().replace(/,/g,'');
		if(perdiem_days){
			perdiem_days = parseFloat(perdiem_days.toString().replace(/,/g,''));
			perdiem_fee = perdiem * perdiem_days;
		}
		//calculate lodging_fee
		allowance = +allowance.toString().replace(/,/g,'');
		if(lodging_days){
			lodging_days = parseFloat(lodging_days.toString().replace(/,/g,''));
			lodging_fee = allowance * lodging_days;
		}
		//other payments
		other_payments_1 = other_payments_1 ? +other_payments_1.toString().replace(/,/g,'') : 0;
		other_payments_2 = other_payments_2 ? +other_payments_2.toString().replace(/,/g,'') : 0;
		other_payments_3 = other_payments_3 ? +other_payments_3.toString().replace(/,/g,'') : 0;
		//calculate amount
		amount = perdiem_fee + lodging_fee + other_payments_1 + other_payments_2 + other_payments_3;
		//set value
		this.Item.perdiem_daily = perdiem;
		this.Item.perdiem_fee = perdiem_fee;
		this.Item.lodging_daily = allowance;
		this.Item.lodging_fee = lodging_fee;
		this.Item.other = JSON.stringify([this.Item01,this.Item02,this.Item03]);
		//output to payment-form component
		this.amountOutput.emit(amount);
	}

	//update settlement_date when user has chosen end_date
	onSetSettlementDate(value){
		var parsedDate = Date.parse(value);
		this.Item.end_date = value;
		this.Item.settlement_date = isNaN(parsedDate)?'':moment(parsedDate).format(this._Configuration.formatDateTS);
	}
}