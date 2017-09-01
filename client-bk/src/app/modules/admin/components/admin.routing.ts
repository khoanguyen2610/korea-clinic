import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent, AppointmentComponent, AdminComponent } from './';

const APP_ROUTES: Routes = [


	{ path: '', component: AdminComponent,
		// canActivate: [AuthGuard],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'appointment', component: AppointmentComponent },
			{ path: 'equipment', loadChildren: 'app/modules/admin/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'service-category', loadChildren: 'app/modules/admin/components/service-category/service-category.module#ServiceCategoryModule' }
		]
	}
];

export const Routing = RouterModule.forChild(APP_ROUTES);
