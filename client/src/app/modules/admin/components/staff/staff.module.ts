import { NgModule } from '@angular/core';

import { Routing } from './staff.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { StaffFormComponent, StaffFormContentComponent, StaffListComponent } from './';

@NgModule({
	declarations: [
		StaffFormComponent, StaffFormContentComponent, StaffListComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ StaffFormContentComponent ]
})
export class StaffModule {}