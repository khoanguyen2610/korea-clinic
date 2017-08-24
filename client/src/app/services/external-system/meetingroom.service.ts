import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MeetingRoomService {

    constructor( private _Configuration: Configuration, private _Http: Http) {}

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

    //Create user information to Meeting Room
    public sync_create_user(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.meetingroom_server + 'api/vws/create_account', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);

    }

    //Update user information to Meeting Room
    public sync_update_user(params) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.meetingroom_server + 'api/vws/update_account', params, {
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
