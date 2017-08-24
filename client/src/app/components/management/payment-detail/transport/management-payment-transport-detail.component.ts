import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Configuration } from '../../../../shared';
import { MExpenseItemService } from '../../../../services';

declare let $: any;

@Component({
	selector: 'management-payment-transport-detail',
	templateUrl: './management-payment-transport-detail.component.html',
	providers: [ MExpenseItemService ]
})

export class ManagementPaymentTransportDetailComponent implements OnInit{
	@Input('transport') transportArray: Array<any> = [];
	@Input() currency_symbol: any;
	@Input() modify: boolean;
	@Output('amount') amountOutput = new EventEmitter();
	@Output('transport') transportOutput = new EventEmitter();
	expenseItemOption: Array<any> = [];
	expenseItem: Array<any> = [];

	constructor(
		private _Configuration: Configuration,
		private _MExpenseItemService: MExpenseItemService
	){ }

	ngOnInit(){
		/*=============== Get expense item options ===============*/
		let expense_item_params: URLSearchParams = new URLSearchParams();
		expense_item_params.set('type_code','01');
		expense_item_params.set('item_status','active');
		this.expenseItemOption.push({ value: '', 'label': null });
		this._MExpenseItemService.getAll(expense_item_params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var options = [];
                    for (let key in res.data) {
                        let obj = { value: res.data[key].id, label: res.data[key].item };
                        options.push(obj);
                    }
                    this.expenseItemOption = options;
                    this.expenseItem = res.data;
				}
			}
		});
	}

	//update receipt_flg when keiri change m_expense_item value
	onChangeExpense(obj, value: string){
		this.expenseItem.forEach(item => {
			if(value==item.id){
				obj.receipt_flg = item.receipt_flg;
			}
		});
		this.transportOutput.emit(this.transportArray);
	}

	onSetFee(obj, value: number){
		obj.cor_transportation_spec_fee = value || 0;
		this.calculate();
	}

	//calculate transportation amount
	private calculate(){
		let fee: string;
		let amount: number = 0;
		this.transportArray.forEach(item => {
			fee = item.cor_transportation_spec_fee.toString().replace(/,/g,'');
			amount += parseFloat(fee);
		});
		this.amountOutput.emit(amount);
		this.transportOutput.emit(this.transportArray);
	}
}