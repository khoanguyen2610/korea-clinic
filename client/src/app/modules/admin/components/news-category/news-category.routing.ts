import { RouterModule, Routes } from "@angular/router";

import { NewsCategoryFormComponent, NewsCategoryListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{
		path: 'form/:method',
		children: [
			{ path: '', component: NewsCategoryFormComponent },
			{ path: ':id', component: NewsCategoryFormComponent },
		]
	},
	{ path: 'list', component: NewsCategoryListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
