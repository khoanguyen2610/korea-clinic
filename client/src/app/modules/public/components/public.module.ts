import { NgModule } from '@angular/core';
import { Routing } from './public.routing';
import { CoreModule } from "../../../shared/modules/core.module";


import { PublicComponent, HomeComponent, SlideComponent, ServiceComponent, EmployeeComponent } from './';
import { HeaderComponent, HeaderMobileComponent } from './general';

@NgModule({
    declarations: [PublicComponent, HomeComponent, SlideComponent, ServiceComponent, EmployeeComponent, HeaderComponent, HeaderMobileComponent],
    imports: [ CoreModule, Routing ]
})
export class PublicModule {}
