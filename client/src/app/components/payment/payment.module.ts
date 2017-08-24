import { NgModule } from '@angular/core';

import { Routing } from './payment.routing';

import { CoreModule } from "../../shared/modules/core.module";
import { FormModule } from "../../shared/modules/form.module";

import { PaymentFormComponent, PaymentTransportListComponent, PaymentCostListComponent,
         PaymentDietaryFormComponent, PaymentDietaryLocalFormComponent, PaymentPurchaseListComponent,
         PaymentPurchaseDietaryListComponent, PaymentTravelFormComponent, PaymentPreTravelFormComponent, PaymentRoutesComponent,
         PaymentDetailComponent, PaymentDietaryDetailComponent, PaymentCostDetailComponent, PaymentTransportDetailComponent,
         PaymentPreTravelDetailComponent, PaymentPurchaseDetailComponent, PaymentTravelDetailComponent
     	} from './';

@NgModule({
    declarations: [
        PaymentFormComponent, PaymentTransportListComponent, PaymentCostListComponent,
        PaymentDietaryFormComponent, PaymentDietaryLocalFormComponent, PaymentPurchaseListComponent,
        PaymentPurchaseDietaryListComponent, PaymentTravelFormComponent, PaymentPreTravelFormComponent, PaymentRoutesComponent,
        PaymentDetailComponent, PaymentDietaryDetailComponent, PaymentCostDetailComponent, PaymentTransportDetailComponent,
        PaymentPreTravelDetailComponent, PaymentPurchaseDetailComponent, PaymentTravelDetailComponent
    ],
    imports: [ CoreModule, FormModule, Routing ]
})
export class PaymentModule {}
