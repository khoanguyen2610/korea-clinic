import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { MExpenseItemService, MTripAreaService } from '../../../../services';
import { URLSearchParams } from '@angular/http';

@Component({
	selector: 'payment-pre-travel-detail',
	templateUrl: './payment-pre-travel-detail.component.html',
	providers: [ MExpenseItemService, MTripAreaService ]
})

export class PaymentPreTravelDetailComponent implements OnInit{
	@Input() item: any;
	@Input() currency_symbol: any;
	expenseItemOption: Array<any> = [];
	trip_area_name: string;

	constructor(
		private _MExpenseItemService: MExpenseItemService,
		private _MTripAreaService: MTripAreaService,
	){}

	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if(this.item.m_trip_area_id){
			this.initData(this.item.m_trip_area_id);
		}
	}

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

	initData(trip_area_id: number){
		this._MTripAreaService.getByID(trip_area_id).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					this.trip_area_name = res.data.name;
				}
			}
		});
	}
}
