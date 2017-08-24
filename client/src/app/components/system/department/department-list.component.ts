import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { MDepartmentService, MCompanyService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-system-department-list',
	templateUrl: './department-list.component.html',
	providers: [MDepartmentService, MCompanyService]
})
export class DepartmentListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;

	companyOptions: Array<any> = [];
	businessOptions: Array<any> = [];
	divisionOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	filter = {};
	_param = {};

	constructor(private _Router: Router, 
		private _Configuration: Configuration, 
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _ActivatedRoute: ActivatedRoute
	) { 
		let self = this;
		// subscribe to router event
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this._param = param;
		});

		/*==============================================
		 * Set param after search submit
		 *==============================================*/
		setTimeout(function(){
			if(self._param['m_company_id']) self.filter['m_company_id'] = self._param['m_company_id'];
			if(self._param['business_id']) self.filter['business_id'] = self._param['business_id'];
			if(self._param['division_id']) self.filter['division_id'] = self._param['division_id'];
			if(self._param['department_id']) self.filter['department_id'] = self._param['department_id'];
			if(self._param['enable_start_date']) self.filter['enable_start_date'] = self._param['enable_start_date'];
			if(self._param['enable_end_date']) self.filter['enable_end_date'] = self._param['enable_end_date'];
		}, 500);

	}

	ngOnInit(){
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
		 * Get Department (Business - Division - Department)
		 *==============================================*/
	 	this.getDepartmentOption(this._param);
	}

	/*==============================================
	 * Reload data when change select
	 *==============================================*/
	onSelectFilterChange(event, area?:string, type?: string){
		switch (area) {
			case "company":
				if(type == 'deselected'){
					this.filter['m_company_id'] = null;
				}else{
					this.filter['business_id'] = null;
				}
			case "business":
				if(type == 'deselected'){
					this.filter['business_id'] = null;
				}else{
					this.filter['division_id'] = null;
				}
			case "division":
				if(type == 'deselected'){
					this.filter['division_id'] = null;
				}else{
					this.filter['department_id'] = null;
				}
			case "department":
				if(type == 'deselected'){
					this.filter['department_id'] = null;
				}
				break;
		}

		if(!type) {
			let key_id = 'm_company_id';
			if (area != 'company') {
				key_id = area + '_id';
			}
			this.filter[key_id] = event.id;
		}

		this.getDepartmentOption(this.filter);
	}

	/*=======================================
	 * Get List Options Department
	 *=======================================*/
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
		params.set('department_id', request['department_id']);
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
					if(res.data.m_company_id) self.filter['m_company_id'] = res.data.m_company_id;
					if(res.data.business_id) self.filter['business_id'] = res.data.business_id;
					if(res.data.division_id) self.filter['division_id'] = res.data.division_id;
					if(res.data.department_id) self.filter['department_id'] = res.data.department_id;
				}, 500);
			}
		});
	}


	/*====================================
	 * Search Filter
	 *====================================*/
	onSearch() {
		
		// Reload Datatable
		let _list_data_URL = this._MDepartmentService._list_data_URL + '?' + $.param(this.filter);
		this.DTList.ajax.url(_list_data_URL).load();

		// Change URL when submit
		this._Router.navigate(['/system/department'], { queryParams: this.filter });
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {};
		this.getDepartmentOption(this.filter);
		this.onSearch();
	}

	onRoutingUpdate(id: number){
		this._Router.navigate(['/system/department/update/', id]);
	}


	ngAfterViewInit(){
		let self = this,
			_list_data_URL = this._MDepartmentService._list_data_URL,
			Configuration = this._Configuration;;
		this.DTList = $('#tbl-data').DataTable({
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
			    'url': _list_data_URL,
			    'type': 'GET',
			    'beforeSend': function (request) {
			        request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
			    },
			    xhrFields: {
		            withCredentials: true
		        }
			},
			columns: [
				{ 'data': 'business_code', 'class': 'text-center' },
				{ 'data': 'business_name_dtb_output' },
				{ 'data': 'division_code', 'class': 'text-center' },
				{ 'data': 'division_name_dtb_output' },
				{ 'data': 'code', 'class': 'text-center' },
				{ 'data': 'name_dtb_output' },
				{ 'data': 'sub_code', 'class': 'text-center' },
				{ 'data': 'allow_export_routes', 'class': 'text-center' },
				{ 'data': 'enable_start_date' },
				{ 'data': 'enable_end_date' }
			],
			columnDefs: [
				{	
					className: 'text-center',
					render: function(data, type, full){
						if(data == 1) return "有";
						if(data == 0) return "無";
					},
					targets: [7],
				},
				{	
					className: 'text-center',
					render: function(data, type, full){
						var parsedDate = Date.parse(data);
					   	if(isNaN(parsedDate)){
					   		return "";
					   	}else{
							return moment(parsedDate).format(Configuration.formatDateTS);
					   	}
					},
					targets: [8, 9],
				},
			],
			order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) {
				
			}
		});
		$('#tbl-data tbody').on( 'click', '#btn_edit', function () {
			let id: number = $(this).data('id');
			self.onRoutingUpdate(id);
			return false;
	    });
	}
}
