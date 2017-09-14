import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Configuration } from '../../../../shared';


declare let jQuery: any;
declare let window: any;

@Component({
	selector: 'app-public-home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
	modules: any;
	constructor(
		private _TranslateService: TranslateService
	) {

		// Translate Module Service
		this._TranslateService.get('MODULE').subscribe((res: string) => {
			this.modules = res;
		});
	}

	ngOnInit() {

	}

	getAction(){
		return 'home';
	}
}
