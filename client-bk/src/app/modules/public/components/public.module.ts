import { NgModule } from '@angular/core';
import { Routing } from './public.routing';
import { CoreModule } from "../../../shared/modules/core.module";


import { PublicComponent, HomeComponent, SlideComponent, ServiceComponent, EmployeeComponent, EquipmentComponent, PartnerComponent,
		NewsComponent, GalleryComponent, AboutUsComponent, ContactComponent
		} from './';
import { HeaderComponent, HeaderMobileComponent, FormContactComponent, ChatComponent, FooterComponent } from './general';

@NgModule({
    declarations: [PublicComponent, HomeComponent, SlideComponent, ServiceComponent, EmployeeComponent, EquipmentComponent, PartnerComponent,
    				NewsComponent, GalleryComponent, AboutUsComponent, ContactComponent,
    				HeaderComponent, HeaderMobileComponent, FormContactComponent, ChatComponent, FooterComponent],
    imports: [ CoreModule, Routing ]
})
export class PublicModule {}
