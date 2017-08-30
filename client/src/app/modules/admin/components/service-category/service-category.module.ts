import { NgModule } from '@angular/core';

import { Routing } from './service-category.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { ServiceCategoryFormComponent, ServiceCategoryListComponent, ServiceCategoryFormContentComponent } from './';

@NgModule({
    declarations: [
		ServiceCategoryFormComponent, ServiceCategoryListComponent, ServiceCategoryFormContentComponent
    ],
    imports: [ CoreModule, Routing ],
	entryComponents: [ServiceCategoryFormContentComponent]
})
export class ServiceCategoryModule {}
