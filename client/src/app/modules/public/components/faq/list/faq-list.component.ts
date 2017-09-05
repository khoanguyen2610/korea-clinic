import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, FaqService, ScriptService } from '../../../../../services';
import { Configuration } from '../../../../../shared';


declare let jacqueline_init_actions: any;
// declare let moment: any;

@Component({
	selector: 'app-public-faq-list',
	templateUrl: './faq-list.component.html',
	providers: [ FaqService ]
})

export class FaqListComponent implements OnInit {

	items: Array<any> = [];
	_params: any;
	queryParams: any;
	language_code: string;

	constructor(
		private _FaqService: FaqService,
		private _ScriptService: ScriptService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		_ScriptService.load('theme_shortcodes', 'widget', 'accordion').then(data => {
            // jacqueline_init_actions();
        }).catch(error => console.log(error));

        this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();

		params.set('language_code', this.language_code);
		params.set('item_status','active');

		this._FaqService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				this.items = res.data;
			}
		})
		console.log('FaqListComponent');
	}


	ngOnDestroy() {

	}
}
