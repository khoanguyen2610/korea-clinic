import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Configuration } from '../../../shared';

import { MTripPerdiemAllowanceService, MPositionService, MTripAreaService } from '../../../services';
import { MTripPerdiemAllowance, MTripArea } from '../../../models';
import { BreadcrumbComponent } from '../../general';

@Component({
    selector: 'app-trip-perdiem-allowance-form',
    templateUrl: 'trip-perdiem-allowance-form.component.html',
    providers: [
        MTripPerdiemAllowanceService,
        MPositionService,
        MTripAreaService
    ]
})

export class TripPerdiemAllowanceFormComponent implements OnInit {
    public Item = new MTripPerdiemAllowance();
    public mTripArea = new MTripArea();
    private subscription = new Subscription();
    private _params: any;
    decimal: any;

    public tripAreaTypeOptions: Array<any> = [
        {'id':'1','text':'国内'},
        {'id':'2','text':'海外'},
    ];
    public tripAreaNameOptions: Array<any> = [];
    public positionNameOptions: Array<any> = [];

    constructor(private _ActivatedRoute: ActivatedRoute, private _MTripPerdiemAllowanceService: MTripPerdiemAllowanceService, private _ToastrService: ToastrService, private _MPositionService: MPositionService, private _MTripAreaService: MTripAreaService, private _Location: Location, private _Router: Router, private _Configuration: Configuration){
        this.subscription = this._ActivatedRoute.params.subscribe((params: any) => {
            this._params = params;
        })
    }

    ngOnInit(){
        /*==============================================
         * Get List Position
         *==============================================*/
        var params: URLSearchParams = new URLSearchParams();
        params.set('item_status', 'active');
        this.positionNameOptions = [{id: null, text:null}];
        const listMPosition$ = this._MPositionService.getAll(params);
        this.decimal = new DecimalPipe(this._Configuration.formatLocale);

        switch (this._params.method) {
            case "create":
                listMPosition$.subscribe(res => {
                    if(res.status == 'success'){
                        if(res.data != null) {
                            var options = [];
                            for (let key in res.data) {
                                let obj = { id: res.data[key].id, text: res.data[key].name };
                                options.push(obj);
                            }
                            this.positionNameOptions = options;
                        }
                    }
                });
                break;
            case "update":
                let failed = true;
                if(this._params.id != null){
                    failed = false;
                    listMPosition$.subscribe(res => {
                        if(res.status == 'success'){
                            if(res.data != null) {
                                var options = [];
                                for (let key in res.data) {
                                    let obj = { id: res.data[key].id, text: res.data[key].name };
                                    options.push(obj);
                                }
                                this.positionNameOptions = options;
                            }
                        }

                        this._MTripPerdiemAllowanceService.getByID(this._params.id).subscribe(res=>{
                            if(res.status == 'success'){
                                this.tripAreaNameOptions = [{id: res.data['id'], text:null}];
                                res.data.allowance = this.decimal.transform(res.data.allowance);
                                res.data.perdiem = this.decimal.transform(res.data.perdiem);
                                this.Item = res.data;

                                this._MTripAreaService.getByID(this.Item.m_trip_area_id).subscribe(res => {
                                    if(res.status = 'success'){
                                        this.mTripArea.type = res.data.type;

                                        // this.Item.m_trip_area_id = res.data.id;
                                        let clone_data = JSON.parse(JSON.stringify(res.data));
                                        this.getTripAreaNameByType(clone_data['type'], clone_data['id']);
                                    }
                                })
                                if(res.data != null) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        })
                    });

                }
                if(failed){
                    this._Router.navigate(['/system/trip-benefits']);
                }
                break;
            default:
                this._Router.navigate(['/system/trip-benefits']);
                break;
        }
    }

    /*====================================
     * Event selected of ng2-select - MIT
     *====================================*/
    onNgSelected(e, area){
        // Set value of select 2 to ngModel
        switch (area) {
            case "type":
                this.mTripArea['type'] = e.id;
                this.getTripAreaNameByType(e.id);
                break;
            case "trip_area":
                this.Item['m_trip_area_id'] = e.id;
                break;
            case "position":
                this.Item['m_position_id'] = e.id;
                break;
        }
    }

    onSubmit(form : NgForm){
        if(form.valid){ // Check form is valid -> continues
            // Prepare params
            let paramData: URLSearchParams = new URLSearchParams();
            paramData.set('m_trip_area_id', this.Item['m_trip_area_id'].toString());
            paramData.set('m_position_id', this.Item['m_position_id'].toString());
            paramData.set('perdiem', this.Item['perdiem'].toString());
            paramData.set('allowance', this.Item['allowance'].toString());
            if(this._params.method == 'update') { // Check method is update -> TODO: update trip-perdiem-allowance
                paramData.set('id', this.Item['id'].toString());
                this._MTripPerdiemAllowanceService.save(paramData, this.Item['id']).subscribe(res => {
                    if(res.status == 'success'){
                        this._ToastrService.success('情報を登録しました。');
                    }else{
                        if(res.error['exist']){
                            this._ToastrService.error(res.error['exist']);
                        }
                    }
                })
            }else if(this._params.method == 'create') { // Check method is create -> TODO: creata a new trip-perdiem-allowance
                this._MTripPerdiemAllowanceService.save(paramData).subscribe(res => {
                    if(res.status == 'success'){
                        form.reset(); // Reset first status of inputs
                        this._ToastrService.success('情報を登録しました。');
                    }else{
                        if(res.error['exist']){
                            this._ToastrService.error(res.error['exist']);
                        }
                    }
                })
            }
        }
    }

    getTripAreaNameByType(type:string, m_trip_area_id = null){
        /*==============================================
         * Get List Trip Area by type
         *==============================================*/

        var params: URLSearchParams = new URLSearchParams();
        params.set('item_status', 'active');
        params.set('type', type);

        this._MTripAreaService.getAll(params).subscribe(res => {
            if(res.status == 'success'){
                if(res.data != null) {
                    var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].name };
                        options.push(obj);
                    }
                    this.tripAreaNameOptions = options;

                    setTimeout(() => {
                        this.Item['m_trip_area_id'] = m_trip_area_id;
                    }, 200)
                }
            }
        })
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}