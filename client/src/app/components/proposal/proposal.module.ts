import { NgModule } from '@angular/core';

import { Routing } from './proposal.routing';

import { CoreModule } from "../../shared/modules/core.module";
import { FormModule } from "../../shared/modules/form.module";

import { ProposalFormComponent, ProposalRoutesComponent, ProposalDetailComponent } from './';

@NgModule({
    declarations: [
        ProposalFormComponent, ProposalRoutesComponent, ProposalDetailComponent
    ],
    imports: [ CoreModule, FormModule, Routing ]
})
export class ProposalModule {}
