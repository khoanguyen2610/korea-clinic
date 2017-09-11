import { RouterModule, Routes } from "@angular/router";

import { ServiceDetailComponent, ServiceListComponent, BeforeAfterComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '',
		children: [
			{path: '', component: ServiceListComponent},
			{path: '/:category_id/:title', component: ServiceListComponent},
		]
	},
	{ path: 'detail/:item_key/:title', component: ServiceDetailComponent },
	{ path: 'chi-tiet/:item_key/:title', component: ServiceDetailComponent },
	{ path: 'before-after', component: BeforeAfterComponent },
	{ path: 'truoc-sau', component: BeforeAfterComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
