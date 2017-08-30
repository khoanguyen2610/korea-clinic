import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
	selector: 'app-public-root',
	templateUrl: './public.component.html',
})

export class PublicComponent  {
	constructor() {
		console.log('public componemtdsa');

	}


	ngAfterViewInit(){

	}



}
