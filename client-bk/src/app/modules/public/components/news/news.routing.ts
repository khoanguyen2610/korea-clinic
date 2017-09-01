import { RouterModule, Routes } from "@angular/router";

import { NewsDetailComponent, NewsListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '', component: NewsListComponent },
	{ path: 'detail', component: NewsDetailComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);