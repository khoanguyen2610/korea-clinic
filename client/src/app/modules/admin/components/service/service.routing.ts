import { RouterModule, Routes } from "@angular/router";

import { ServiceFormComponent, ServiceListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: ServiceFormComponent},
			{path: ':id', component: ServiceFormComponent},
		]
	},
	{ path: 'list', component: ServiceListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
