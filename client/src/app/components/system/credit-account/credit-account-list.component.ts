/*
* @Author: th_le
* @Date:   2016-12-05 11:52:47
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-05 16:14:20
*/

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../../shared';
import { MObicKariService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare var $: any;

@Component({
    selector: 'app-credit-account-list',
    templateUrl: 'credit-account-list.component.html',
    providers: [ MObicKariService ]
})

export class CreditAccountListComponent implements OnInit {
    private DTList;
    private delete_id: number;
    @ViewChild('modal') modal: ModalComponent;

    constructor(private _Configuration: Configuration, private _MObicKariService: MObicKariService, private _Router: Router, private _ToastrService: ToastrService) {}

    ngOnInit() {}

    ngAfterViewInit() {
        let self = this;
        this.DTList = $('#tbl-data').DataTable({
            autoWidth: false,
            pageLength: this._Configuration.DtbPageLength,
            lengthChange: false,
            searching: false,
            bServerSide: true,
            ajax: {
                'url': this._MObicKariService._list_data_URL,
                'type': 'GET',
                'beforeSend': function (request) {
                    request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
                },
                xhrFields: {
                    withCredentials: true
                }
            },
            columns: [
                { 'data':'karikata_name' },
                { 'data':'karikata_sokanjokamoku_cd' },
                { 'data':'karikata_hojokamoku_cd' },
                { 'data':'karikata_hojouchiwakekamoku_cd' },
                { 'data':'karikata_torihikisaki_cd' },
                { 'data':'karikata_zei_kubun' },
                { 'data':'karikata_zeikomi_kubun' },
                { 'data':'karikata_bunseki_cd1' },
                { 'data': null },
                { 'data': null },
            ],
            columnDefs: [
                {
                    targets: [8],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
                        }
                }, {
                    targets: [9],
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
        });

        $('#tbl-data tbody').on('click', '#btn_edit', function(){
            let id:number = $(this).parents('tr').attr('id');
            self.onNavigateUpdate(id);
            return false;
        })

        $('#tbl-data tbody').on('click', '#btn_delete', function(){
            let id: number = $(this).parents('tr').attr('id');
            self.confirmDelete(id);
            return false;
        })
    }

    /*====================================
      Navigate form update
    ====================================*/
    onNavigateUpdate(id: number){
        this._Router.navigate(['system/credit-account/update', id]);
    }

    /*====================================
      Open dialog confirm delete
    =====================================*/
    confirmDelete(id:number){
        this.delete_id = id;
        this.modal.open('sm');
    }

    /*====================================
      Delete item
    ====================================*/
    onDelete(){
        this.modal.close();
        this._MObicKariService.delete(this.delete_id).subscribe(res => {
            if(res.status == 'success'){
                this._ToastrService.success('データを削除しました。');
                this.DTList.ajax.url(this._MObicKariService._list_data_URL).load();
            }
        })
    }

    ngOnDestroy(){
        this.modal.ngOnDestroy();
    }
}