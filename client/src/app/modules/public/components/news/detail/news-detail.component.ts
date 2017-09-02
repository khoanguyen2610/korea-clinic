import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, NewsService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-detail',
	templateUrl: './news-detail.component.html',
	providers: [ NewsService ]
})

export class NewsDetailComponent implements OnInit {
	private subscription: Subscription;

	constructor(
		private _NewsService: NewsService,
	) {

	}

	ngOnInit() {
		console.log('NewsDetailComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
