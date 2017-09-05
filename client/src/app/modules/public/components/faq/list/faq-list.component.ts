import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import {  ScriptService } from '../../../../../services';


declare let jacqueline_init_actions: any;
// declare let moment: any;

@Component({
	selector: 'app-public-faq-list',
	templateUrl: './faq-list.component.html',
})

export class FaqListComponent implements OnInit {

	constructor(
		private _ScriptService: ScriptService
	) {
		_ScriptService.load('theme_shortcodes', 'widget', 'accordion').then(data => {
            // jacqueline_init_actions();
        }).catch(error => console.log(error));
	}

	ngOnInit() {
		console.log('FaqListComponent');
	}


	ngOnDestroy() {

	}
}
