import { NgModule } from '@angular/core';
import { Routing } from './public.routing';
import { CoreModule } from "../../../shared/modules/core.module";


import { HomeComponent } from './';

@NgModule({
    declarations: [HomeComponent],
    imports: [ CoreModule, Routing ]
})
export class PublicModule {}
