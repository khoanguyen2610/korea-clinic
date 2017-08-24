import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { TRequestService, MExpenseItemService, MTripAreaService } from '../../../../services';
import { URLSearchParams } from '@angular/http';

@Component({
	selector: 'payment-travel-detail',
	templateUrl: './payment-travel-detail.component.html',
	providers: [ TRequestService, MExpenseItemService, MTripAreaService ]
})

export class PaymentTravelDetailComponent implements OnInit{
	@Input() item: any;
	@Input() currency_symbol: any;
	expenseItemOption: Array<any> = [];
	withdrawalOption: Array<any> = [];
	otherArray: Array<any> = [];
	trip_area_name: string;

	constructor(
		private _MExpenseItemService: MExpenseItemService,
		private _MTripAreaService: MTripAreaService,
		private _TRequestService: TRequestService,
	){}

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
}
