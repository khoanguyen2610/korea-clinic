import { RouterModule, Routes } from "@angular/router";


const APP_ROUTES: Routes = [
	//=================== Public Module ======================
	{ path: 'home', loadChildren: 'app/modules/public/components/public.module#PublicModule' },

	//=================== Admin Module ======================
	{ path: 'admin', loadChildren: 'app/modules/admin/components/admin.module#AdminModule' },
];

export const Routing = RouterModule.forRoot(APP_ROUTES);
