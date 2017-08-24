import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MInputTypeService {

    private actionUrl: string;

    constructor( private _Configuration: Configuration, private _Http: Http) {
        
    }

    public getAll() {
        return this._Http.get(this.actionUrl + 'index')
            .map(res => res.json())
            .catch(this.handleError);

    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}
