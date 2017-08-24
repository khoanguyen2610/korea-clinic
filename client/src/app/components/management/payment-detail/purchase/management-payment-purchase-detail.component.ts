import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

declare let $: any;

@Component({
	selector: 'management-payment-purchase-detail',
	templateUrl: './management-payment-purchase-detail.component.html',
})

export class ManagementPaymentPurchaseDetailComponent implements AfterViewInit{
	@Input() currency_symbol: any;
	@Input() modify: boolean;
	@Input('purchase') purchaseArray: Array<any> = [];
	@Output('amount') amountOutput = new EventEmitter();
	@Output('purchase') purchaseOutput = new EventEmitter();

	ngAfterViewInit(){ }

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