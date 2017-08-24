import { NgModule, ModuleWithProviders } from '@angular/core';



//===================== Import Component =======================
import { CoreModule } from "./core.module";
import { CommentComponent, NavigationFormComponent } from '../../components/general';

@NgModule({
    declarations: [ CommentComponent, NavigationFormComponent ],
    imports: [ CoreModule ],
    exports: [ CommentComponent, NavigationFormComponent ]
})
export class FormModule { }

