import { Injectable } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs, Http, Headers } from '@angular/http';

import { Configuration, HttpClient } from '../shared';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class OptionsService {
	private serviceUrl: string = 'options/';
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
	/**
     * Upload files through XMLHttpRequest
     *
     * @param url
     * @param files
     * @returns {Promise<T>}
     */
	public upload(formData: FormData): Promise<any> {
		return new Promise((resolve, reject) => {
			let xhr: XMLHttpRequest = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			};

			OptionsService.setUploadUpdateInterval(500);

			xhr.upload.onprogress = (event) => {
				this.progress = Math.round(event.loaded / event.total * 100);

				this.progressObserver.next(this.progress);
			};

			xhr.open('POST', this._Configuration.apiUrl + this.serviceUrl + 'index/', true);
			xhr.setRequestHeader('Authorization', 'Basic ' + this._Configuration.apiAuth);
			xhr.withCredentials = true;
			xhr.send(formData);
		});
	}

    public getByID(id: number, params = null) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'detail/' + id, {
        	search: params,
            headers: headers,
            withCredentials: true
        })
        .map(res => res.json())
        .catch(this.handleError);
    }

	public getListData(params = null) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this._list_data_URL, {
			search: params,
			headers: headers,
			withCredentials: true
		})
			.map(res => res.json())
			.catch(this.handleError);
	}

	public getListAll(params = null) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this._Configuration.apiUrl + this.serviceUrl + 'list_all', {
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
	/**
	 * Set interval for frequency with which Observable inside Promise will share data with subscribers.
	 *
	 * @param interval
	 */
	private static setUploadUpdateInterval(interval: number): void {
		setInterval(() => { }, interval);
	}
}
