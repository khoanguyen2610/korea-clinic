import { RouterModule, Routes } from "@angular/router";

import {
		ApprovalDepartmentListComponent, ApprovalMenuListComponent, ApprovalDepartmentMenuListComponent,
		MenuMasterListComponent, MenuMasterFormComponent,
		NotifyListComponent, NotifyFormComponent,
		MenuPaymentListComponent, MenuPaymentFormComponent,
		DepartmentListComponent, DepartmentFormComponent,
		ObicComponent,
		ObicClientListComponent, ObicClientFormComponent,
		ExpenseListComponent, ExpenseFormComponent,
		MailCooperationListComponent, MailCooperationFormComponent,
		UserListComponent, ImportUserDepartmentListComponent, UserFormComponent,
		CompanyListComponent, CompanyFormComponent,
		BankListComponent, BankFormComponent,
		CheckRoutesListComponent,
		BankBranchListComponent, BankBranchFormComponent,
		TypeFinalizationListComponent,
		CreditAccountListComponent,CreditAccountFormComponent,
		TripBenefitsListComponent, TripAreaFormComponent, TripPerdiemAllowanceFormComponent,
		LogHistoryListComponent, ChangeUserDepartmentFormComponent
	} from './';
import { AuthPermissionGuard, ChangeRouteGuard } from '../../guards';	

const APP_ROUTES: Routes = [
	//=================== System Router ======================
	{ path: 'approval-department', component: ApprovalDepartmentListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'approval-menu', component: ApprovalMenuListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'approval-department-menu', component: ApprovalDepartmentMenuListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'menu-master', component: MenuMasterListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{
		path: 'menu-master/:method',
		children: [{ path: ':id', component: MenuMasterFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{ path: '', component: MenuMasterFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'menu-payment', component: MenuPaymentListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'menu-payment/:method',
		children: [{path: ':id', component: MenuPaymentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: MenuPaymentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'notify', component: NotifyListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'notify/:method',
		children: [{path: ':id', component: NotifyFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: NotifyFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'obic', component: ObicComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'obic-client', component: ObicClientListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'obic-client/:method',
		children: [{path: ':id', component: ObicClientFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: ObicClientFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'mail-cooperation', component: MailCooperationListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{
		path: 'mail-cooperation/:method',
		children: [{ path: ':id', component: MailCooperationFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{ path: '', component: MailCooperationFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'expense', component: ExpenseListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'expense/:method',
		children: [{path: ':id', component: ExpenseFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: ExpenseFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'department', component: DepartmentListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'department/:method',
		children: [{path: ':id', component: DepartmentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard]},
			{path: '', component: DepartmentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'user', component: UserListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'user/:method',
		children: [{path: ':id', component: UserFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: UserFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'change-user-department', component: ChangeUserDepartmentFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'import-user-department', component: ImportUserDepartmentListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'company', component: CompanyListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'company/:method',
		children: [
			{path: ':id', component: CompanyFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: CompanyFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'bank', component: BankListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'bank/:method',
		children: [
			{path: ':id', component: BankFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: BankFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'type-finalization', component: TypeFinalizationListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'check-routes', component: CheckRoutesListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'bank-branch', component: BankBranchListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'bank-branch/:method',
		children: [
			{path: ':id', component: BankBranchFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: BankBranchFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'check-routes', component: CheckRoutesListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'credit-account', component: CreditAccountListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'credit-account/:method',
		children: [
			{path: ':id', component: CreditAccountFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: CreditAccountFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'trip-benefits', component: TripBenefitsListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
	{ path: 'trip-area/:method',
		children: [
			{path: ':id', component: TripAreaFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: TripAreaFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'trip-perdiem-allowance/:method',
		children: [
			{path: ':id', component: TripPerdiemAllowanceFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
			{path: '', component: TripPerdiemAllowanceFormComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },
		]
	},
	{ path: 'log-history', component: LogHistoryListComponent, canActivate: [AuthPermissionGuard, ChangeRouteGuard] },

];

export const Routing = RouterModule.forChild(APP_ROUTES);