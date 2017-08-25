import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from './';

const APP_ROUTES: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
];

export const Routing = RouterModule.forChild(APP_ROUTES);
