import { NgModule } from '@angular/core';
import { Routing } from './service.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { ServiceDetailComponent, ServiceListComponent, BeforeAfterComponent } from './';

@NgModule({
    declarations: [
       ServiceDetailComponent, ServiceListComponent, BeforeAfterComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class ServiceModule {}
