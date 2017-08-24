import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MApprovalMenuService {

    private serviceUrl: string = 'master_mapprovalmenu/';
    _list_data_URL?: string;

    constructor( private _Configuration: Configuration, private _Http: Http) {
        this._list_data_URL = this._Configuration.apiUrl + this.serviceUrl + 'list_data';
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getByID(id: number) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'index/' + id, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public getEnableStartDate(id: number, menu_type: any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'route_enable_start_date?m_menu_id=' + id + '&menu_type=' + menu_type, {
            headers: headers,
            withCredentials: true
        })
            .map(res => res.json())
            .catch(this.handleError);

    }

    public getListUserRoute(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'list_user_route', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public exportListApprovalMenu(params = null) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'export_list_approval_menu', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    public save(params, id?:number) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'index/' + id, params, {
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
