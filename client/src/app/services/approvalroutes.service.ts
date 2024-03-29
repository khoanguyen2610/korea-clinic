import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ApprovalRoutesService {

    private serviceUrl: string = 'system_approvalroutes/';

    constructor( private _Configuration: Configuration, private _Http: Http) {}

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getMasterRoutes(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'master_routes', {
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
