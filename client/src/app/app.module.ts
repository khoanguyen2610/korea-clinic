import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Routing } from './app.routing';
import { AuthService } from './services';

import { DndModule } from 'ng2-dnd';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FacebookModule } from 'ng2-facebook-sdk';

import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

//===================== Import Core Module =======================
import { CoreModule } from "./shared/modules/core.module";

//===================== Import Component =======================
import { AppComponent } from './app.component';

export function createTranslateLoader(_Http: Http) {
    return new TranslateStaticLoader(_Http, './assets/i18n', '.json');
}

@NgModule({
    declarations: [ AppComponent ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
        DndModule.forRoot(),
        ToastrModule.forRoot(),
        CoreModule.forRoot(),
        FacebookModule.forRoot(),
        Routing
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private _Router: Router, private _ActivatedRoute: ActivatedRoute, private _AuthService: AuthService){
        // let current_user_info = this._AuthService.getCurrent();
        // if(!current_user_info){
        //     var current_href = window.location.href;
        //     let current_domain = window.location.origin;
        //     current_href = current_href.replace(current_domain, '');
        //     if (current_href.match(/^\/login.*/i) == null && current_href.match(/^\/logout.*/i) == null && current_href.match(/^\/forgot\-password.*/i) == null) {
        //         window.location.href = current_domain + '/login?callback_uri=' + encodeURIComponent(current_href);
        //     }
        // }
    }
}
