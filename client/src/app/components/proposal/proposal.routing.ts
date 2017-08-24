import { RouterModule, Routes } from "@angular/router";

import { ProposalFormComponent, ProposalRoutesComponent, ProposalDetailComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../guards';	

const APP_ROUTES: Routes = [
	//=================== Management Router ======================
	{ path: 'form/:method/:id', component: ProposalFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'set-routes/:id', component: ProposalRoutesComponent },
	{ path: 'detail/:id', component: ProposalDetailComponent },
];

export const Routing = RouterModule.forChild(APP_ROUTES);