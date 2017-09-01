/*
* @Author: th_le
* @Date:   2016-12-15 10:54:40
* @Last Modified by:   th_le
* @Last Modified time: 2016-12-15 13:51:09
*/

import { Injectable } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()

export class TLogHistoryService {
  private serviceUrl: string = 'tloghistory/';
    _list_data_URL?: string;

    constructor( private _Configuration: Configuration, private _Http: Http ) {
        this._list_data_URL = this._Configuration.apiUrl + this.serviceUrl + 'list_data';
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getListOperation() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'list_operation', {
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