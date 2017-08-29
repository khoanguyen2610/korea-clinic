import { Component, OnInit } from '@angular/core';
import { AuthService, ScriptService } from '../../../services';
import { BreadcrumbComponent, FooterComponent, HeaderComponent, MainNavComponent } from './general';

@Component({
	selector: 'app-root',
	templateUrl: './admin.component.html',
	providers: [AuthService]
})

export class AdminComponent  {

}