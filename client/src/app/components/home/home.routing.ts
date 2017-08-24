import { RouterModule, Routes } from "@angular/router";

import { HomeComponent, CheckRoutesComponent, ListFormComponent, NotifyHistoryComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../guards';	

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent, canActivate: [ChangeRouteGuard] },
	{ path: 'check-routes', component: CheckRoutesComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'list-form', component: ListFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'notify-history', component: NotifyHistoryComponent }
];

export const Routing = RouterModule.forChild(APP_ROUTES);