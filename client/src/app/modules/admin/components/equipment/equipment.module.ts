import { NgModule } from '@angular/core';

import { Routing } from './equipment.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { EquipmentFormComponent, EquipmentListComponent
     	} from './';

@NgModule({
    declarations: [
       EquipmentFormComponent, EquipmentListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class EquipmentModule {}