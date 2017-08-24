import { Component, ViewChild, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../../shared';
import { MExpenseItemService } from '../../../../services';
import { TRequestTransportSpec } from '../../../../models'; 

declare let $: any;
declare let window: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'payment-transport',
	templateUrl: './payment-transport-list.component.html',
	providers: [ MExpenseItemService ]
})

export class PaymentTransportListComponent implements AfterViewInit{
	@Input() currency_symbol: string;
	@Input('transport') transportArray: Array<any> = [];
	@Output('amount') amountOutput = new EventEmitter();
	@Output('transport') transportOutput = new EventEmitter();
	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modaldelete') modaldelete: ModalComponent;
	Item = new TRequestTransportSpec();
	expenseItemOption: Array<any> = [];
	expenseItems: Array<any> = [];
	action: string;
	receipt_label: string;
	display_arrival_departure: boolean = true;
	update_index: number;
	delete_index: number;

	constructor(
		private _Configuration: Configuration,
		private _MExpenseItemService: MExpenseItemService,
		private _ToastrService: ToastrService,
	){ }

	ngOnInit(){
		/*=============== Get expense item options ===============*/
		let params: URLSearchParams = new URLSearchParams();
		params.set('type_code','01');
		params.set('item_status','active');
		params.set('enable_flg','1');
		this.expenseItemOption.push({ id: this.Item['m_expense_item_id'], text: null });
		this._MExpenseItemService.getAll(params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var options = [];
					for (let key in res.data) {
						options.push({ id: res.data[key].id, text: res.data[key].item });
					}
					this.expenseItemOption = options;
					this.expenseItems = res.data;
				}
			}
		});
	}

	ngAfterViewInit(){
		let self = this,
			Configuration = this._Configuration;

		$('.daterange-single').datetimepicker({
			locale: 'ja',
			format: Configuration.formatDate,
		});

  		//cleave number format
  		applyCleaveJs();
	}

	//set receipt label, receipt_flg
	onNgSelected(e){
		this.Item.m_expense_item_id = e.id;
		this.expenseItems.forEach(item => {
			if(e.id == item.id){
				this.receipt_label = (item.receipt_flg==1)?'要':'不要';
				this.Item.receipt_flg = item.receipt_flg;
				this.display_arrival_departure = (item.arrival_departure_display_flg == 1)
				if(!this.display_arrival_departure){
					this.Item.arrival_point = null;
					this.Item.departure_point = null;
				}
			}
		});
	}

	onNgRemoved(e){
		this.Item.m_expense_item_id = null;
		this.receipt_label = '';
		this.display_arrival_departure = true;
	}

	//modal transport
	onOpenFormTransport(i = null,action: string){
		let obj: any;
		this.Item.m_expense_item_id = null;

		if(i==null){
			obj = new TRequestTransportSpec();
		}else{
			this.update_index = i;
			obj = this.transportArray[this.update_index];
			this.receipt_label = (obj.receipt_flg==1)?'要':'不要';
			this.expenseItems.forEach(item => {
				if(item.id == obj.m_expense_item_id){
					this.display_arrival_departure = (item.arrival_departure_display_flg == 1);
					return;
				}
			});
		}

		setTimeout(() => {
			this.Item = Object.assign({},obj);
		}, 200);

		this.action = action;
		this.modal.open();
	}

	/*=================================
	 * Detect on modal close
	 * Reset data if without save
	 *=================================*/
	onCloseForm(form: NgForm){
		let clone: Array<any> = [];
		if(this.action=='update'){
			clone = JSON.parse(JSON.stringify(this.transportArray));
		}
		form.reset();
		if(clone.length){
			this.transportArray = clone;
		}
		this.receipt_label = '';
		this.display_arrival_departure = true;
		this.modal.close();
	}

	onSubmit(form: NgForm){
		if(form.valid){
			//clone item
			let obj = Object.assign({}, this.Item);
			//save item
			if(this.action=='create'){
				this.transportArray.push(obj);
				form.reset();
				this.Item = new TRequestTransportSpec();
				this.receipt_label = '';
				this.display_arrival_departure = true;
			}else{
				this.transportArray.splice(this.update_index,1,obj);
			}
			//calculate amount transportation_spect_fee
			this.calculate();
			//display toaster
			this._ToastrService.success('登録しました。');
		}
	}

	//calculate transportation amount
	private calculate(){
		let fee: string;
		let amount: number = 0;
		this.transportArray.forEach(item => {
			fee = item.transportation_spec_fee.toString().replace(/,/g,'');
			amount += parseFloat(fee);
		});
		this.amountOutput.emit(amount);
		this.transportOutput.emit(this.transportArray);
	}

	onReferLink(){
		let url: string = 'https://www.navitime.co.jp/transfer/';
		if(this.Item.departure_point && this.Item.arrival_point){
			url += 'searchlist?orvStationName=' + this.Item.departure_point + '&dnvStationName=' + this.Item.arrival_point;
		}
		window.open(url, '_blank');
	}

	onOpenConfirm(index: number){
		this.delete_index = index;
		this.modaldelete.open('sm');
	}

	onConfirmDelete(){
		this.transportArray.splice(this.delete_index, 1);
		this.calculate();
		this.modaldelete.close();
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
		this.modaldelete.ngOnDestroy();
	}
}
