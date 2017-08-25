import { NgModule } from '@angular/core';
import { Routing } from './admin.routing';
import { CoreModule } from '../../../shared/modules/core.module';


import { DashboardComponent } from './';
import { MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent } from './general';

@NgModule({
    declarations: [DashboardComponent, MainNavComponent, HeaderComponent, FooterComponent, BreadcrumbComponent],
    imports: [ CoreModule, Routing ]
})
export class AdminModule {}
