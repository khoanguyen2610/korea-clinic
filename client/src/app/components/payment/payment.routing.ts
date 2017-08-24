import { RouterModule, Routes } from "@angular/router";

import { PaymentFormComponent, PaymentRoutesComponent, PaymentDetailComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../guards';	

const APP_ROUTES: Routes = [
	{ path: 'form/:method',
		children: [
			{path: ':m_request_menu_id/:type',component: PaymentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
			{path: ':id',component: PaymentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
		]
	},
	{ path: 'set-routes/:id', component: PaymentRoutesComponent },
	{ path: 'detail/:id', component: PaymentDetailComponent },
];

export const Routing = RouterModule.forChild(APP_ROUTES);