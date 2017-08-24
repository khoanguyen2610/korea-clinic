import { Component, Input, OnChanges } from '@angular/core';

@Component({
	selector: 'payment-cost-detail',
	templateUrl: './payment-cost-detail.component.html',
})

export class PaymentCostDetailComponent implements OnChanges{
	@Input('cost') costArray: Array<any> = [];
	@Input() currency_symbol: any;
	cost_divide_amount: number = 0;

	ngOnChanges() {
		this.cost_divide_amount = 0;
		if(this.costArray.length){
			this.costArray.forEach(item => {
				this.cost_divide_amount += parseFloat(item.divide_cost);
			})
		}
	}
}
