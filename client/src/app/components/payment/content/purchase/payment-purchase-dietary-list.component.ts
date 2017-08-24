import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../../shared';
import { TPurchaseReceptionSpec } from '../../../../models';

declare let $: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'payment-purchase-dietary',
	templateUrl: './payment-purchase-dietary-list.component.html',
})

export class PaymentPurchaseDietaryListComponent implements AfterViewInit{
	@Input() currency_symbol: string;
	@Input('purchase') purchaseArray: Array<any> = [];
	@Output('amount') amountOutput = new EventEmitter();
	@Output('purchase') purchaseOutput = new EventEmitter();
	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modaldelete') modaldelete: ModalComponent;
	Item = new TPurchaseReceptionSpec();
	amount = 0;
	action: string;
	update_index: number;
	delete_index: number;

	constructor(
		private _Configuration: Configuration,
		private _ToastrService: ToastrService,
	){ }

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

	//open modal purchase form
	onOpenFormPurchase(i = null, action: string){
		let obj: any;
		if(i==null){
			i = new TPurchaseReceptionSpec();
		}else{
			this.update_index = i;
			obj = this.purchaseArray[this.update_index];
		}
		this.Item = Object.assign({},obj);
		this.action = action;
		this.modal.open();
	}

	onCloseForm(form: NgForm){
		let clone: Array<any> = [];
		if(this.action=='update'){
			clone = JSON.parse(JSON.stringify(this.purchaseArray));
		}
		form.reset();
		if(clone.length){
			this.purchaseArray = clone;
		}
		this.modal.close();
	}

	onSubmit(form: NgForm){
		if(form.valid){
			//clone item
			let obj = Object.assign({}, this.Item);
			//save item
			if(this.action=='create'){
				this.purchaseArray.push(obj);
				form.reset();
				this.Item = new TPurchaseReceptionSpec();
			}else{
				this.purchaseArray.splice(this.update_index,1,obj);
			}
			//calculate amount payments
			this.calculate();
			//display toaster
			this._ToastrService.success('登録しました。');
		}
	}

	private calculate(){
		let fee: string;
		let amount: number = 0;
		this.purchaseArray.forEach(item => {
			fee = item.payments.toString().replace(/,/g,'');
			amount += parseFloat(fee);
		});
		this.amountOutput.emit(amount);
		this.purchaseOutput.emit(this.purchaseArray);
	}

	onOpenConfirm(index: number){
		this.delete_index = index;
		this.modaldelete.open('sm');
	}

	onConfirmDelete(){
		this.purchaseArray.splice(this.delete_index, 1);
		this.calculate();
		this.modaldelete.close();
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
		this.modaldelete.ngOnDestroy();
	}
}