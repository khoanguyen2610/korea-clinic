import { RouterModule, Routes } from "@angular/router";

import { OptionsFormComponent, OptionsFormContentComponent, AboutUsFormComponent, AboutUsFormContentComponent } from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../../../guards';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: 'form/:method',
		children: [
			{path: '', component: OptionsFormComponent},
			{path: ':id', component: OptionsFormComponent},
		]
	},

	{ path: 'about-us', component: AboutUsFormComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
