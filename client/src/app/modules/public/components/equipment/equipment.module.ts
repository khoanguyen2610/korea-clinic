import { NgModule } from '@angular/core';
import { Routing } from './equipment.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { EquipmentListComponent } from './';

@NgModule({
    declarations: [
       EquipmentListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class EquipmentModule {}