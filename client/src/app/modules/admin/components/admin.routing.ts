import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent, AppointmentComponent } from './';

const APP_ROUTES: Routes = [
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'appointment', component: AppointmentComponent },
];

export const Routing = RouterModule.forChild(APP_ROUTES);
