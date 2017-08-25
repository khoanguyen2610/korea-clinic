import { Injectable } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class EquipmentService {
	private serviceUrl: string = 'equipment/';
	_list_data_URL:string;

    /**
     * @param Observable<number>
     */
	private progress$: Observable<number>;

    /**
     * @type {number}
     */
	private progress: number = 0;

	private progressObserver: any;

	constructor( private _Configuration: Configuration, private _Http: Http) {
		this._list_data_URL = _Configuration.apiUrl + this.serviceUrl + 'list_data';

		this.progress$ = Observable.create(observer => {
	    	this.progressObserver = observer
		}).share();
	}

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Basic ' + this._Configuration.apiAuth);
    }

	/**
	 * @returns {Observable<number>}
	 */
	public getObserver(): Observable<number> {
		return this.progress$;
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

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}