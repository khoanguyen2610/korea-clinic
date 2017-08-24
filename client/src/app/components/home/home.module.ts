import { NgModule } from '@angular/core';

import { Routing } from './home.routing';
import { CoreModule } from "../../shared/modules/core.module";

import { HomeComponent, CheckRoutesComponent, ListFormComponent, NotifyHistoryComponent } from './';

@NgModule({
    declarations: [
        HomeComponent, CheckRoutesComponent, ListFormComponent, NotifyHistoryComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class HomeModule {}
