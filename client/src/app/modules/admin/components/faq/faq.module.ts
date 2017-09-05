import { NgModule } from '@angular/core';

import { Routing } from './faq.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { FaqFormComponent, FaqFormContentComponent, FaqListComponent } from './';

@NgModule({
	declarations: [
		FaqFormComponent, FaqFormContentComponent, FaqListComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ FaqFormContentComponent ]
})
export class FaqModule {}