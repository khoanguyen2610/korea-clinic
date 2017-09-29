import { NgModule } from '@angular/core';
import { Routing } from './staff.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { StaffDetailComponent, StaffListComponent } from './';

@NgModule({
    declarations: [
       StaffDetailComponent, StaffListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class StaffModule {}
