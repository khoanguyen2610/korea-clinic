import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent, AppointmentComponent, AdminComponent, AuthComponent } from './';

const APP_ROUTES: Routes = [
	{ path: '', component: AdminComponent,
		// canActivate: [AuthGuard],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'appointment', component: AppointmentComponent },
			{ path: 'before-after', loadChildren: 'app/modules/admin/components/before-after/before-after.module#BeforeAfterModule' },
			{ path: 'equipment', loadChildren: 'app/modules/admin/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'faq', loadChildren: 'app/modules/admin/components/faq/faq.module#FaqModule' },
			{ path: 'gallery', loadChildren: 'app/modules/admin/components/gallery/gallery.module#GalleryModule' },
			{ path: 'service', loadChildren: 'app/modules/admin/components/service/service.module#ServiceModule' },
			{ path: 'service-category', loadChildren: 'app/modules/admin/components/service-category/service-category.module#ServiceCategoryModule' },
			{ path: 'news', loadChildren: 'app/modules/admin/components/news/news.module#NewsModule' },
			{ path: 'news-category', loadChildren: 'app/modules/admin/components/news-category/news-category.module#NewsCategoryModule' },
			{ path: 'staff', loadChildren: 'app/modules/admin/components/staff/staff.module#StaffModule' },
			{ path: 'slide', loadChildren: 'app/modules/admin/components/slide/slide.module#SlideModule' },
			{ path: 'options', loadChildren: 'app/modules/admin/components/options/options.module#OptionsModule' },
			{ path: 'partner', loadChildren: 'app/modules/admin/components/partner/partner.module#PartnerModule' },
			// { path: 'auth', loadChildren: 'app/modules/admin/components/auth/auth.module#AuthModule' },
		]
	},
	{ path: 'auth', component: AuthComponent,
		// canActivate: [AuthGuard],
		children: [
			{ path: '', loadChildren: 'app/modules/admin/components/auth/auth.module#AuthModule' },
		]
	},
];

export const Routing = RouterModule.forChild(APP_ROUTES);
