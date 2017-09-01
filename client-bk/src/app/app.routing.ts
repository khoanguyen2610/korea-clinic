import { RouterModule, Routes } from "@angular/router";
import { TestComponent } from './components/test.component';

const APP_ROUTES: Routes = [
	{ path: '', component: TestComponent },
	//=================== Public Module ======================
	// { path: '', loadChildren: 'app/modules/public/components/public.module#PublicModule' },

	//=================== Admin Module ======================
	// { path: 'admin', loadChildren: 'app/modules/admin/components/admin.module#AdminModule' },
];

export const Routing = RouterModule.forRoot(APP_ROUTES);
