/*
* @Author: th_le
* @Date:   2016-12-09 08:49:27
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-15 10:00:47
*/

import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { AuthService } from '../../../services';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'forgot-password.component.html',
    providers: [ AuthService ]
})

export class ForgotPasswordComponent {
    mail: string;
    validateErrors = {};

    constructor(private _AuthService: AuthService, private _ToastrService: ToastrService){}

    onSubmit(form: NgForm){
        let paramData: URLSearchParams = new URLSearchParams();
        paramData.set('email', this.mail);

        this._AuthService.forgot_password(paramData).subscribe(res => {
            if(res.status == 'success'){
                form.reset();
                this.validateErrors = {};
                this._ToastrService.success('パスワードをリセットしましたので、メールを確認してくだい。');
            } else {
                this.validateErrors = res.error;
            }
        })
    }
}