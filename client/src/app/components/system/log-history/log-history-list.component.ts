/*
* @Author: th_le
* @Date:   2016-12-15 10:34:47
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-16 09:12:03
*/

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TLogHistoryService } from '../../../services';
import { Configuration }  from '../../../shared';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
    selector: 'app-log-history-list',
    templateUrl: 'log-history-list.component.html',
    providers: [TLogHistoryService]
})

export class LogHistoryListComponent implements OnInit {
    private DTList;
    private filter = {};
    private operations = [];

    constructor(private _TLogHistoryService: TLogHistoryService, private _Configuration: Configuration, private _Router: Router, private _Location: Location){}

    ngOnInit(){
        this._TLogHistoryService.getListOperation().subscribe(res => {
            if(res.status == 'success'){
                this.operations = res.data;
            }
        })
    }

    ngAfterViewInit(){
        let _list_data_URL = this._TLogHistoryService._list_data_URL;
        let Configuration = this._Configuration;
        let self = this;

        this.DTList = $('#tbl-data').DataTable({
            autoWidth: false,
            pageLength: Configuration.DtbPageLength,
            lengthChange: false,
            searching: false,
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
                { 'data':'staff_no' },
                { 'data':'fullname' },
                { 'data':'ip_address' },
                { 'data':'host_name' },
                { 'data':'date_time', 'class' : 'text-center' },
                { 'data':'operation' }
            ],
            columnDefs: [
                {
                    render: function(data, type, full){
                        var parsedDate = Date.parse(data);
                        if(isNaN(parsedDate)){
                           return "";
                        }else{
                            return moment(parsedDate).format(Configuration.formatDateTimeTS);
                        }
                    },
                    targets: [4]
                }
            ],
            order: [
                [4, "desc"]
            ]
        });
    }
    
    /*====================================
     * Event selected of ng2-select - MIT
     *====================================*/
    onNgSelected(e){
        // Set value of select 2 to ngModel
        this.filter['operation'] = e.id;
    }
    /*====================================
     * Event removed of ng2-select - MIT
     *====================================*/
    onNgRemoved(e){
        // Reset value of select 2 to ngModel
        this.filter['operation'] = null;
    }

    /*====================================
     * Filter log history
     *===================================*/
    onSearch(){
        // Change URL when submit
        this._Router.navigate(['/system/log-history'], {queryParams: this.filter});
        // Reload DataTable
        let _list_data_URL = this._TLogHistoryService._list_data_URL + '?' + $.param(this.filter);
        this.DTList.ajax.url(_list_data_URL).load();
    }

    /*========================================
     * Clear filter input and reload DataTable
     *=======================================*/
    onReset(){
        this.filter = {};
        this.onSearch();
    }
}