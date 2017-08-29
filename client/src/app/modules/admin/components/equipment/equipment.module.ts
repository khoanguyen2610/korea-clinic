import { NgModule } from '@angular/core';

import { Routing } from './equipment.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { EquipmentFormComponent, EquipmentFormContentComponent, EquipmentListComponent } from './';

@NgModule({
    declarations: [
       EquipmentFormComponent, EquipmentFormContentComponent, EquipmentListComponent
    ],
    imports: [ CoreModule, Routing ],
    entryComponents: [ EquipmentFormContentComponent ]
})
export class EquipmentModule {}