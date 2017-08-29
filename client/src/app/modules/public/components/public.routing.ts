import { RouterModule, Routes } from "@angular/router";

import { PublicComponent, HomeComponent } from './';

const APP_ROUTES: Routes = [
	// { path: '', component: PublicComponent },
	{ path: '', component: PublicComponent,
	// 	// canActivate: [AuthGuard],
		children: [
			{ path: '', component: HomeComponent }
		]
	}
];

export const Routing = RouterModule.forChild(APP_ROUTES);
