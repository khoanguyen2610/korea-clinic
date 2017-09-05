import { Injectable } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class SystemGeneralService {
	private serviceUrl: string = 'system_general/';
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
	/**
     * Upload files through XMLHttpRequest
     *
     * @param url
     * @param files
     * @returns {Promise<T>}
     */
	public send_mail_contact(params){
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.post(this._Configuration.apiUrl + this.serviceUrl + 'send_mail_contact', params, {
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
	}


	private handleError(error: Response) {
		return Observable.throw(error.json().error || 'Server error');
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