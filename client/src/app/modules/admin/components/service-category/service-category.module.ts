import { NgModule } from '@angular/core';

import { ChildRouting } from './service-category.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { ServiceCategoryFormComponent, ServiceCategoryListComponent
     	} from './';

@NgModule({
    declarations: [
       ServiceCategoryFormComponent, ServiceCategoryListComponent
    ],
    imports: [ CoreModule, ChildRouting ]
})
export class ServiceCategoryModule {}