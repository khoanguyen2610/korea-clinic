import { RouterModule, Routes } from "@angular/router";

import { PublicComponent, HomeComponent, AboutUsComponent, ContactComponent } from './';

const APP_ROUTES: Routes = [
	{ path: '', component: PublicComponent,
		children: [
			{ path: '', component: HomeComponent },
			{ path: 'about-us', component: AboutUsComponent },
			{ path: 've-chung-toi', component: AboutUsComponent },
			{ path: 'contact', component: ContactComponent },
			{ path: 'lien-he', component: ContactComponent },
			{ path: 'equipment', loadChildren: 'app/modules/public/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'trang-thiet-bi', loadChildren: 'app/modules/public/components/equipment/equipment.module#EquipmentModule' },
			{ path: 'faq', loadChildren: 'app/modules/public/components/faq/faq.module#FaqModule' },
			{ path: 'gallery', loadChildren: 'app/modules/public/components/gallery/gallery.module#GalleryModule' },
			{ path: 'thu-vien-anh', loadChildren: 'app/modules/public/components/gallery/gallery.module#GalleryModule' },
			{ path: 'news', loadChildren: 'app/modules/public/components/news/news.module#NewsModule' },
			{ path: 'tin-tuc', loadChildren: 'app/modules/public/components/news/news.module#NewsModule' },
			{ path: 'service', loadChildren: 'app/modules/public/components/service/service.module#ServiceModule' },
			{ path: 'dich-vu', loadChildren: 'app/modules/public/components/service/service.module#ServiceModule' },
			{ path: 'expert', loadChildren: 'app/modules/public/components/staff/staff.module#StaffModule' },
			{ path: 'chuyen-gia', loadChildren: 'app/modules/public/components/staff/staff.module#StaffModule' },
		]
	}
];

export const Routing = RouterModule.forChild(APP_ROUTES);
