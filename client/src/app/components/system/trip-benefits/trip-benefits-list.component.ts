/*
* @Author: th_le
* @Date:   2016-12-05 11:10:08
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-09 16:04:56
*/

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Configuration } from '../../../shared';
import { MTripAreaService } from '../../../services';
import { MTripPerdiemAllowanceService } from '../../../services';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';

declare var $: any;

@Component({
    selector: 'app-trip-benefits-list',
    templateUrl: 'trip-benefits-list.component.html',
    providers: [
        MTripAreaService,
        MTripPerdiemAllowanceService
    ]
})

export class TripBenefitsListComponent implements OnInit {
    private DTList_1;
    private DTList_2;
    decimal: any;
    public trip_area_id: number;
    public trip_perdiem_allowance_id: number;
    @ViewChild('modal_1') modal_1: ModalComponent;
    @ViewChild('modal_2') modal_2: ModalComponent;
    public trip_area_type  = [
        {'value':'1','label':'国内'},
        {'value':'2','label':'海外'},
    ];

    constructor(private _Configuration: Configuration, private _MTripAreaService: MTripAreaService, private _MTripPerdiemAllowanceService:MTripPerdiemAllowanceService, private _Router: Router, private _ToastrService: ToastrService) {}

    ngOnInit() {
        this.decimal = new DecimalPipe(this._Configuration.formatLocale);
    }

    ngAfterViewInit() {
        let self = this;
        let _trip_area_type = this.trip_area_type;

        this.DTList_1 = $('#tbl-data-1').DataTable({
            autoWidth: false,
            pageLength: this._Configuration.DtbPageLength,
            lengthChange: false,
            searching: false,
            bServerSide: true,
            ajax: {
                'url': this._MTripAreaService._list_data_URL,
                'type': 'GET',
                'beforeSend': function (request) {
                    request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
                },
                xhrFields: {
                    withCredentials: true
                }
            },
            columns: [
                { 'data':'name' },
                { 'data':'type', 'class':'text-center'},
                { 'data': null },
                { 'data': null },
            ],
            columnDefs: [
                {
                    render: function(data, type, full){
                        var html = '';
                        $.each(_trip_area_type, function(i,arr){
                            if(arr.value==data){
                                html = arr.label;
                                return false;
                            }
                        })
                        return html;
                    },
                    targets: [1]
                },
                {
                    targets: [2],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                            return '<a class="edit-record" href="#" id="btn_edit_1" title="編集"><i class="fa fa-pencil"></i></a>';
                        }
                }, {
                    targets: [3],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                        return '<a class="del-record" href="#" id="btn_delete_1" title="削除"><i class="fa fa-trash"></i></a>';
                    }
                }
            ],
            order: [
                [0, "asc"]
            ]
        });

        $('#tbl-data-1 tbody').on('click', '#btn_edit_1', function(){
            let id: number = $(this).parents('tr').attr('id');
            self.onNavigateUpdateTripArea(id);
            return false;
        });

        $('#tbl-data-1 tbody').on('click', '#btn_delete_1', function(){
            let id: number = $(this).parents('tr').attr('id');
            self.confirmDeleteTripArea(id);
            return false;
        });

        this.DTList_2 = $('#tbl-data-2').DataTable({
            autoWidth: false,
            pageLength: this._Configuration.DtbPageLength,
            lengthChange: false,
            searching: false,
            bServerSide: true,
            ajax: {
                'url': this._MTripPerdiemAllowanceService._list_data_URL,
                'type': 'GET',
                'beforeSend': function (request) {
                    request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
                },
                xhrFields: {
                    withCredentials: true
                }
            },
            columns: [
                { 'data': null },
                { 'data':'position_name' },
                { 'data':'perdiem', 'class':'text-right' },
                { 'data':'allowance', 'class':'text-right' },
                { 'data': null },
                { 'data': null },
            ],
            columnDefs: [
                {
                    targets: [0],
                    render: function (data, type, full) {
                        var html = '';
                        $.each(_trip_area_type, function(i, arr){
                            if( arr.value == data.trip_area_type ){
                                html = arr.label + ' - ' + data.trip_area_name;
                                return false;
                            }
                        })
                        return html;
                    }
                }, {
                    targets: [2],
                    render: function (data, type, full) {
                        return '¥' + self.decimal.transform(data);
                    }
                }, {
                    targets: [3],
                    render: function (data, type, full) {
                        return '¥' + self.decimal.transform(data);
                    }
                }, {
                    targets: [4],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                            return '<a class="edit-record" href="#" id="btn_edit_2" title="編集"><i class="fa fa-pencil"></i></a>';
                        }
                }, {
                    targets: [5],
                    className: 'text-center',
                    data: null,
                    bSortable: false,
                    render: function (data, type, full) {
                        return '<a class="del-record" href="#" id="btn_delete_2" title="削除"><i class="fa fa-trash"></i></a>';
                    }
                }
            ],
            order: [
                [0, "asc"]
            ]
        });

        $('#tbl-data-2 tbody').on('click', '#btn_edit_2', function(){
            let id: number = $(this).parents('tr').attr('id');
            self.onNavigateUpdateTripPerdiemAllowance(id);
            return false;
        });

        $('#tbl-data-2 tbody').on('click', '#btn_delete_2', function(){
            let id: number = $(this).parents('tr').attr('id');
            self.confirmDeleteTripPerdiemAllowance(id);
            return false;
        });
    }

    // Navigate form update trip area
    onNavigateUpdateTripArea(id: number){
        this._Router.navigate(['/system/trip-area/update', id]);
    }

    // Show popup confirm delete trip area
    confirmDeleteTripArea(id: number){
        this.trip_area_id = id;
        this.modal_1.open('sm');
    }

    // Delete trip area
    onDeleteTripArea(){
        this.modal_1.close();
        this._MTripAreaService.delete(this.trip_area_id).subscribe(res => {
            if(res.status == 'success'){
                this._ToastrService.success('削除しました。');
                this.DTList_1.ajax.url(this._MTripAreaService._list_data_URL).load();
            }
        })
    }

    // Navigate form update trip perdiem allowance
    onNavigateUpdateTripPerdiemAllowance(id: number){
        this._Router.navigate(['/system/trip-perdiem-allowance/update', id]);
    }

    // Show popup confirm delele trip perdiem allowance
    confirmDeleteTripPerdiemAllowance(id: number){
        this.trip_perdiem_allowance_id = id;
        this.modal_2.open('sm');
    }

    // Delete trip perdiem allowance
    onDeleteTripPerdiemAllowance(){
        this.modal_2.close();
        this._MTripPerdiemAllowanceService.delete(this.trip_perdiem_allowance_id).subscribe(res => {
            if(res.status == 'success'){
                this._ToastrService.success('削除しました。');
                this.DTList_2.ajax.url(this._MTripPerdiemAllowanceService._list_data_URL).load();
            }
        })
    }

    ngOnDestroy(){
        this.modal_1.ngOnDestroy();
        this.modal_2.ngOnDestroy();
    }
}