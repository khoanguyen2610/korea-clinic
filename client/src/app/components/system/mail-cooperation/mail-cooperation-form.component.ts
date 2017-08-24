import { Component, OnInit, ViewChild, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import { NgForm } from '@angular/forms';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { MDepartmentService, MCompanyService, TMailCooperationService, MPositionService, MUserService, MMenuService, MApprovalStatusService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
    selector: 'app-system-mail-cooperation-form',
    templateUrl: './mail-cooperation-form.component.html',
    providers: [MDepartmentService, MCompanyService, TMailCooperationService, MPositionService, MUserService, MMenuService, MApprovalStatusService]
})
export class MailCooperationFormComponent implements OnInit {
    private subscription: Subscription;
    private DTList;

    dataList = [];
    companyOptions: Array<any> = [];
    businessOptions: Array<any> = [];
    divisionOptions: Array<any> = [];
    departmentOptions: Array<any> = [];
    positionOptions: Array<any> = [];
    userOptions: Array<any> = [];
    menuOptions: Array<any> = [];
    approvalStatusOptions: Array<any> = [];
    validateErrors: Array<any> = [];

    Item = {};
    _params: any;

    processConcurrent = new UserConcurrent();
    url_list_data: String;

    constructor(private _Router: Router,
        private _Configuration: Configuration,
        private _MDepartmentService: MDepartmentService,
        private _MCompanyService: MCompanyService,
        private _TMailCooperationService: TMailCooperationService,
        private _MPositionService: MPositionService,
        private _MUserService: MUserService,
        private _MMenuService: MMenuService,
        private _MApprovalStatusService: MApprovalStatusService,
        private _ActivatedRoute: ActivatedRoute,
        private _ToastrService: ToastrService
    ) {
        let self = this;

        this.subscription = _ActivatedRoute.params.subscribe(
            (param: any) => this._params = param
        )
    }

