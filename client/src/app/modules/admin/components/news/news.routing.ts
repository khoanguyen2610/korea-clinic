import { RouterModule, Routes } from "@angular/router";

import { NewsFormComponent, NewsListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: NewsFormComponent },
			{path: ':id', component: NewsFormComponent },
		]
	},
	{ path: 'list', component: NewsListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
