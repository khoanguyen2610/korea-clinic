import { NgModule } from '@angular/core';

import { Routing } from './gallery.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { GalleryListComponent, GalleryFormComponent } from './';

@NgModule({
	declarations: [
		GalleryListComponent, GalleryFormComponent
	],
	imports: [ CoreModule, Routing ],
})
export class GalleryModule {}