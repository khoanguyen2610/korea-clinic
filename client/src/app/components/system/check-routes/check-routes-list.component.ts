import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Configuration } from '../../../shared';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';

import { MMenuService, MDepartmentService, ApprovalRoutesService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-system-check-routes-list',
	templateUrl: './check-routes-list.component.html',
	providers: [MMenuService, MDepartmentService, ApprovalRoutesService]
})
export class CheckRoutesListComponent implements OnInit {
	private subscription: Subscription;
	menuOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	dataRoutes: Array<any> = [];
	filter = {};
	current_date: string = '';
	constructor(private _Configuration: Configuration, 
		private _MMenuService: MMenuService,
		private _MDepartmentService: MDepartmentService,
		private _ApprovalRoutesService: ApprovalRoutesService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	) { 
		this.current_date = moment().format(_Configuration.formatDateTS);

		this.subscription = this._ActivatedRoute.queryParams.subscribe((params: any) => {
            for(let k in params){
		 		this.filter[k] = params[k];
		 	}
        })

		/*==============================================
		 * Get List menu master 0.2 & 0.4
		 *==============================================*/
		this.menuOptions = [{ id: this.filter['m_menu_id'], text: null }];
 		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('item_status', 'active');	
		this._MMenuService.getAllMenuMaster(paramData).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key]._id, text: res.data[key].name };
						options.push(obj);
					}
					this.menuOptions = options;
				}
			}
		});

		// Get list department
		this.departmentOptions = [{ id: this.filter['m_department_id'], text: null }];
		let params: URLSearchParams = new URLSearchParams();
		params.set('level', '3');
		params.set('item_status', 'active');
		params.set('has_department_show_code', '1');

		this._MDepartmentService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				var options = [];
				for (let key in res.data) {
					let obj = { id: res.data[key].id, text: res.data[key].department_name_has_code };
					options.push(obj);
				}
				this.departmentOptions = options;	
			}
		});
	}

	ngOnInit(){
		this.getMasterRoutes();
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e, area){
		// Set value of select 2 to ngModel
		switch (area) {
			case "menu":
				this.filter['m_menu_id'] = e.id;
				break;
			case "department":
				this.filter['m_department_id'] = e.id;
				break;
		}
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e, area){
		// Reset value of select 2 to ngModel
		switch (area) {
			case "menu":
				this.filter['m_menu_id'] = null;
				break;
			case "department":
				this.filter['m_department_id'] = null;
				break;
		}
	}

	/*====================================
	 * Search Filter
	 *====================================*/
	onSearch() {
		this.getMasterRoutes();
		// Change URL when submit
		this._Router.navigate(['/system/check-routes'], { queryParams: this.filter });
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {};
		this.onSearch();
	}

	getMasterRoutes(){
		var objMenu = [];
		var select_m_menu_id = "";
		if(this.filter['m_menu_id']){
			if(typeof this.filter['m_menu_id'] == 'object' && this.filter['m_menu_id'].length > 0){
				select_m_menu_id = this.filter['m_menu_id'][0];
			}else{
				select_m_menu_id = this.filter['m_menu_id'];
			}
			select_m_menu_id = String(select_m_menu_id);
			objMenu = select_m_menu_id.split("_");
		}
		/*==============================================
		 * Get List master routes
		 *==============================================*/
 		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('menu_type', objMenu[0]);
		paramData.set('m_menu_id', objMenu[1]);
		paramData.set('m_department_id', this.filter['m_department_id']);	
		paramData.set('system_check', '1');	
		this._ApprovalRoutesService.getMasterRoutes(paramData).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					this.dataRoutes = res.data;
				}
			}
		});
		
	}



	ngAfterViewInit(){
		
	}

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
