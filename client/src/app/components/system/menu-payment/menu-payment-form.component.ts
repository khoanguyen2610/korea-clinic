import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Configuration } from '../../../shared';
import { URLSearchParams } from '@angular/http';
import { MRequestMenuService, MPositionService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MRequestMenu } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';

declare let $: any;


@Component({
	selector: 'app-system-menu-payment-form',
	templateUrl: './menu-payment-form.component.html',
	providers: [MRequestMenuService, MPositionService]
})
export class MenuPaymentFormComponent implements OnInit {
	private subscription: Subscription;

	_params: any;
	objStatus = [
		{value: 0, label: '無効'},
		{value: 1, label: '有効'}
	];
	limitPositionOpts?: Array<any> = [];
	Item = new MRequestMenu();
	constructor(private _Router: Router, private _ActivatedRoute: ActivatedRoute, 
				private _MRequestMenuService: MRequestMenuService,
				private _MPositionService: MPositionService, 
				private _ToastrService: ToastrService,
				private _Configuration: Configuration) { 
		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		)
	}

	ngOnInit() {
		/*=================================
		 * Get Limit Position Approval Form
		 *=================================*/
		let self = this;
	 	var myArray = [];
		this._MPositionService.getLimitApprovalForm().subscribe(res => {
			if (res.status == 'success') {
				for(let key in res.data){
					let obj = {id: res.data[key].id, text: res.data[key].name};
					myArray.push(obj);
				}
				this.limitPositionOpts = myArray;
			}
		})


		/*=================================
		 * Get Item Data 
		 * method: update & :id not null
		 *=================================*/
		switch (this._params.method) {
			case "update":
				if(this._params.id != null){
					this._MRequestMenuService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							setTimeout(function(){
								self.Item = res.data;
							}, 200)
							if(res.data == null){
								this._Router.navigate(['/system/menu-payment']);
							}
						}else{
							this._Router.navigate(['/system/menu-payment']);
						}
					});
				}
				break;
			case "create":
				this._Router.navigate(['/system/menu-payment']);
				break;
			default:
				this._Router.navigate(['/system/menu-payment']);
				break;
		}
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e){
		// Set value of select 2 to ngModel
		this.Item['limit_m_position_id'] = e.id;
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e){
		// Reset value of select 2 to ngModel
		this.Item['limit_m_position_id'] = null;
	}

	/*======================================
	 * Submit for - call API save data
	 *======================================*/
	onSubmit(form: NgForm) { 
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('code', this.Item['code']);
			paramData.set('name', this.Item['name']);
			paramData.set('description', this.Item['description']);
			paramData.set('limit_m_position_id', this.Item['limit_m_position_id']);
			paramData.set('enable_flg', this.Item['enable_flg']);

			if(this._params.method == 'update'){
				paramData.set('id', this.Item['id']);
				this._MRequestMenuService.save(paramData, this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
					}
				});
			}else if(this._params.method == 'create'){
				this._MRequestMenuService.save(paramData).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
					}
				});
			}
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}


}
