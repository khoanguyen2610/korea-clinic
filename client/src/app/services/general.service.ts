import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GeneralService {

    private serviceUrl: string = 'system_general/';

    constructor( private _Configuration: Configuration, private _Http: Http) {}

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getBreadCrumb(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'breadcrumb', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public getDepartmentMenu(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'department_menu', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public getRequestMenu(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'request_menu', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public dowloadForm(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + 'system_general/download_form_attachment', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public exportFormPDF(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + 'system_general/export_form_pdf', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public exportFormProcess(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + 'system_general/export_form_process', {
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
