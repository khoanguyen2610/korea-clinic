import { Injectable } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class TApprovalStatusService {
    private serviceUrl: string = 'tapprovalstatus/';
    _list_data_URL:string;


    /**
     * @type {number}
     */
    private progress: number = 0;

    private progressObserver: any;

    constructor( private _Configuration: Configuration, private _Http: Http) {
        this._list_data_URL = _Configuration.apiUrl + this.serviceUrl + 'list_data';

    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    public getByID(id: number) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'detail/' + id, {
            headers: headers,
            withCredentials: true
        })
            .map(res => res.json())
            .catch(this.handleError);
    }
    
    public setRoutes(params, id?: number) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'set_routes/' + id, params, {
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

    public delete(id: number) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.delete(this._Configuration.apiUrl + this.serviceUrl + 'index/' + id, {
            headers: headers,
            withCredentials: true
        })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * Set interval for frequency with which Observable inside Promise will share data with subscribers.
     *
     * @param interval
     */
    private static setUploadUpdateInterval(interval: number): void {
        setInterval(() => { }, interval);
    }
}
