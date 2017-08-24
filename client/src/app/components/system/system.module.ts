import { NgModule } from '@angular/core';

import { Routing } from './system.routing';

import { CoreModule } from "../../shared/modules/core.module";

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

@NgModule({
    declarations: [
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
    ],
    imports: [ CoreModule, Routing ]
})
export class SystemModule {}
