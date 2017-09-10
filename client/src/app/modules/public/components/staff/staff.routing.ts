import { RouterModule, Routes } from "@angular/router";
import { StaffDetailComponent, StaffListComponent } from './';

const APP_ROUTES: Routes = [
	//=================== Router======================
	{ path: '',
		children: [
			{path: '', component: StaffListComponent},
			{path: ':language_code/:item_key/:title', component: StaffListComponent},
		]
	},
	{ path: 'detail/:language_code/:item_key/:title', component: StaffDetailComponent },
	{ path: 'chi-tiet/:language_code/:item_key/:title', component: StaffDetailComponent },

];
export const Routing = RouterModule.forChild(APP_ROUTES);
