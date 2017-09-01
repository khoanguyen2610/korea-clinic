import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-detail',
	templateUrl: './news-detail.component.html',
})

export class NewsDetailComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
		console.log('NewsDetailComponent');
	}


	ngOnDestroy() {

	}
}
