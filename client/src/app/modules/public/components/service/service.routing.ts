import { RouterModule, Routes } from "@angular/router";

import { ServiceDetailComponent, ServiceListComponent, BeforeAfterComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '',
		children: [
			{path: '', component: ServiceListComponent},
			{path: ':language_code/:item_key/:title', component: ServiceListComponent},
		]
	},
	{ path: 'detail/:language_code/:item_key/:title', component: ServiceDetailComponent },
	{ path: 'before-after', component: BeforeAfterComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
