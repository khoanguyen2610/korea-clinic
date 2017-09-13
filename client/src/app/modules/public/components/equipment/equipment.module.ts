import { NgModule } from '@angular/core';
import { Routing } from './equipment.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { EquipmentListComponent, EquipmentDetailComponent } from './';

@NgModule({
    declarations: [
		EquipmentListComponent, EquipmentDetailComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class EquipmentModule {}