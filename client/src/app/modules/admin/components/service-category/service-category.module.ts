import { NgModule } from '@angular/core';

import { Routing } from './service-category.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { ServiceCategoryFormComponent, ServiceCategoryListComponent
     	} from './';

@NgModule({
    declarations: [
       ServiceCategoryFormComponent, ServiceCategoryListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class ServiceCategoryModule {}
