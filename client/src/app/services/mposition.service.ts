import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class MPositionService {

    private serviceUrl: string = 'master_mposition/';
    list_data_url?: string;

    constructor(private _Configuration: Configuration, private _Http: Http) {
        this.list_data_url = this._Configuration.apiUrl + this.serviceUrl + 'list_data';
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getAll(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'index', {
            search: params,
            headers: headers,
            withCredentials: true
        }).map(res => res.json()).catch(this.handleError);
    }

    public getLimitApprovalForm() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'limit_approval_form', {
            headers: headers,
            withCredentials: true
        }).map(res => res.json()).catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}
