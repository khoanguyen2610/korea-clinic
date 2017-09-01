import { NgModule } from '@angular/core';

import { Routing } from './slide.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { SlideFormComponent, SlideFormContentComponent, SlideListComponent } from './';

@NgModule({
	declarations: [
		SlideFormComponent, SlideFormContentComponent, SlideListComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ SlideFormContentComponent ]
})
export class SlideModule {}