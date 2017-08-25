import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from './';

const APP_ROUTES: Routes = [
	{ path: '', component: HomeComponent },
];

export const Routing = RouterModule.forChild(APP_ROUTES);
