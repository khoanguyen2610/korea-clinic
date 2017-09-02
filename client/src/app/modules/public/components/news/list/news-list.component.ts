import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { AuthService, NewsService } from '../../../../../services';

// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-news-list',
	templateUrl: './news-list.component.html',
	providers: [ NewsService ]
})

export class NewsListComponent implements OnInit {
	controller: string = 'tin-tuc';

	constructor(
		private _NewsService: NewsService,
	) {

	}

	ngOnInit() {
		console.log('NewsListComponent');
	}


	ngOnDestroy() {

	}
}
