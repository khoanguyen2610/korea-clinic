import { RouterModule, Routes } from "@angular/router";
import { StaffDetailComponent, StaffListComponent } from './';

const APP_ROUTES: Routes = [
	//=================== Router======================
	{ path: '', component: StaffListComponent },
	{ path: 'detail', component: StaffDetailComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
