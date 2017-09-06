import { RouterModule, Routes } from "@angular/router";

import { LoginFormComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'login', component: LoginFormComponent}
];
export const Routing = RouterModule.forChild(APP_ROUTES);
