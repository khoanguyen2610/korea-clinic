import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { NewsService } from '../../../../../services';

declare let jQuery: any;

@Component({
	selector: 'app-public-headline',
	templateUrl: './headline.component.html',
	providers: [ NewsService ]
})

export class HeadlineComponent implements OnInit {
	@Input() modules: any;
	@Input() options: any;
	Items: Array<any> = [];
	controller: string = 'tin-tuc';
	language_code: string;

	constructor(
		private _NewsService: NewsService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		//=============== Get Params On Url ===============

		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		this.getListData();
	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('feature_slide_flag', '1');
		params.set('image_resize_width', '270');
		params.set('image_resize_height', '161');
		this._NewsService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				this.Items = res.data;
				setTimeout(() => {
					this.loadCarousel();
				})
			}
		});
	}

	loadCarousel(){
		var jcarousel = jQuery('.jcarousel-vertical-lg');
		jcarousel
			.on('jcarousel:reload jcarousel:create', function () {
				var carousel = jQuery(this),
					width = carousel.innerWidth();

				if (width >= 600) {
					width = width / 3;
				} else if (width >= 350) {
					width = width / 2;
				}

				carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
			})
			.jcarousel({
				wrap: 'circular',
				vertical: true
			});

		jcarousel.jcarouselAutoscroll({
			interval: 2000
		});

		jQuery('.jcarousel-headline-control-prev')
			.jcarouselControl({
				target: '-=1'
			});

		jQuery('.jcarousel-headline-control-next')
			.jcarouselControl({
				target: '+=1'
			});
	}
}