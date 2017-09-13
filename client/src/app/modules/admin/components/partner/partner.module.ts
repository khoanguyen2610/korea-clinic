import { NgModule } from '@angular/core';

import { Routing } from './partner.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { PartnerFormComponent, PartnerFormContentComponent, PartnerListComponent } from './';

@NgModule({
	declarations: [
		PartnerFormComponent, PartnerFormContentComponent, PartnerListComponent
	],
	imports: [ CoreModule, Routing ],
})
export class PartnerModule {}