import { NgModule } from '@angular/core';
import { Routing } from './public.routing';
import { CoreModule } from "../../../shared/modules/core.module";


import { PublicComponent, HomeComponent, SlideComponent, ServiceComponent, StaffComponent, EquipmentComponent, PartnerComponent,
		NewsComponent, GalleryComponent, AboutUsComponent, ContactComponent
		} from './';
import { HeaderComponent, HeaderMobileComponent, FormContactComponent, ChatComponent, FooterComponent, NavigationComponent, SocialAppComponent } from './general';

@NgModule({
    declarations: [PublicComponent, HomeComponent, SlideComponent, ServiceComponent, StaffComponent, EquipmentComponent, PartnerComponent,
		NewsComponent, GalleryComponent, AboutUsComponent, ContactComponent, NavigationComponent, NavigationComponent,
    				HeaderComponent, HeaderMobileComponent, FormContactComponent, ChatComponent, SocialAppComponent, FooterComponent],
    imports: [ CoreModule, Routing ]
})
export class PublicModule {}
