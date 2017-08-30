import { NgModule } from '@angular/core';
import { Routing } from './gallery.routing';
import { CoreModule } from "../../../../shared/modules/core.module";

import { GalleryListComponent } from './';

@NgModule({
    declarations: [
       GalleryListComponent
    ],
    imports: [ CoreModule, Routing ]
})
export class GalleryModule {}