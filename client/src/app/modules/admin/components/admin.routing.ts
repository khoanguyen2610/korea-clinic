import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent, AppointmentComponent, AdminComponent } from './';

const APP_ROUTES: Routes = [


	{ path: '', component: AdminComponent,
		// canActivate: [AuthGuard],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'appointment', component: AppointmentComponent },
			{ path: 'equipment', loadChildren: 'app/modules/admin/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'service', loadChildren: 'app/modules/admin/components/service/service.module#ServiceModule' },
			{ path: 'service-category', loadChildren: 'app/modules/admin/components/service-category/service-category.module#ServiceCategoryModule' },
			{ path: 'news', loadChildren: 'app/modules/admin/components/news/news.module#NewsModule' },
			{ path: 'news-category', loadChildren: 'app/modules/admin/components/news-category/news-category.module#NewsCategoryModule' },
			{ path: 'staff', loadChildren: 'app/modules/admin/components/staff/staff.module#StaffModule' },
			{ path: 'slide', loadChildren: 'app/modules/admin/components/slide/slide.module#SlideModule' },
		]
	}
];

export const Routing = RouterModule.forChild(APP_ROUTES);
