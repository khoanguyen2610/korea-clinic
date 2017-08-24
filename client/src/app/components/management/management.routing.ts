import { RouterModule, Routes } from "@angular/router";

import { KeiriManagementListComponent, ManagementListComponent, ManagementProposalDetailComponent, ManagementPaymentDetailComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../guards';	

const APP_ROUTES: Routes = [
	//=================== Management Router ======================
	{ path: 'list-form', component: ManagementListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'list-form-payment', component: KeiriManagementListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'proposal/detail', component: ManagementProposalDetailComponent },
	{ path: 'payment/detail/:id', component: ManagementPaymentDetailComponent },
];

export const Routing = RouterModule.forChild(APP_ROUTES);