import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class FormProcessService {

    private serviceUrl: string = 'system_formprocess/';
    _list_data_URL?: string;

    constructor( private _Configuration: Configuration, private _Http: Http) {
        this._list_data_URL = this._Configuration.apiUrl + this.serviceUrl + 'list_form?has_datatable=1';
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getListFormBasedUser(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'list_form_based_user', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public getListForm(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'list_form', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public generateFormButton(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'generate_form_button', {
            search: params,
            headers: headers,
            withCredentials: true
        })
            .map(res => res.json())
            .catch(this.handleError);

    }

    public singleProcess(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'single_process', params, {
            headers: headers,
            withCredentials: true
        })
            .map(res => res.json())
            .catch(this.handleError);

    }

    public multiple_approval(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'multiple_approval', params, {
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
