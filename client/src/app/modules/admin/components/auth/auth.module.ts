import { NgModule } from '@angular/core';

import { Routing } from './auth.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { LoginFormComponent } from './';

@NgModule({
	declarations: [
		LoginFormComponent
	],
	imports: [ CoreModule, Routing ]
})
export class AuthModule {}