    ngOnInit() {

        this.getMenuOptions();

        this.getApprovalStatusOptions();

        /*==============================================
         * Get List Position
         *==============================================*/
        var params: URLSearchParams = new URLSearchParams();
        params.set('item_status', 'active');
        const listMPosition$ = this._MPositionService.getAll(params);


        /*==============================================
         * Get List Company
         *==============================================*/
        var params: URLSearchParams = new URLSearchParams();
        params.set('item_status', 'active');
        this.companyOptions = [{ id: '', text: null }];
        this._MCompanyService.getAll(params).subscribe(res => {
            if (res.status == 'success') {
                if (res.data != null) {
                    var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].name };
                        options.push(obj);
                    }
                    this.companyOptions = options;
                }
            }
        });

        /*=================================
         * Get Item Data 
         * method: update & :id not null
         *=================================*/
        switch (this._params.method) {
            case "update":
                if (this._params.id != null) {
                    listMPosition$.subscribe(res => {
                        if (res.status == 'success') {
                            if (res.data != null) {
                                var options = [];
                                for (let key in res.data) {
                                    let obj = { id: res.data[key].id, text: res.data[key].name };
                                    options.push(obj);
                                }
                                this.positionOptions = options;

                                // Get Detail Mail Cooperation
                                this._TMailCooperationService.getByID(this._params.id).subscribe(res => {
                                    if (res.status == 'success') {
                                        this.Item = res.data;
                                        let clone_data = JSON.parse(JSON.stringify(res.data));
                                        this.userOptions = [{ id: this.Item['m_user_id'], text: null }];
                                        this.getUserData(clone_data);

                                        /*==============================================
                                         * Get Department (Business - Division - Department)
                                         *==============================================*/
                                        this.getDepartmentOption(clone_data);
                                    }
                                });
                            }
                        }
                    });


                }
                break;
            case "create":
                /*==============================================
                 * Get Department (Business - Division - Department)
                 *==============================================*/
                this.getDepartmentOption(this._params);

                // Set Default Create

                listMPosition$.subscribe(res => {
                    if (res.status == 'success') {
                        if (res.data != null) {
                            var options = [];
                            for (let key in res.data) {
                                let obj = { id: res.data[key].id, text: res.data[key].name };
                                options.push(obj);
                            }
                            this.positionOptions = options;
                        }
                    }
                });

                break;
            default:
                // this.router.navigate(['/system/menu-master']);
                break;
        }

    }

    /*==============================================
     * Get User Route
     *==============================================*/
    getUserData(Item = null) {
        var params: URLSearchParams = new URLSearchParams();
        params.set('department_id', Item['department_id']);
        this.userOptions = [{ id: Item['m_user_id'], text: null }];
        if (this.Item['position_id']) {
            params.set('m_position_id', Item['position_id']);
        }
        this._MUserService.getListData(params).subscribe(res => {
            if (res.aaData != null) {
                var list = [];
                for (let key in res.aaData) {
                    let obj = { id: res.aaData[key].id, text: res.aaData[key].fullname };
                    list.push(obj);
                }
                this.userOptions = list;
                setTimeout(()=>{
                    this.Item['m_user_id'] = Item['m_user_id'];
                }, 200)
            }
        });
    }

    /*====================================
     * Get List menu master 0.2 & 0.4
     *====================================*/
    getMenuOptions() {
        this.menuOptions = [{ id: null, text: null }];
        let paramData: URLSearchParams = new URLSearchParams();
        paramData.set('item_status', 'active');
        this.menuOptions = [{ id: this.Item['m_menu_id'], text: null }];
        this._MMenuService.getAllMenuMaster(paramData).subscribe(res => {
            if (res.status == 'success') {
                if (res.data != null) {
                    var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key]._id, text: res.data[key].name };
                        options.push(obj);
                    }
                    this.menuOptions = options;


                }
            }
        });
    }

    /*====================================
     * Get List Approval Status Options
     *====================================*/
    getApprovalStatusOptions() {
        this.approvalStatusOptions = [{ id: null, text: null }];
        let paramData: URLSearchParams = new URLSearchParams();
        paramData.set('item_status', 'active');

        this._MApprovalStatusService.getAll(paramData).subscribe(res => {
            if (res.status == 'success') {
                if (res.data != null) {
                    var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].name };
                        options.push(obj);
                    }
                    this.approvalStatusOptions = options;
                }
            }
        });
    }



    /*==============================================
     * Reload data when change select
     *==============================================*/
    onSelectFilterChange(event, area?: string, type?: string) {
        //reset user id
        this.Item['m_user_id'] = null;
        switch (area) {
            case "company":
                if (type == 'deselected') {
                    this.Item['m_company_id'] = null;
                } else {
                    this.Item['business_id'] = null;
                }
            case "business":
                if (type == 'deselected') {
                    this.Item['business_id'] = null;
                } else {
                    this.Item['division_id'] = null;
                }
            case "division":
                if (type == 'deselected') {
                    this.Item['division_id'] = null;
                } else {
                    this.Item['department_id'] = null;
                }
            case "department":
                if (type == 'deselected') {
                    this.Item['department_id'] = null;
                    this.userOptions = [];
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
        this.getUserData(this.Item);
        this.getDepartmentOption(this.Item);
    }

    /*=======================================
     * Get List Options Department
     *=======================================*/
    getDepartmentOption(request, area?: string) {
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
        params.set('department_id', request['department_id']);
        this._MDepartmentService.getListOption(params).subscribe(res => {
            if (res.status == 'success') {
                if (res.data.options != null) {
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

                setTimeout(function() {
                    if (res.data.m_company_id) self.Item['m_company_id'] = res.data.m_company_id;
                    if (res.data.business_id) self.Item['business_id'] = res.data.business_id;
                    if (res.data.division_id) self.Item['division_id'] = res.data.division_id;
                    if (res.data.department_id) {
                        self.Item['department_id'] = res.data.department_id;
                    }
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
            case "posistion":
                this.Item['position_id'] = e.id;
                this.getUserData(this.Item);
                break;
            case "user":
                this.Item['m_user_id'] = e.id;
                break;
            case "menu":
                this.Item['menu_petition_id'] = e.id;
                break;
            case "approval_status":
                this.Item['m_approval_status_id'] = e.id;
                break;
        }
    }

    /*====================================
     * Event removed of ng2-select - MIT
     *====================================*/
    onNgRemoved(e, area){
        // Reset value of select 2 to ngModel
        switch (area) {
            case "posistion":
                this.Item['position_id'] = null;
                this.getUserData(this.Item);
                break;
            
        }
    } 

    /*=================================
     * Create | Update Approval Department
     *=================================*/
    onSave(form: NgForm) {
        var objMenu = [];
        var select_m_menu_id = "";
        if(this.Item['menu_petition_id']){
            if(typeof this.Item['menu_petition_id'] == 'object' && this.Item['menu_petition_id'].length > 0){
                select_m_menu_id = this.Item['menu_petition_id'][0];
            }else{
                select_m_menu_id = this.Item['menu_petition_id'];
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
        paramData.set('m_company_id', this.Item['m_company_id']);
        paramData.set('business_id', this.Item['business_id']);
        paramData.set('division_id', this.Item['division_id']);
        paramData.set('position_id', this.Item['position_id']);
        paramData.set('m_user_id', this.Item['m_user_id']);
        paramData.set('m_approval_status_id', this.Item['m_approval_status_id']);
        paramData.set('to_email', this.Item['to_email']);

        if (this._params['method'] == 'create') {
            this._TMailCooperationService.save(paramData).subscribe(res => {
                if (res.status == 'success') {
                    this._ToastrService.success('情報を登録しました。');
                    this.Item = {};
                    //reset form
                    form.reset();

                    this.getUserData(this.Item);

                    /*==============================================
                     * Get Department (Business - Division - Department)
                     *==============================================*/
                    this.getDepartmentOption(this.Item);
                }
            });
        } else {
            this._TMailCooperationService.save(paramData, this.Item['id']).subscribe(res => {
                if (res.status == 'success') {
                    this._ToastrService.success('情報を登録しました。');
                }
            });
        }

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    protected clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
}
