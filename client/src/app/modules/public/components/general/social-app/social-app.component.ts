import { Component, OnInit, Input } from '@angular/core';

declare let jQuery: any;

@Component({
	selector: 'app-public-social-app',
	templateUrl: './social-app.component.html',
})

export class SocialAppComponent implements OnInit {
	@Input() options: any;
	apps = ['whatsapp','kakaoTalk','line','skype','facebook','instagram'];

	constructor() { }

	ngOnInit() {
		this.loadCarousel();
	}

	loadCarousel(){
		var jcarousel = jQuery('.jcarousel');

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
				wrap: 'circular'
			});

		jQuery('.jcarousel-control-prev')
			.jcarouselControl({
				target: '-=1'
			});

		jQuery('.jcarousel-control-next')
			.jcarouselControl({
				target: '+=1'
			});

		jQuery('.jcarousel-pagination')
			.on('jcarouselpagination:active', 'a', function() {
				jQuery(this).addClass('active');
			})
			.on('jcarouselpagination:inactive', 'a', function() {
				jQuery(this).removeClass('active');
			})
			.on('click', function(e) {
			    e.preventDefault();
			})
			.jcarouselPagination({
				perPage: 1,
				item: function(page) {
					return '<a href="#' + page + '">' + page + '</a>';
				}
			});
	}

}

