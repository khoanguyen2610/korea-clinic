import { Injectable } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MExpenseItemService {
    private serviceUrl: string = 'master_mexpenseitem/';
    _list_data_URL:string;

    constructor( private _Configuration: Configuration, private _Http: Http) {
        this._list_data_URL = _Configuration.apiUrl + this.serviceUrl + 'list_data';
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getByID(id: any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'index/' + id + '?has_obic_kashi=true', {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public getAll(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'index', {
            search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public save(params, id?:any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'index/' + id, params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

    public delete(id:any){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.delete(this._Configuration.apiUrl + this.serviceUrl + 'index/' + id, {
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
