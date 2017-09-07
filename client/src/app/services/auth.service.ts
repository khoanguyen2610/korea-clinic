import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class AuthService {
    private session_expired?: any;
    private serviceUrl: string = 'system_auth/';

    constructor( private _Configuration: Configuration,
        private _Http: Http,
        private _Router: Router,
        private _LocalStorageService: LocalStorageService
    ) {
        this.session_expired = this._Configuration.session_expired;
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getCurrent(){
        let current_user_info = this._LocalStorageService.get('current_user_info');
        return current_user_info;
    }

    public login(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'login', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public logout(redirect_url = '/admin/auth/login', callback_uri = null, params = null) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        let response = this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'logout', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .subscribe(
            res => {
                if (res.status == 'success') {
                    this._LocalStorageService.clearAll();
                    if(callback_uri){
                        this._Router.navigate([redirect_url], { queryParams: { callback_uri: callback_uri } });
                    }else{
                        this._Router.navigate([redirect_url]);
                    }
                }
            },
            err => console.error(err)
        );
    }

    public checkIdentity(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'check_identity', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }


    public checkUserSession(callback_uri = null, refill = null){
        let now = new Date().getTime();
        var user_session_start = this._LocalStorageService.get('user_session_start');
        var current_user_info = this._LocalStorageService.get('current_user_info');
        if(now - +user_session_start > this.session_expired*60*60*1000 || !current_user_info) {
            this.logout('/admin/auth/login', callback_uri);
        }else{
            if(refill == true){
                this.refillSession(callback_uri);
                this.checkUserSessionAPI();
            }
        }
    }

    public refillSession(callback_uri = null){
        let now = new Date().getTime();
        var current_user_info = this._LocalStorageService.get('current_user_info');
        if(!current_user_info) {
            this.logout('/admin/auth/login', callback_uri);
        }else{
            this._LocalStorageService.set('user_session_start', now);
        }
    }

    public checkUserSessionAPI(){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        var current_user_info = this._LocalStorageService.get('current_user_info');
        var params: URLSearchParams = new URLSearchParams();
        params.set('current_user_info', JSON.stringify(current_user_info));
        let response = this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'check_session_api', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .subscribe(
            res => {
                //Callback
            },
        );
    }

    public forgot_password(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'forgot_password', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public change_password(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'change_password', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public current_user_department(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'current_user_department', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public change_department(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'change_department', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }


    public clear_session(params = null){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'clear_session', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }




    public checkRoutesPermisstion(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'routes_permission', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}
