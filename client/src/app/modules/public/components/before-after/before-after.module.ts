import { NgModule } from '@angular/core';
import { Routing } from './before-after.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { BeforeAfterListComponent } from './';

@NgModule({
    declarations: [
       BeforeAfterListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class BeforeAfterModule {}