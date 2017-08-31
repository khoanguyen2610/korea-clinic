import { NgModule } from '@angular/core';
import { Routing } from './faq.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { FaqListComponent } from './';

@NgModule({
    declarations: [
       FaqListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class FaqModule {}