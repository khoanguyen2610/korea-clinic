import { RouterModule, Routes } from "@angular/router";

import { FaqListComponent } from './';

const APP_ROUTES: Routes = [
	//=================== Payment Router======================
	{ path: '', component: FaqListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
