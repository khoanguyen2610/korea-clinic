import { Component, Input, OnInit } from '@angular/core';
import { MExpenseItemService } from '../../../../services';

@Component({
	selector: 'payment-dietary-detail',
	templateUrl: './payment-dietary-detail.component.html',
	providers: [ MExpenseItemService ]
})

export class PaymentDietaryDetailComponent implements OnInit{
	@Input() currency_symbol: any;
	@Input() item: any;
	@Input('purchase') purchaseArray: Array<any> = [];
	@Input() m_request_menu_id: number;
	expense_item: string;

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
}