import { RouterModule, Routes } from "@angular/router";

import { ServiceCategoryFormComponent, ServiceCategoryListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '',component: ServiceCategoryFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
			{path: ':id',component: ServiceCategoryFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
		]
	},
	{ path: 'list', component: ServiceCategoryListComponent },
];
export const ChildRouting = RouterModule.forChild(APP_ROUTES);