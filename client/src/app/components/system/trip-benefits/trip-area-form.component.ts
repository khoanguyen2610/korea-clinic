/*
* @Author: th_le
* @Date:   2016-12-06 15:53:17
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-06 17:06:46
*/

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from "@angular/http";
import { MTripArea } from '../../../models';
import { MTripAreaService } from '../../../services';
import { Subscription } from "rxjs/Rx";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { BreadcrumbComponent } from '../../general';

@Component({
    selector: 'app-trip-area-form',
    templateUrl: 'trip-area-form.component.html',
    providers: [ MTripAreaService ]
})

export class TripAreaFormComponent implements OnInit {
    private subscription = new Subscription();
    public Item: MTripArea = new MTripArea();
    _params: any;
    tripareaOptions = [
        {'id':'1','text':'国内'},
        {'id':'2','text':'海外'},
    ];

    constructor( private _MTripAreaService: MTripAreaService, private _ActivatedRoute: ActivatedRoute, private _ToastrService: ToastrService, private _Location: Location, private _Router: Router ){
        this.subscription = this._ActivatedRoute.params.subscribe((params: any) => {
            this._params = params;
        })
    }

    ngOnInit(){
        switch (this._params.method) {
            case "create":
                // code...
                break;
            case "update":
                let failed = true;
                if(this._params.id != null){
                    failed = false;
                    this._MTripAreaService.getByID(this._params.id).subscribe(res=>{
                        if(res.status == 'success'){
                            this.Item = res.data;
                            if(res.data != null) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    })
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
                this.Item['type'] = e.id;
                break;
        }
    }

    onSubmit(form: NgForm){
        if(form.valid){// Check form is valid
            // Prepare params
            let paramData: URLSearchParams = new URLSearchParams();
            paramData.set('type', this.Item['type'].toString());
            paramData.set('name', this.Item['name']);
            paramData.set('name_e', this.Item['name_e']);

            if(this._params.method == 'update'){ // Check method is update -> TODO: update trip-area
                paramData.set('id', this.Item['id'].toString());
                this._MTripAreaService.save(paramData, this.Item['id']).subscribe(res => {
                    if(res.status == 'success'){
                        this._ToastrService.success('情報を登録しました。');
                    }
                })
            } else if (this._params.method == 'create'){ // Check method is create -> TODO: create a new trip-area
                this._MTripAreaService.save(paramData).subscribe(res => {
                    if(res.status == 'success'){
                        form.reset();
                        this._ToastrService.success('情報を登録しました。');
                    }
                })
            }
        }
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

}