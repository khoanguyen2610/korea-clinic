import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MExpenseItemService } from '../../../../services';

declare let $: any;

@Component({
	selector: 'management-payment-dietary-detail',
	templateUrl: './management-payment-dietary-detail.component.html',
	providers: [ MExpenseItemService ]
})

export class ManagementPaymentDietaryDetailComponent implements OnInit{
	@Input() currency_symbol: any;
	@Input() item: any;
	@Input() modify: boolean;
	@Input() m_request_menu_id: number;
	@Input('purchase') purchaseArray: Array<any> = [];
	@Output('amount') amountOutput = new EventEmitter();
	@Output('purchase') purchaseOutput = new EventEmitter();
	expense_item: string;
	cleaveOptions = {
		numeral: true,
		numeralPositiveOnly: true
	};

	constructor(
		private _MExpenseItemService: MExpenseItemService
	){}

	ngOnInit(){
		let id: number = this.item.m_expense_item_id;
		this._MExpenseItemService.getByID(id).subscribe(res => {
			if(res.status=='success'){
				this.expense_item = res.data.item
			}
		})
	}

	onSetFee(obj, value: number){
		obj.cor_payments = value || 0;
		this.calculate();
	}

	private calculate(){
		let fee: string;
		let amount: number = 0;
		this.purchaseArray.forEach(item => {
			fee = item.cor_payments.toString().replace(/,/g,'');
			amount += parseFloat(fee);
		});
		this.amountOutput.emit(amount);
		this.purchaseOutput.emit(this.purchaseArray);
	}
}