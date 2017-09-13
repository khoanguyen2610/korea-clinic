import { RouterModule, Routes } from "@angular/router";

import { PartnerFormComponent, PartnerListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: PartnerFormComponent },
			{path: ':id', component: PartnerFormComponent },
		]
	},
	{ path: 'list', component: PartnerListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
