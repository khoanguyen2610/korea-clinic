import { Component, OnInit, Input } from '@angular/core';

declare let jQuery: any;

@Component({
	selector: 'app-public-social-app',
	templateUrl: './social-app.component.html',
})

export class SocialAppComponent implements OnInit {
	@Input() options: any;
	apps = ['facebook', 'instagram', 'viber', 'zalo', 'kakaotalk', 'whatsap', 'line',  'pinterest', 'twitter'];

	constructor() { }

	ngOnInit() {
		this.loadCarousel();
	}

	loadCarousel(){
		var jcarousel = jQuery('.jcarousel-vertical');
		var jcarousel_social = jQuery('.jcarousel-social');
		//
		jcarousel
			.on('jcarousel:reload jcarousel:create', function () {
				var carousel = jQuery(this),
					width = carousel.innerWidth();

				if (width >= 600) {
					width = width / 4;
				} else if (width >= 350) {
					width = width / 3;
				}

				carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
			})
			.jcarousel({
				wrap: 'circular',
				vertical: true
			});
		jcarousel_social
			.on('jcarousel:reload jcarousel:create', function () {
				var carousel = jQuery(this),
					width = carousel.innerWidth();

				if (width >= 600) {
					width = width / 4;
				} else if (width >= 350) {
					width = width / 3;
				}

				carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
			})
			.jcarousel({
				wrap: 'circular',
			});
		jQuery('.jcarousel-vertical-control-prev')
			.jcarouselControl({
				target: '-=1'
			});

		jQuery('.jcarousel-vertical-control-next')
			.jcarouselControl({
				target: '+=1'
			});


		jQuery('.jcarousel-social-control-next')
			.jcarouselControl({
				target: '-=1'
			});

		jQuery('.jcarousel-social-control-prev')
			.jcarouselControl({
				target: '+=1'
			});
	}

}
