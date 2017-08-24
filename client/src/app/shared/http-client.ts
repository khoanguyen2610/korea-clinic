import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
declare var $: any;

@Injectable()
export class HttpClient extends Http {
    public pendingRequests = 0;
    public showLoading: boolean = false;

    constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        this.pendingRequests++;
        return observable
            // .catch((err, source) => {
            //     console.log("Caught error: " + err);
            // })
            .do((res: Response) => {
                this.turnOnLoading();
            }, (err: any) => {
                this.turnOffLoading();
            })
            .finally(() => {
                var timer = Observable.timer(500);
                timer.subscribe(t => {
                    this.turnOffLoading();
                });
            });
    }

    private turnOnLoading() {
        if (!this.showLoading) {
            this.showLoading = true;
            $('.loading').show();
        }
        this.showLoading = true;
    }

    private turnOffLoading() {
        this.pendingRequests--;
        if (this.pendingRequests <= 0) {
            if (this.showLoading) {
                $('.loading').hide();
            }
            this.showLoading = false;
        }
    }
}
