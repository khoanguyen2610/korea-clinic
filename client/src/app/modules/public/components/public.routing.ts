import { RouterModule, Routes } from "@angular/router";

import { PublicComponent, HomeComponent, AboutUsComponent, ContactComponent } from './';

const APP_ROUTES: Routes = [
	{ path: '', component: PublicComponent,
		children: [
			{ path: '', component: HomeComponent },
			{ path: 'about-us', component: AboutUsComponent },
			{ path: 'contact', component: ContactComponent },
			{ path: 'before-after', loadChildren: 'app/modules/public/components/before-after/before-after.module#BeforeAfterModule' },
			{ path: 'equipment', loadChildren: 'app/modules/public/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'thiet-bi', loadChildren: 'app/modules/public/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'faq', loadChildren: 'app/modules/public/components/faq/faq.module#FaqModule' },
			{ path: 'gallery', loadChildren: 'app/modules/public/components/gallery/gallery.module#GalleryModule' },
			{ path: 'news', loadChildren: 'app/modules/public/components/news/news.module#NewsModule' },
			{ path: 'tin-tuc', loadChildren: 'app/modules/public/components/news/news.module#NewsModule' },
			{ path: 'service', loadChildren: 'app/modules/public/components/service/service.module#ServiceModule' },
			{ path: 'dich-vu', loadChildren: 'app/modules/public/components/service/service.module#ServiceModule' },
			{ path: 'staff', loadChildren: 'app/modules/public/components/staff/staff.module#StaffModule' },
			{ path: 'nhan-vien', loadChildren: 'app/modules/public/components/staff/staff.module#StaffModule' },
		]
	}
];

export const Routing = RouterModule.forChild(APP_ROUTES);
