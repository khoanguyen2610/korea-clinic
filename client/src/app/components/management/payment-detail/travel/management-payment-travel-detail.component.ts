import { Component, Input, Output, EventEmitter, OnInit, SimpleChange } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../shared';
import { TRequestService, MExpenseItemService, MTripAreaService } from '../../../../services';

declare let $: any;

@Component({
	selector: 'management-payment-travel-detail',
	templateUrl: './management-payment-travel-detail.component.html',
	providers: [ TRequestService, MExpenseItemService, MTripAreaService ]
})

export class ManagementPaymentTravelDetailComponent implements OnInit{
	@Input() item: any;
	@Input() currency_symbol: any;
	@Input() modify: boolean;
	@Output('amount') amountOutput = new EventEmitter();
	@Output('travel') travelOutput = new EventEmitter();
	decimal: any;
	expenseItemOption: Array<any> = [];
	withdrawalOption: Array<any> = [];
	otherArray: Array<any> = [];
	trip_area_name: string;

	constructor(
		private _Configuration: Configuration,
		private _MExpenseItemService: MExpenseItemService,
		private _MTripAreaService: MTripAreaService,
		private _TRequestService: TRequestService,
	){
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
	}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if(this.item.m_trip_area_id){
			this.initData(this.item.m_trip_area_id);
		}
	}

	ngOnInit(){
		this.otherArray = this.item.other;
		/*=============== Get expense item options ===============*/
		let expense_item_params: URLSearchParams = new URLSearchParams();
		expense_item_params.set('type_code','01');
		expense_item_params.set('item_status','active');
		this._MExpenseItemService.getAll(expense_item_params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var options = [];
                    for (let key in res.data) {
                        let obj = { value: res.data[key].id, label: res.data[key].item };
                        options.push(obj);
                    }
                    this.expenseItemOption = options;
				}
			}
		});
		/*=============== Get trip area options ===============*/
		let trip_area_id: number = this.item.m_trip_area_id;
		this._MTripAreaService.getByID(trip_area_id).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					this.trip_area_name = res.data.name;
				}
			}
		});
		/*=============== Get withdrawal options ===============*/
		this._TRequestService.getWithdrawalList().subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var item = [];
					for (let key in res.data) {
						let obj = { value: res.data[key].id, label: res.data[key].item };
                        item.push(obj);
                    }
                    this.withdrawalOption = item;
				}
			}
		});	
	}

	initData(trip_area_id: number){
		this._MTripAreaService.getByID(trip_area_id).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					this.trip_area_name = res.data.name;
				}
			}
		});
	}

	onSetFee(value, field, index?: number){
		if(field == 'cor_perdiem_fee'){
			this.item.cor_perdiem_fee = value || 0;	
		}
		if(field == 'cor_lodging_fee'){
			this.item.cor_lodging_fee = value || 0;
		}
		if(field == 'cor_payments'){
			this.otherArray[index].cor_payments = value || 0;
		}
		this.calculate();
	}

	private calculate(){
		let perdiem = this.item.cor_perdiem_fee.toString().replace(/,/g,'');
		let allowance = this.item.cor_lodging_fee.toString().replace(/,/g,'');
		let fee: string;
		let amount: number = 0;
		let other_fee: number = 0;
		this.otherArray.forEach(item => {
			if(!item.cor_payments){
				item.cor_payments = 0;
			}
			fee = item.cor_payments.toString().replace(/,/g,'');
			other_fee += parseFloat(fee);
		});
		amount = +perdiem + +allowance + other_fee;
		this.amountOutput.emit(amount);
		this.item.other = JSON.stringify(this.otherArray);
		this.travelOutput.emit(this.item);
	}
}
