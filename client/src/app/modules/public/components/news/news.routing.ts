import { RouterModule, Routes } from "@angular/router";

import { NewsDetailComponent, NewsListComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '',
		children: [
			{path: '', component: NewsListComponent},
			{path: '/:category_id/:title', component: NewsListComponent},
		]
	},
	{ path: 'detail/:item_key/:title', component: NewsDetailComponent },
	{ path: 'chi-tiet/:item_key/:title', component: NewsDetailComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
