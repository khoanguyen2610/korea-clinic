import { RouterModule, Routes } from "@angular/router";

import { GalleryListComponent, GalleryFormComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	// =================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: GalleryFormComponent },
			{path: ':id', component: GalleryFormComponent },
		]
	},
	{ path: 'list', component: GalleryListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
