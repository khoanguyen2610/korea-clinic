import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Configuration } from '../../../shared';
import { URLSearchParams } from '@angular/http';
import { MDepartmentService, MCompanyService, MObicClientService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MDepartment } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';

declare let $: any;


@Component({
	selector: 'app-system-department-form',
	templateUrl: './department-form.component.html',
	providers: [MDepartmentService, MCompanyService, MObicClientService]
})
export class DepartmentFormComponent implements OnInit {
	private subscription: Subscription;

	_params: any;
	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	obicClientOptions: Array<any> = [];
	departmentAutocomplete: Array<any> = [];
	flag_obic_client = false;

	Item: MDepartment[] = [];
	constructor(private _Router: Router, private _ActivatedRoute: ActivatedRoute, 
				private _MDepartmentService: MDepartmentService,
				private _MCompanyService: MCompanyService, 
				private _MObicClientService: MObicClientService, 
				private _ToastrService: ToastrService,
				private _Configuration: Configuration) { 
		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		)

	}

	ngOnInit() {
		let self = this;
		/*==============================================
		 * Get List Company
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MCompanyService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].id, text: res.data[key].name };
						options.push(obj);
					}
					this.companyOptions = options;
				}
			}
		});
		/*==============================================
		 * Get List Obic Client
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		this._MObicClientService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].client_code, text: res.data[key].client_name };
						options.push(obj);
					}
					this.obicClientOptions = options;
				}
			}
		});

		/*=================================
		 * Get Item Data 
		 * method: update & :id not null
		 *=================================*/
		switch (this._params.method) {
			case "update":
				if(this._params.id != null){
					this._MDepartmentService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							if(res.data.level == 3){
								res.data['division_id'] = res.data.parent;	
								this.divisionOptions = [{ id: res.data['division_id'], text: null }];
							} 
							if(res.data.level == 2){
								res.data['business_id'] = res.data.parent;	
								this.businessOptions = [{ id: res.data['business_id'], text: null }];
							} 

							if(res.data.client_code) this.flag_obic_client = true;

							self.getDepartmentOption(res.data);
							setTimeout(() => {
								self.Item = res.data;
							}, 300)
							if(res.data == null){
								this._Router.navigate(['/system/department']);
							}
						}else{
							this._Router.navigate(['/system/department']);
						}
					});
				}
				break;
			case "create":
				this.Item['level'] = 1;
				self.getDepartmentOption(self.Item);
				break;
			default:
				this._Router.navigate(['/system/department']);
				break;
		}
		
	}

	onSelectFilterChange(event, area?:string, type?: string){
		switch (area) {
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
					this.Item['department_id'] = null;
				}
				break;
		}

		if(!type) {
			let key_id = 'm_company_id';
			if (area != 'company') {
				key_id = area + '_id';
			}
			this.Item[key_id] = event.id;
		}
		this.getDepartmentOption(this.Item);
	}

	getDepartmentOption(request, area?:string){
		let self = this;
		/*==============================================
		 * Get Department (Business - Division - Department)
		 *==============================================*/
		var params: URLSearchParams = new URLSearchParams();
		params.set('item_status', 'active');
		params.set('m_company_id', request['m_company_id']);
		params.set('business_id', request['business_id']);
		params.set('division_id', request['division_id']);

		if(request['division_id']){
			this._MDepartmentService.getAutocompleteDepartment(params).subscribe(res => {
				if (res.status == 'success') {
					if(res.data.options != null){
						for (let key in res.data.options) {
							switch (key) {
								case "department":
									this.departmentAutocomplete = res.data.options[key];
									break;
							}
						}
						
					}
				}
			});
		}


		this.divisionOptions = [{ id: request['division_id'], text: null }];
		this.businessOptions = [{ id: request['business_id'], text: null }];
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
						}
					}
					
				}

				setTimeout(function(){
					if(res.data.m_company_id) self.Item['m_company_id'] = res.data.m_company_id;
					if(res.data.business_id) self.Item['business_id'] = res.data.business_id;
					if(res.data.division_id) self.Item['division_id'] = res.data.division_id;
				}, 500);
			}
		});
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e, area){
		// Set value of select 2 to ngModel
		switch (area) {
			case "obic_client":
				this.Item['client_code'] = e.id;
				break;
		}
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e, area){
		// Reset value of select 2 to ngModel
		switch (area) {
			case "obic_client":
				this.Item['client_code'] = null;
				break;
		}
	}  

	onSubmit(form: NgForm) { 
		let self = this;
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('m_company_id', this.Item['m_company_id']);
			paramData.set('business_id', this.Item['business_id']);
			paramData.set('division_id', this.Item['division_id']);
			paramData.set('level', this.Item['level']);
			paramData.set('code', this.Item['code']);
			paramData.set('name', this.Item['name']);
			paramData.set('allow_export_routes', this.Item['allow_export_routes']);
			paramData.set('client_code', this.Item['client_code']);
			paramData.set('enable_start_date', this.Item['enable_start_date']);
			paramData.set('enable_end_date', this.Item['enable_end_date']);

			if(this._params.method == 'update'){
				paramData.set('id', this.Item['id']);
				this._MDepartmentService.save(paramData, this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
					}
				});
			}else if(this._params.method == 'create'){
				this._MDepartmentService.save(paramData).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
						form.reset();
						this.Item['level'] = 1;
						this.Item['code'] = null;
						this.Item['m_company_id'] = null;
						this.Item['business_id'] = null;
						this.Item['division_id'] = null;
					}
				});
			}
			// this.getDepartmentOption(this.Item);
		}
	}

	/*==================================
	 * Function process when user check checkbox obic client
	 *==================================*/
	onChangeObicFlag(elem){
		this.flag_obic_client = elem.checked;
		if(!elem.checked){
			this.Item['client_code'] = null;
		}
	}
	
	/*==================================
	 * Function process when user typing autocomplete
	 *==================================*/
	onChangeCodeDepartment(event){
		if(event && typeof event === 'object'){
			this.Item['code'] = event.code;
		}

		if(event && typeof event === 'string'){
			this.Item['code'] = event;
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}


}
