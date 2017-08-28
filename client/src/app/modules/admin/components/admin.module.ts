import { NgModule } from '@angular/core';
import { Routing } from './admin.routing';
import { CoreModule } from '../../../shared/modules/core.module';


import { DashboardComponent, AppointmentComponent } from './';
import { MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent } from './general';


@NgModule({
    declarations: [DashboardComponent, AppointmentComponent, MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent],
    imports: [ CoreModule, Routing ]
})
export class AdminModule {}
