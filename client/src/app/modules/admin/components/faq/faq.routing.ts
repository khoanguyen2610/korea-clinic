import { RouterModule, Routes } from "@angular/router";

import { FaqFormComponent, FaqListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: FaqFormComponent},
			{path: ':id', component: FaqFormComponent},
		]
	},
	{ path: 'list', component: FaqListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
