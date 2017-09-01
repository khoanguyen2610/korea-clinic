import { NgModule } from '@angular/core';

import { Routing } from './news.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { NewsFormComponent, NewsFormContentComponent, NewsListComponent } from './';

@NgModule({
	declarations: [
		NewsFormComponent, NewsFormContentComponent, NewsListComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [ NewsFormContentComponent ]
})
export class NewsModule {}