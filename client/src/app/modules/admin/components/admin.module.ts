import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services';

import { Routing } from './admin.routing';
import { CoreModule } from '../../../shared/modules/core.module';


import { DashboardComponent, AppointmentComponent, AdminComponent, AuthComponent } from './';
import { MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent } from './general';


@NgModule({
	declarations: [AdminComponent, AuthComponent, DashboardComponent, AppointmentComponent, MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent],
    imports: [ CoreModule, Routing ]
})
export class AdminModule {
	constructor(private _Router: Router, private _ActivatedRoute: ActivatedRoute, private _AuthService: AuthService){
        let current_user_info = this._AuthService.getCurrent();
        if(!current_user_info){
            var current_href = window.location.href;
            let current_domain = window.location.origin;
            current_href = current_href.replace(current_domain, '');
            if (current_href.match(/^\/admin\/auth\/login.*/i) == null) {
                window.location.href = current_domain + '/admin/auth/login?callback_uri=' + encodeURIComponent(current_href);
            }
        }
    }
}
