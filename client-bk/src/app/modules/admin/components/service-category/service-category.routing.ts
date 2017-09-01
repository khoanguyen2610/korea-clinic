import { RouterModule, Routes } from "@angular/router";

import { ServiceCategoryFormComponent, ServiceCategoryListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '',component: ServiceCategoryFormComponent},
			{path: ':id',component: ServiceCategoryFormComponent},
		]
	},
	{ path: 'list', component: ServiceCategoryListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
