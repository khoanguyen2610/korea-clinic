import { NgModule } from '@angular/core';

import { Routing } from './management.routing';

import { CoreModule } from "../../shared/modules/core.module";
import { FormModule } from "../../shared/modules/form.module";

import { KeiriManagementListComponent, ManagementListComponent, ManagementProposalDetailComponent,
         ManagementPaymentDetailComponent, ManagementPaymentTransportDetailComponent, ManagementPaymentPurchaseDetailComponent,
         ManagementPaymentDietaryDetailComponent, ManagementPaymentTravelDetailComponent, ManagementPaymentCostDetailComponent,
         ManagementPaymentPreTravelDetailComponent
     } from './';

@NgModule({
    declarations: [
        KeiriManagementListComponent, ManagementListComponent, ManagementProposalDetailComponent,
        ManagementPaymentDetailComponent, ManagementPaymentTransportDetailComponent, ManagementPaymentPurchaseDetailComponent,
        ManagementPaymentDietaryDetailComponent, ManagementPaymentTravelDetailComponent, ManagementPaymentCostDetailComponent,
        ManagementPaymentPreTravelDetailComponent
    ],
    imports: [ CoreModule, FormModule, Routing ]
})
export class ManagementModule {}
