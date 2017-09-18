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
		var jcarousel = jQuery('.jcarousel');
		var jcarousel_vertical = jQuery('.jcarousel-vertical');

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

		jcarousel_vertical.jcarousel({
			 vertical: true
		});


		jQuery('.jcarousel-control-prev.vertical')
			.jcarouselControl({
				target: '-=1'
			});

		jQuery('.jcarousel-control-next.vertical')
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
