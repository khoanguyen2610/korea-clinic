import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, AfterViewInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../../shared';
import { MCompanyService, MDepartmentService } from '../../../../services';
import { TCostDivide } from '../../../../models';

@Component({
	selector: 'payment-cost',
	templateUrl: './payment-cost-list.component.html',
	providers: [ MCompanyService, MDepartmentService ]
})

export class PaymentCostListComponent implements AfterViewInit{
	@Input() amount: number;
	@Input() currency_symbol: string;
	@Input() m_request_menu_id: number;
	@Input('cost') costInput: Array<any> = [];
	@Output('cost') costOutput = new EventEmitter();
	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modaldelete') modaldelete: ModalComponent;
	Item = new TCostDivide();
	costArray: Array<any> = [];
	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	errorMsg: Array<any> = [];
	current_cost: number = 0;
	cost_divide_amount: number = 0;
	cost_invalid: boolean = false; 
	cost_remain: number = 0;
	action: string;
	update_index: number;
	delete_index: number;
	decimal: any;

	constructor(
		private _Configuration: Configuration,
		private _MCompanyService: MCompanyService,
		private _MDepartmentService: MDepartmentService,
		private _ToastrService: ToastrService,
	){
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
	}
	
	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		for(let propName in changes){
			//if action is create, reset divide cost array when user change request menu 
			if(propName == 'm_request_menu_id'){
				this.costArray = [];
				this.calculate();
			}
			if(propName == 'costInput'){
				this.costArray = this.costInput;
				this.calculate();	
			}
		}
	}

	ngAfterViewInit(){ }

	//open modal cost form
	onOpenFormCost(i = null, action: string){
		let obj = new TCostDivide();

		if(i!=null){
			this.update_index = i;
			obj = this.costArray[this.update_index];
			this.current_cost = +obj.divide_cost.toString().replace(/,/g,'');
		}

		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCompanyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						options.push({ id: res.data[key].id, text: res.data[key].name });
					}
					this.companyOptions = options;
				}
			}
		});

		this.getDepartmentOption(obj);
		this.action = action;
		this.cost_remain = this.amount - this.cost_divide_amount;
		this.Item = Object.assign({},obj);

		this.modal.open();
	}

	onCloseForm(form: NgForm){
		let clone: Array<any> = [];
		if(this.action=='update'){
			clone = JSON.parse(JSON.stringify(this.costArray));
		}
		this.cost_invalid = false;
		form.reset();
		if(clone.length){
			this.costArray = clone;
		}
		this.modal.close();
	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectDepartmentChange(event, area?:string, type?: string){
		switch(area){
			case "company":
				if(type == 'deselected'){
					this.Item['m_company_id'] = null;
				}else{
					this.Item['business_id'] = null;
				}
			case "business":
				if(type == 'deselected'){
					this.Item['business_id'] = null;
				}else{
					this.Item['division_id'] = null;
				}
			case "division":
				if(type == 'deselected'){
					this.Item['division_id'] = null;
				}else{
					this.Item['m_department_id'] = null;
				}
			case "department":
				if(type == 'deselected'){
					this.Item['m_department_id'] = null;
				}
				break;
		}
		if (!type) {
			let key_id = '';
			switch (area) {
				case "company":
					key_id = 'm_company_id';
					break;

				case "department":
					key_id = 'm_department_id';
					break;

				default:
					key_id = area + '_id';
					break;
			}
			this.Item[key_id] = event.id;
		}
		this.getDepartmentOption(this.Item);
	}

	//validate divide cost
	checkDivideCost(value: string){
		if(value){
			let v: number = +value.replace(/,/g,'');
			if(v==0){
				this.cost_invalid = true;
				this.Item.divide_cost = v;
			}else{
				if(this.action=='create'){
					this.cost_invalid = (v > this.cost_remain);
				}else{
					let cost_remain: number = this.amount - (this.cost_divide_amount - this.current_cost);
					this.cost_invalid = (v > cost_remain);
				}
				this.Item.divide_cost = this.decimal.transform(v);	
			}
		}else{
			this.cost_invalid = false;
			this.Item.divide_cost = null;
		}
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
	getDepartmentOption(request, area?:string){
		let self = this;
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		this.businessOptions = [{ id: request['business_id'], text: null }];
		this.divisionOptions = [{ id: request['division_id'], text: null }];
		this.departmentOptions = [{ id: request['department_id'], text: null }];
		
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_company_id', request['m_company_id']);
		params.set('business_id', request['business_id']);
		params.set('division_id', request['division_id']);
		params.set('department_id', request['m_department_id']);
		this._MDepartmentService.getListOption(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data.options != null){
					for (let key in res.data.options) {
						switch (key) {
							case "business":
								this.businessOptions = res.data.options[key];
								break;
							case "division":
								this.divisionOptions = res.data.options[key];
								break;
							case "department":
								this.departmentOptions = res.data.options[key];
								break;
						}
					}

				}

				setTimeout(function(){
					if(res.data.m_company_id) self.Item['m_company_id'] = res.data.m_company_id;
					if(res.data.business_id) self.Item['business_id'] = res.data.business_id;
					if(res.data.division_id) self.Item['division_id'] = res.data.division_id;
					if(res.data.department_id) self.Item['m_department_id'] = res.data.department_id;
				}, 500);
			}
		});
	}

	onSubmit(form: NgForm){
		if(form.valid){
			this.departmentOptions.forEach(item => {
				if(item.id == this.Item.m_department_id){
					this.Item.department_name = item.text;
				}
			});

			//clone item
			let obj = Object.assign({}, this.Item);
			if(this.action=='create'){
				this.costArray.push(obj);
				form.reset();
				this.Item = new TCostDivide();
				this.getDepartmentOption(this.Item);
			}else{
				this.costArray.splice(this.update_index,1,obj);
			}
			this._ToastrService.success('登録しました。');
			this.calculate();
		}
	}

	//calculate cost divide amount
	private calculate(){
		let fee: string;
		let amount: number = 0;
		this.costArray.forEach(item => {
			fee = item.divide_cost.toString().replace(/,/g,'');
			amount += parseFloat(fee);
		});
		this.cost_divide_amount = amount;
		this.cost_remain = this.amount - this.cost_divide_amount;
		this.costOutput.emit(this.costArray);
	}

	onOpenConfirm(index: number){
		this.delete_index = index;
		this.modaldelete.open('sm');
	}

	onConfirmDelete(){
		this.costArray.splice(this.delete_index, 1);
		this.calculate();
		this.modaldelete.close();
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
		this.modaldelete.ngOnDestroy();
	}
}