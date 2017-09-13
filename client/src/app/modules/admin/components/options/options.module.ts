import { NgModule } from '@angular/core';

import { Routing } from './options.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { OptionsFormComponent, OptionsFormContentComponent, AboutUsFormComponent, AboutUsFormContentComponent } from './';

@NgModule({
	declarations: [
		OptionsFormComponent, OptionsFormContentComponent, AboutUsFormComponent, AboutUsFormContentComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ OptionsFormContentComponent, AboutUsFormContentComponent ]
})
export class OptionsModule {}
