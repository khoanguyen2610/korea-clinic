import { NgModule } from '@angular/core';

import { Routing } from './service.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { ServiceFormComponent, ServiceFormContentComponent, ServiceListComponent } from './';

@NgModule({
	declarations: [
		ServiceFormComponent, ServiceFormContentComponent, ServiceListComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ ServiceFormContentComponent ]
})
export class ServiceModule {}