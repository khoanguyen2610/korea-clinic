import { NgModule } from '@angular/core';

import { Routing } from './gallery.routing';

import { CoreModule } from "../../../../shared/modules/core.module";

import { GalleryListComponent, GalleryFormComponent, GalleryFormContentComponent } from './';

@NgModule({
	declarations: [
		GalleryListComponent, GalleryFormComponent, GalleryFormContentComponent
	],
	imports: [ CoreModule, Routing ],
	entryComponents: [GalleryFormContentComponent]
})
export class GalleryModule {}