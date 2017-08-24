import { Component, Input } from '@angular/core';

@Component({
	selector: 'payment-purchase-detail',
	templateUrl: './payment-purchase-detail.component.html',
})

export class PaymentPurchaseDetailComponent{
	@Input() currency_symbol: any;
	@Input('purchase') purchaseArray: Array<any> = [];
}