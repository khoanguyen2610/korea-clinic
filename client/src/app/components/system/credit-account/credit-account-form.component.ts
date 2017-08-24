/*
* @Author: th_le
* @Date:   2016-12-05 11:53:38
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-05 16:15:36
*/

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

import { MObicKariService } from '../../../services';
import { MObicKari } from '../../../models';
import { BreadcrumbComponent } from '../../general';

@Component({
    selector: 'app-credit-account-form',
    templateUrl: 'credit-account-form.component.html',
    providers: [ MObicKariService ]
})

export class CreditAccountFormComponent implements OnInit {
    private subscription: Subscription = new Subscription();
    private _params: any;
    private Item: MObicKari = new MObicKari();

    constructor(private _ActivatedRoute: ActivatedRoute, private _MObicKariService: MObicKariService, private _ToastrService: ToastrService, private _Location: Location, private _Router: Router){
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
                    this._MObicKariService.getByID(this._params.id).subscribe(res => {
                        if(res.status == 'success'){
                            this.Item = res.data;
                            if(res.data == null){
                                failed = true;
                            }
                        }else{
                            failed = true;
                        }
                    })
                }
                if(failed){
                    this._Router.navigate(['system/credit-account']);
                }
                break;
            default:
                this._Router.navigate(['system/credit-account']);
                break;
        }
    }

    /*========================================
      Submit form to update or create item
    ========================================*/
    onSubmit(form: NgForm){
        if(form.valid) {
            // Prepare params
            let paramData: URLSearchParams = new URLSearchParams();
            paramData.set('karikata_name', this.Item['karikata_name']);
            paramData.set('karikata_sokanjokamoku_cd', this.Item['karikata_sokanjokamoku_cd']);
            paramData.set('karikata_hojokamoku_cd', this.Item['karikata_hojokamoku_cd']);
            paramData.set('karikata_hojouchiwakekamoku_cd', this.Item['karikata_hojouchiwakekamoku_cd']);
            paramData.set('karikata_torihikisaki_cd', this.Item['karikata_torihikisaki_cd']);
            paramData.set('karikata_zei_kubun', this.Item['karikata_zei_kubun']);
            paramData.set('karikata_zeikomi_kubun', this.Item['karikata_zeikomi_kubun']);
            paramData.set('karikata_bunseki_cd1', this.Item['karikata_bunseki_cd1']);
            paramData.set('memo', this.Item['memo']);

            if(this._params.method == 'update'){ // Check method is update -> TODO: update
                paramData.set('id', this.Item['id'].toString());
                this._MObicKariService.save(paramData, this.Item['id']).subscribe(res => {
                    if(res.status == 'success'){
                        this._ToastrService.success('情報を登録しました。');
                    }else{

                    }
                })
            } else if(this._params.method == 'create') {
                this._MObicKariService.save(paramData).subscribe( res => {
                    if(res.status == 'success'){ // Check method is create -> TODO: create
                        form.reset(); //reset first status of input
                        this._ToastrService.success('情報を登録しました。');
                    } else {

                    }
                })
            }
        } else {

        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}