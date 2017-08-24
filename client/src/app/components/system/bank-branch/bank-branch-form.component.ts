/*
* @Author: th_le
* @Date:   2016-11-30 16:51:55
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-07 15:31:13
*/

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from "rxjs/Rx";
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from "@angular/http";
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

import { BreadcrumbComponent } from '../../general';
import { MBankBranch } from '../../../models';
import { MBankBranchService, MBankService } from '../../../services';

@Component({
    selector: 'app-bank-branch-form',
    templateUrl: 'bank-branch-form.component.html',
    providers: [
        MBankBranchService,
        MBankService
    ]
})

export class BankBranchFormComponent implements OnInit {
    private Item = new MBankBranch();
    private _params: any;
    private subscription = new Subscription();

    bankOptions: Array<any> = [];
    // listBank$:any;

    constructor(private _MBankBranchService: MBankBranchService, 
        private _ActivatedRoute: ActivatedRoute, 
        private _ToastrService:ToastrService, 
        private _MBankService: MBankService, 
        private _Router: Router, 
        private _Location: Location
    ){
        // Get params on URL
        this.subscription = this._ActivatedRoute.params.subscribe((params: any) => {
            this._params = params;
        })
    }

    ngOnInit() {
        /*==============================================
         * Get List Bank
         *==============================================*/
        var params: URLSearchParams = new URLSearchParams();
        params.set('item_status', 'active');

        this.bankOptions = [{id: this.Item['m_bank_id'], text: null }];
        this._MBankService.getAll(params).subscribe(res => {
            if(res.status == 'success'){
                if(res.data != null) {
                    var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].code + ' - ' + res.data[key].name };
                        options.push(obj);
                    }
                    this.bankOptions = options;
                }
            }
        })

        switch (this._params.method) {
            case "create":
                // code...
                break;
            case "update":
                let failed = true;
                if(this._params.id != null){
                    failed = false;
                    this._MBankBranchService.getByID(this._params.id).subscribe( res => {
                        if(res.status == 'success'){
                            if(res.data != null){
                                setTimeout(() => {
                                    this.Item = res.data;
                                }, 300)
                            } else {
                                failed = true;
                            }
                        } else {
                            failed = true;
                        }
                    })
                }
                if(failed){
                    this._Router.navigate['/system/bank-branch'];
                }
                break;
            default:
                this._Router.navigate['/system/bank-branch'];
                break;
        }
    }

    /*====================================
     * Event selected of ng2-select - MIT
     *====================================*/
    onNgSelected(e, area){
        // Set value of select 2 to ngModel
        switch (area) {
            case "bank":
                this.Item['m_bank_id'] = e.id;
                break;
        }
    }
    
    /*=========================================
     * Create | update Bank Branch Information
     *=========================================*/
    onSubmit(form : NgForm) {
        if(form.valid) { // Check form is valid
            let paramsData: URLSearchParams = new URLSearchParams();
            paramsData.set('m_bank_id', this.Item['m_bank_id'].toString());
            paramsData.set('code', this.Item['code']);
            paramsData.set('name', this.Item['name']);
            paramsData.set('name_kana', this.Item['name_kana']);
            paramsData.set('name_e', this.Item['name_e']);

            if(this._params.method == "update"){ // Check method is update => TODO: update bank branch
                paramsData.set('id', this.Item['id'].toString());
                this._MBankBranchService.save(paramsData, this.Item['id']).subscribe( res => {
                    if(res.status == 'success'){
                        this._ToastrService.success('情報を登録しました。');
                    } else if( res.status == 'error' ) {

                    }
                })
            } else if( this._params.method == "create"){ //  Check method is create => TODO: create a new bank branch
                this._MBankBranchService.save(paramsData).subscribe( res => {
                    if(res.status == 'success'){
                        form.reset();
                        this._ToastrService.success('情報を登録しました。');
                    } else if(res.status == "error"){

                    }
                })
            }
        }

    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}