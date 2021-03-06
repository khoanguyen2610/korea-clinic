import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { Router, ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';


//===================== Import Third Party Component =======================
import { HttpInterceptorModule, HttpInterceptorService } from 'ng-http-interceptor';
import { SelectModule } from 'ng2-select';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DndModule } from 'ng2-dnd';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { CKEditorModule } from 'ng2-ckeditor';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { LocalStorageModule } from 'angular-2-local-storage';
// import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { CustomFormsModule } from 'ng2-validation';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { ToastrModule } from 'ngx-toastr';



import { Configuration, HttpClient } from '../';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../guards';
import { AuthService, ScriptService } from '../../services';

//===================== Import PIPE =======================
import { KeysPipe, FormatDate, FormatDateTime, TruncatePipe, LabelPipe, Br2nl, Nl2br, HTMLEntities, SelectObject, Trim } from '../../pipes';

//===================== Import Directive =======================
import { HelperDirective, EqualValidator, SmallerValidator } from '../../directives/';




import { AdminThemeComponent } from '../../modules/admin/components';
import { PublicThemeComponent } from '../../modules/public/components';


@NgModule({
    declarations: [
        //======================= Import Component =======================
        AdminThemeComponent, PublicThemeComponent,
        //======================= Import Pipe =======================
        KeysPipe, FormatDate, FormatDateTime, TruncatePipe, LabelPipe, Br2nl, Nl2br, HTMLEntities, SelectObject, Trim,
        // FileSelectDirective, FileDropDirective,
        EqualValidator, SmallerValidator, HelperDirective
    ],
    imports: [
        CommonModule,
        RouterModule,
        HttpInterceptorModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ToasterModule,
        Ng2Bs3ModalModule,
        CKEditorModule,
        Ng2AutoCompleteModule,
        TranslateModule,
        DndModule,
        ToastrModule,
        FileUploadModule,
        SlimLoadingBarModule.forRoot(),
        LocalStorageModule.withConfig({
            prefix: 'ss_clinic',
            storageType: 'localStorage'
        })

    ],
    exports: [
        CommonModule,
        AdminThemeComponent, PublicThemeComponent,
        KeysPipe, FormatDate, FormatDateTime, TruncatePipe, LabelPipe, Br2nl, Nl2br, HTMLEntities, SelectObject, Trim,
        // FileSelectDirective, FileDropDirective,
        EqualValidator, SmallerValidator, HelperDirective,
        HttpInterceptorModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ToasterModule,
        Ng2Bs3ModalModule,
        CKEditorModule,
        Ng2AutoCompleteModule,
        TranslateModule,
        DndModule,
        ToastrModule,
        FileUploadModule,
        SlimLoadingBarModule,
    ],
    providers: [
                Configuration,
                HttpClient,
                AuthService,
                ScriptService,
                HttpInterceptorService,
                ChangeRouteGuard,
                AuthPermissionGuard
            ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
        };
    }
}
