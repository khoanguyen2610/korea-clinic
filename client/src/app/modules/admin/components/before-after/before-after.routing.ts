import { RouterModule, Routes } from "@angular/router";

import { BeforeAfterFormComponent, BeforeAfterListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: BeforeAfterFormComponent},
			{path: ':id', component: BeforeAfterFormComponent},
		]
	},
	{ path: 'list', component: BeforeAfterListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
