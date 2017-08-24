import { Component, Input, OnInit } from '@angular/core';
import { MExpenseItemService } from '../../../../services';
import { URLSearchParams } from '@angular/http';

@Component({
	selector: 'payment-transport-detail',
	templateUrl: './payment-transport-detail.component.html',
	providers: [ MExpenseItemService ]
})

export class PaymentTransportDetailComponent implements OnInit{
	@Input('transport') transportArray: Array<any> = [];
	@Input() currency_symbol: any;
	expenseItemOption: Array<any> = [];

	constructor(
		private _MExpenseItemService: MExpenseItemService
	){}

	ngOnInit(){
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
	}
}