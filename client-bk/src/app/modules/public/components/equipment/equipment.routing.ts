import { RouterModule, Routes } from "@angular/router";
import { EquipmentListComponent } from './';

const APP_ROUTES: Routes = [
	{ path: '', component: EquipmentListComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
