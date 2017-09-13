import { RouterModule, Routes } from "@angular/router";
import { EquipmentListComponent, EquipmentDetailComponent } from './';

const APP_ROUTES: Routes = [
	{ path: '', component: EquipmentListComponent },
	{ path: 'detail/:item_key/:title', component: EquipmentDetailComponent },
	{ path: 'chi-tiet/:item_key/:title', component: EquipmentDetailComponent },
];
export const Routing = RouterModule.forChild(APP_ROUTES);
