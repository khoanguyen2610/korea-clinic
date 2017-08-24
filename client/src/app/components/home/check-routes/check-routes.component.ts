import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Configuration } from '../../../shared';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';

import { MMenuService, ApprovalRoutesService, AuthService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-home-check-routes',
	templateUrl: './check-routes.component.html',
	providers: [MMenuService, ApprovalRoutesService, AuthService]
})
export class CheckRoutesComponent implements OnInit {
	private subscription: Subscription;
	menuOptions: Array<any> = [];
	departmentOptions: Array<any> = [];
	dataRoutes: Array<any> = [];
	filter = {};
	current_user_info = {};
	concurrentUserDepartment?: Array<any>;

	constructor(private _Configuration: Configuration, 
		private _MMenuService: MMenuService,
		private _ApprovalRoutesService: ApprovalRoutesService,
		private _AuthService: AuthService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	) { 
		this.subscription = this._ActivatedRoute.queryParams.subscribe((params: any) => {
            for(let k in params){
		 		this.filter[k] = params[k];
		 	}
        })

        if (!this.filter['enable_date']) {
			this.filter['enable_date'] = moment().format(_Configuration.formatDateTS);
		}

        if (!this.filter['concurrent_post_flag']) {
			this.filter['concurrent_post_flag'] = 0;
		}

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

		/*==============================================
		 * Get current user department
		 * concurrent_post_flag = 1
		 *==============================================*/
	 	this.concurrentUserDepartment = [{ id: this.filter['m_department_id'], text: null }];
	 	let paramDataUserDepartment: URLSearchParams = new URLSearchParams();
	 	paramDataUserDepartment.set('concurrent_post_flag', '1');	
		this._AuthService.current_user_department(paramDataUserDepartment).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					var options = [];
					for (let key in res.data) {
						let obj = { id: res.data[key].m_department_id, text: res.data[key].department_name };
						options.push(obj);
					}
					this.concurrentUserDepartment = options;
				}
			}
		});
	}

	ngOnInit(){
		this.getMasterRoutes();
	}

	/*====================================
	 * Search Filter
	 *====================================*/
	onSearch() {
		this.getMasterRoutes();
		// Change URL when submit
		this._Router.navigate(['/check-routes'], { queryParams: this.filter });
	}

	/*====================================
	 * Reset Filter
	 *====================================*/
	onReset() {
		this.filter = {};
		this.filter['enable_date'] = moment().format(this._Configuration.formatDateTS);
		this.filter['concurrent_post_flag'] = '0';
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
		 * Get Current User Info
		 *==============================================*/
	 	let current_user_info = this._AuthService.getCurrent();

		/*==============================================
		 * Get List master routes
		 *==============================================*/
		var m_department_id = current_user_info['department_id'];
		if(this.filter['concurrent_post_flag'] && this.filter['m_department_id']) m_department_id = this.filter['m_department_id'];


 		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('menu_type', objMenu[0]);
		paramData.set('m_menu_id', objMenu[1]);
		paramData.set('m_department_id', m_department_id);
		paramData.set('concurrent_post_flag', this.filter['concurrent_post_flag']);
		paramData.set('enable_date', this.filter['enable_date']);
		paramData.set('user_check', '1');

		this._ApprovalRoutesService.getMasterRoutes(paramData).subscribe(res => {
			if (res.status == 'success') {
				if(res.data != null){
					this.dataRoutes = res.data;
				}
			}
		});
		
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e, area){
		// Set value of select 2 to ngModel
		switch (area) {
			case "m_menu_id":
				this.filter['m_menu_id'] = e.id;
				break;
			case "m_department_id":
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
			case "m_menu_id":
				this.filter['m_menu_id'] = null;
				break;
			case "m_department_id":
				this.filter['m_department_id'] = null;
				break;
		}
	}

	ngAfterViewInit(){
		
	}

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}
