import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { URLSearchParams } from "@angular/http";
import { Subscription } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { Configuration } from '../../shared';
import { FormProcessService, FormCountService, AuthService, TNotifyService } from '../../services';
import { TNotify } from '../../models';

declare let $: any;
declare let moment: any;
declare let general: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [ FormProcessService, FormCountService, AuthService, TNotifyService ]
})
export class HomeComponent implements OnInit {
    private subscription: Subscription;
    private DTList;
    form_data: Array<any> = [];
    form_count_data: Array<any> = [];
    form_status_data: Array<any> = [];
    total_form_data = 0;
    current_user_info = {};
    _param = {};

    more_query_param_form_count?: String;
    more_query_param_form_status?: String;

    form_form_loading = true;
    form_count_loading = true;

    newest_notify = false;

    form_status_loading = true;

    notify = new TNotify();

    meetingroom_login_api:string = "";

    public notice_type ={ 'none' : '指定なし)', '01' :'バージョンアップ', '02' : 'お知らせ', '03' : 'メンテナンス', '99' : 'その他'};

    constructor( private _Configuration: Configuration,
        private _FormProcessService: FormProcessService,
        private _FormCountService: FormCountService,
        private _AuthService: AuthService,
        private _Router: Router,
        private _ActivatedRoute: ActivatedRoute,
        private _Location: Location,
        private _TNotifyService: TNotifyService ){

        //current user
        this.current_user_info = this._AuthService.getCurrent();
        if(this.current_user_info && this._Configuration.meetingroom_active){
            let res_param = {'redirect': true,
                                'vws_auth_id' : this.current_user_info['id'],
                                'auth_request' : 'http://vws.vision-vietnam.com',
                                'oauth' : 1,
                                't' : Date.now()
                                }
            this.meetingroom_login_api = _Configuration.meetingroom_login_api + '?' + $.param(res_param);
        }

        /*==============================================
         * Get List menu master 0.2 & 0.4
         *==============================================*/
        let paramData: URLSearchParams = new URLSearchParams();
        paramData.set('item_status', 'active');
        this._FormProcessService.getListFormBasedUser(paramData).subscribe(res => {
            if (res.status == 'success') {
                if(res.data != null){
                    this.form_data = res.data;
                    this.total_form_data = res.total;
                    setTimeout(() =>{
                        // this.DTList.fnDraw();
                        this.initDatatable();
                        this.form_form_loading = false;
                    }, 500)
                }else{
                    this.form_form_loading = false;
                }
            }
        });

        /*==============================================
         * Get count form data menu master 0.2 & 0.4
         *==============================================*/
        let paramCount: URLSearchParams = new URLSearchParams();
        paramCount.set('has_total', '1');
        this._FormCountService.formApproved(paramCount).subscribe(res => {
            if (res.status == 'success') {
                this.form_count_data = res.data;
                this.more_query_param_form_count = res.more_query_params;
                this.form_count_loading = false;
            }
        });

        /*==============================================
         * Get count form data menu master 0.2 & 0.4
         *==============================================*/
        let paramStatus: URLSearchParams = new URLSearchParams();
        paramStatus.set('has_total', '1');
        this._FormCountService.formStatus(paramStatus).subscribe(res => {
            if (res.status == 'success') {
                this.form_status_data = res.data;
                this.more_query_param_form_status = res.more_query_params;
                this.form_status_loading = false;
            }
        });
    }


    initDatatable(){
        let self = this;
        self.DTList = $('#tbl-data').DataTable({
            autoWidth: true,
            lengthChange: false,
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            scrollY: 222,
            scrollX: true,
            scrollCollapse: true,
            dom: '<"datatable-header clearfix"fl><"clearfix"tr><"datatable-footer clearfix"ip>',
            processing: true,
            serverSide: false,
            initComplete: function() {
                if($(window).width() >= 768){
                    $('.section-1').find('.dataTables_scrollBody').mCustomScrollbar();
                }
            }
        });
        $('.table-section').mCustomScrollbar();
    }

    ngOnInit() {
        this.getNewestNotify();
    }

    getNewestNotify() {
        this._TNotifyService.getNewest().subscribe(res => {
            if(res.status == 'success'){
                if(res.data != null){
                    this.newest_notify = true;
                    this.notify = res.data;
                } else {
                    this.newest_notify = false;
                }
            } else {
                this.newest_notify = false;
            }
        })
    }

    ngAfterViewInit() {
        this.setDefaultPos();
        this.changePos();
    }

    ngOnDestroy() {
        this.resetPos();
    }

    // Set default position for back-to-top button
    setDefaultPos(){
        if(general.checkElem('.login-meeting-room')){
            $('.back-to-top').css('bottom', 50);
        } else {
            $('.back-to-top').css('bottom', 15);
        }
    }

    // Change position of back-to-top button when hover login-meeting-room button
    changePos() {
        $('.login-meeting-room').hover(function() {
          $('.back-to-top').css('bottom', 95);
        }, function() {
          $('.back-to-top').css('bottom', 50);
        });
    }

    // Reset position of back-to-top button
    resetPos() {
        $('.back-to-top').css('bottom', 15);
    }
}

