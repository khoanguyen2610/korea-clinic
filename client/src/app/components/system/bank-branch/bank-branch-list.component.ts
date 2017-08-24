/*
* @Author: th_le
* @Date:   2016-11-30 14:08:54
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-02 13:48:36
*/
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from "@angular/http";
import { Location } from '@angular/common';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MBankBranchService, MBankService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

import { MBank } from '../../../models';

declare let $: any;

@Component({
    selector: 'app-bank-branch-list',
    templateUrl: 'bank-branch-list.component.html',
    providers: [
        MBankBranchService,
        MBankService
    ]
})

export class BankBranchListComponent implements OnInit {
    private subscription: Subscription;
    private DTList;
    filter = {};
    private m_bank_id;
    private url_list_data: string;
    private Bank = new MBank();
    private delete_id: number;
    @ViewChild('modal') modal: ModalComponent;

    constructor( private _Configuration: Configuration, private _MBackBranchService: MBankBranchService, private _ActivatedRoute: ActivatedRoute, private _MBankService: MBankService, private _Router: Router, private _ToastrService:ToastrService, private _Location: Location) {
        let url_params: URLSearchParams = new URLSearchParams();
        this.subscription = this._ActivatedRoute.queryParams.subscribe((params: any) => {
            for(var k in params){
                url_params.set(k, params[k]);
                this.filter[k] = params[k];
            }
        })

        this.url_list_data = this._MBackBranchService._list_data_URL + "?" + $.param(this.filter);
        this.m_bank_id = this.filter['m_bank_id'];
    }

    ngOnInit() {
        if(this.m_bank_id != null){
            this._MBankService.getByID(this.m_bank_id).subscribe( res => {
                this.Bank = res.data;
            })
        }
    }

    ngAfterViewInit() {
        let self = this;
        this.DTList = $('#tbl-data').DataTable({
            autoWidth: false,
            pageLength: this._Configuration.DtbPageLength,
            lengthChange: false,
            searching: false,
            bServerSide: true,
            ajax: {
                'url': this.url_list_data,
                'type': 'GET',
                'beforeSend': function (request) {
                    request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
                },
                xhrFields: {
                    withCredentials: true
                }
            },
            columns: [
                { 'data':'code', 'class': 'text-center' },
                { 'data':'name' },
                { 'data':'name_kana' },
                { 'data':'name_e' },
                { 'data': null },
                { 'data': null },
            ],
            columnDefs: [
                {
                    targets: [4],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                        return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
                    }
                }, {
                    targets: [5],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                        return '<a class="del-record" href="#" id="btn_delete" title="削除"><i class="fa fa-trash"></i></a>';
                    }
                }
            ],
            order: [
                [0, "asc"]
            ]
        })

        $('#tbl-data tbody').on('click', '#btn_edit', function(){
            let id = $(this).parents('tr').attr('id');
            self.onRoutingUpdate(id);
            return false;
        })

        $('#tbl-data tbody').on('click', '#btn_delete', function(){
            let id = $(this).parents('tr').attr('id');
            self.onOpenConfirm(id);
            return false;
        })
    }

    /*====================================
    / Navigate bank branch form update
    / ===================================*/
    onRoutingUpdate(id: number) {
        this._Router.navigate(['/system/bank-branch/update', id]);
    }

    /*====================================
    / Open dialog confirm delete
    / ===================================*/
    onOpenConfirm(id: number) {
        this.delete_id = id;
        this.modal.open('sm');
    }

    /*====================================
    / Delete bank branch item
    / ===================================*/
    onConfirmDelete(){
        this.modal.close();
        this._MBackBranchService.delete(this.delete_id).subscribe(res=>{
            if(res.status == 'success'){
                this._ToastrService.success('情報を登録しました。');
                // Reload DataTable
                let _list_data_URL = this._MBackBranchService._list_data_URL + "?" + $.param(this.filter);
                this.DTList.ajax.url(_list_data_URL).load();
            }
        })
    }

    /*====================================
    / Filter bank branch(es) by filter
    / ===================================*/
    onSearch() {
        // Change URL when submit
        this._Router.navigate(['/system/bank-branch'], { queryParams: this.filter });

        // Reload DataTable
        let _list_data_URL = this._MBackBranchService._list_data_URL + "?" + $.param(this.filter);
        this.DTList.ajax.url(_list_data_URL).load();
    }

    /*==========================================
    / Clear search filter and reload Datatable
    / =========================================*/
    onReset(){
        this.filter = {};
        this.Bank = new MBank();
        this.onSearch();
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
        this.modal.ngOnDestroy();
    }
}