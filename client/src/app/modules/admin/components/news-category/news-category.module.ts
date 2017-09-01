import { NgModule } from '@angular/core';

import { Routing } from './news-category.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { NewsCategoryFormComponent, NewsCategoryListComponent, NewsCategoryFormContentComponent } from './';

@NgModule({
    declarations: [
		NewsCategoryFormComponent, NewsCategoryListComponent, NewsCategoryFormContentComponent
    ],
    imports: [ CoreModule, Routing ],
	entryComponents: [NewsCategoryFormContentComponent]
})
export class NewsCategoryModule { }
