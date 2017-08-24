/*
* @Author: th_le
* @Date:   2016-12-20 10:13:41
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-21 16:13:22
*/

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from "@angular/http";
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { TNotify } from '../../../models';
import { TNotifyService } from '../../../services';
import { BreadcrumbComponent } from '../../general';

declare let $: any;
declare let moment: any;

@Component({
    selector: 'app-notify-history',
    templateUrl: 'notify-history.component.html',
    providers: [TNotifyService]
})

export class NotifyHistoryComponent implements OnInit {
    no_data = false;

    // params to post
    release_flg = 1;
    start = 0;
    length = 3;
    has_order_by_date=1;

    // total records
    loaded = 0;
    total = 0;

    _g_date = null;
    _date = false;
    active_load_scroll = true;
    notifies: TNotify[] = [];


    public notice_type ={ 'none' : '指定なし)', '01' :'バージョンアップ', '02' : 'お知らせ', '03' : 'メンテナンス', '99' : 'その他'};

    constructor( private _Router: Router, private _Configuration: Configuration, private _TNotifyService: TNotifyService ){

        // Prepare params to post
        var params: URLSearchParams = new URLSearchParams();
        params.set('release_flg', this.release_flg.toString());

        // Get total records
        this._TNotifyService.getAll(params).subscribe(res => {
            if(res.aaData.length > 0){
                this.total = res.iTotalRecords;
                this.checkLength();
            }
        });

        this.active_load_scroll = true;
    }

    ngOnInit(){
        this.loadData();
    }

    // Scroll to load more data
    ngAfterViewInit(){
        let self = this;
        $(window).scroll(function(){
            if(self.checkLength() && self.active_load_scroll){
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    self.onLoadData();
                }
            }
        })
    }

    // Handle click button load more data
    onLoadData(){
        this.start += this.length;
        this.loadData();
    }

    // Load more data
    loadData(){
        this.loaded += this.length;
        this.checkLength();

        // Prepare params to post
        let params: URLSearchParams = new URLSearchParams();
        params.set('release_flg', this.release_flg.toString());
        params.set('start', this.start.toString());
        params.set('length', this.length.toString());
        params.set('has_order_by_date', this.has_order_by_date.toString());

        // Get list data
        this._TNotifyService.getAll(params).subscribe(res => {
            if(res.aaData.length > 0){
                for(let k in res.aaData){
                    if(this._g_date != res.aaData[k].date){
                        this._g_date = res.aaData[k].date;
                        this._date = true;
                    } else {
                        this._date = false;
                    }
                    res.aaData[k]._date = this._date;
                    res.aaData[k].date = moment(Date.parse(res.aaData[k].date)).format(this._Configuration.formatDateTS);
                    this.notifies.push(res.aaData[k]);
                }
            } else {
                this.no_data = true;
            }
        })
    }

    // Check elements loaded
    // If elements loaded < total elements -> TODO: load more
    // Else -> TODO: stop load
    checkLength(){
        if( this.loaded < this.total ){
            return true;
        } else {
            return false;
        }
    }

    ngOnDestroy(){
        this.active_load_scroll = false;
    }
}