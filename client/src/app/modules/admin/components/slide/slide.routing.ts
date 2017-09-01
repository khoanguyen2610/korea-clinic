import { RouterModule, Routes } from "@angular/router";

import { SlideFormComponent, SlideListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: SlideFormComponent },
			{path: ':id', component: SlideFormComponent },
		]
	},
	{ path: 'list', component: SlideListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
