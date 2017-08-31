import { NgModule } from '@angular/core';
import { Routing } from './news.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { NewsDetailComponent, NewsListComponent } from './';

@NgModule({
    declarations: [
       NewsDetailComponent, NewsListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class NewsModule {}