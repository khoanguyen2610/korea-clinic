import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

declare let $: any;

@Component({
	selector: 'management-payment-cost-detail',
	templateUrl: './management-payment-cost-detail.component.html',
})

export class ManagementPaymentCostDetailComponent implements AfterViewInit{
	@Input() currency_symbol: string;
	@Input() modify: boolean;
	@Input('cost') costArray: Array<any> = [];
	@Output('cost') costOutput = new EventEmitter();
	cleaveOptions = {
		numeral: true,
		numeralPositiveOnly: true
	};

	ngAfterViewInit(){ }

	onSetFee(obj, value: number){
		obj.cor_divide_cost = value || 0;
		this.costOutput.emit(this.costArray);
	}
}