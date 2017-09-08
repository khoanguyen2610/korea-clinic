import { NgModule } from '@angular/core';

import { Routing } from './before-after.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { BeforeAfterFormComponent, BeforeAfterFormContentComponent, BeforeAfterListComponent } from './';

@NgModule({
	declarations: [
		BeforeAfterFormComponent, BeforeAfterFormContentComponent, BeforeAfterListComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ BeforeAfterFormContentComponent ]
})
export class BeforeAfterModule {}