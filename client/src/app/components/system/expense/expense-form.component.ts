import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { ToastrService } from 'ngx-toastr';
import { Configuration } from '../../../shared';
import { MExpenseItemService } from '../../../services';
import { MExpenseItem, MObicKashi } from '../../../models';
import { BreadcrumbComponent } from '../../general';

@Component({
	selector: 'app-manage-list',
	templateUrl: './expense-form.component.html',
	providers: [ MExpenseItemService ]
})
export class ExpenseFormComponent implements OnInit {
	private subscription: Subscription;
	_params: any;
	validateErrors: Array<any> = [];
	
	Item = new MExpenseItem();
	ItemK01 = new MObicKashi();
	ItemK90 = new MObicKashi();

	public expense_type_code = [
		{'value':'01','label':'交通機関種別'},
		{'value':'02','label':'購入種別'},
		{'value':'04','label':'出張その他'},
		{'value':'05','label':'飲食種別(社内)'},
		{'value':'06','label':'飲食種別(社外)'},
	];

	public enable_flg = [
		{'value':'0','label':'無'},
		{'value':'1','label':'有'},
	];

	public receipt_flg = [
		{'value':'0','label':'不要'},
		{'value':'1','label':'要'},
	];

	public arrival_departure_display_flg = [
		{'value':'1','label':'表示'},
		{'value':'0','label':'非表示'},
	];

	constructor(
		private _MExpenseItemService: MExpenseItemService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	) { }

	ngOnInit(){
		//=============== Get Params On Url ===============
		this.subscription = this._ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);
		
		switch(this._params.method){
			case 'create':
				this.subscription = this._ActivatedRoute.queryParams.subscribe((params:any) => {
					this.Item.type_code = params.type_code;
				});
				this.Item.enable_flg = 1;
				this.Item.receipt_flg = 0;
				this.Item.arrival_departure_display_flg = 1;
				break;
			case 'update':
				let failed = true;
				if(this._params.id != null){
					failed = false;
					this._MExpenseItemService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							this.Item = res.data;
							this.ItemK01 = this.Item['obic_kashi'][0];
							this.ItemK90 = this.Item['obic_kashi'][1];
							if(res.data == null){
								failed = true;
							}
						}else{
							failed = true;
						}
					});
				}
				if(failed){
					this._Router.navigate(['/system/expense']);
				}
				break;
			default:
				this._Router.navigate(['/system/expense']);
				break;
		}
	}

	onSubmit(form: NgForm){
		if(form.valid){
			this.Item['obic_kashi'] = [this.ItemK01, this.ItemK90];
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('type_code', this.Item['type_code']);
			paramData.set('item_name_code', this.Item['item_name_code']);
			paramData.set('item', this.Item['item']);
			paramData.set('item_e', this.Item['item_e']);
			paramData.set('obic_sokanjo_cd', this.Item['obic_sokanjo_cd']);
			paramData.set('obic_hojo_cd', this.Item['obic_hojo_cd']);
			paramData.set('obic_hojouchiwake_cd', this.Item['obic_hojouchiwake_cd']);
			paramData.set('tax_io', this.Item['tax_io']);
			paramData.set('enable_flg', this.Item['enable_flg']);
			paramData.set('receipt_flg', this.Item['receipt_flg']);
			paramData.set('arrival_departure_display_flg', this.Item['arrival_departure_display_flg']);
			paramData.set('obic_kashi', JSON.stringify(this.Item['obic_kashi']));
			if(this._params.method=='update'){
				paramData.set('id', this.Item['id'].toString());
				this._MExpenseItemService.save(paramData, this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
					}else if(res.status == 'error'){
						this.validateErrors = res.error;
					}
				});	

			}else{
				this._MExpenseItemService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						//reset form
						form.reset();
						this.validateErrors = [];
						this._ToastrService.success('情報を登録しました。');
					}else if(res.status == 'error'){
						this.validateErrors = res.error;
					}
				})
			}
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}
}