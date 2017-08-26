import { RouterModule, Routes } from "@angular/router";

import { EquipmentFormComponent, EquipmentListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '',component: EquipmentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
			{path: ':id',component: EquipmentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
		]
	},
	{ path: 'list', component: EquipmentListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);