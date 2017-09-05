import { RouterModule, Routes } from "@angular/router";

import { BeforeAfterListComponent } from './';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '', component: BeforeAfterListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
