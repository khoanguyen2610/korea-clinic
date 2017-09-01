import { RouterModule, Routes } from "@angular/router";

import { StaffFormComponent, StaffListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: StaffFormComponent },
			{path: ':id', component: StaffFormComponent },
		]
	},
	{ path: 'list', component: StaffListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
