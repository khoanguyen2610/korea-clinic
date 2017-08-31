import { RouterModule, Routes } from "@angular/router";

import { GalleryListComponent } from './';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '', component: GalleryListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
