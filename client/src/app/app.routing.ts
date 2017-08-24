import { RouterModule, Routes } from "@angular/router";

import { LoginComponent, LogoutComponent, ForgotPasswordComponent, PageNotFoundComponent } from './components/general';
import { HomeComponent, CheckRoutesComponent, ListFormComponent, NotifyHistoryComponent } from './components/home';
import { AuthPermissionGuard, ChangeRouteGuard } from './guards';	

const APP_ROUTES: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },

	//=================== Home | General Router ======================
	{ path: '', loadChildren: 'app/components/home/home.module#HomeModule' },
	
	//=================== Proposal Router | Form 0.2 ======================
	{ path: 'proposal', loadChildren: 'app/components/proposal/proposal.module#ProposalModule' },
	
	//=================== Request Router | Form 0.4 ======================
	{ path: 'payment', loadChildren: 'app/components/payment/payment.module#PaymentModule' },

	//=================== Management Router ======================
	{ path: 'management', loadChildren: 'app/components/management/management.module#ManagementModule' },

	//=================== System Router ======================
	{ path: 'system', loadChildren: 'app/components/system/system.module#SystemModule' },

	//=================== Page Not Found Router ======================
	{ path: '**', component: PageNotFoundComponent },
];

export const Routing = RouterModule.forRoot(APP_ROUTES);