import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { ServiceCategoryService } from '../../../../../services';


declare let jQuery: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-service',
	templateUrl: './service.component.html',
	providers: [ ServiceCategoryService ]
})

export class ServiceComponent implements OnInit {
	@Input() modules: any;
	Items: Array<any> = [];
	controller: string = 'dich-vu';
	language_code: string;
	total_item: number = 0;

	constructor(
		private _ServiceCategoryService: ServiceCategoryService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		//=============== Get Params On Url ===============
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit(){
		this.getListData();
	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('recursive', 'false');
		params.set('language_code', this.language_code);
		params.set('image_resize_width', '480');
		params.set('item_status', 'active');
		params.set('limit', '3');
		this._ServiceCategoryService.getListAll(params).subscribe(res => {

			if(res.status == 'success'){
				this.Items = res.data;
				this.total_item = res.total;

				setTimeout(() => {
					this.loadCarousel();
				}, 200);
			}
		});
	}

	loadCarousel(){
		var jcarousel = jQuery('.jcarousel-service');

		jcarousel
			.on('jcarousel:reload jcarousel:create', function () {
				var carousel = jQuery(this),
					width = carousel.innerWidth();
				if (width >= 600) {
					width = width / 3;
				} else if (width >= 350) {
					width = width / 3;
				}
				carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
			})
			.jcarousel({
				wrap: 'circular',
				vertical: false
			});

		jcarousel.jcarouselAutoscroll({
			interval: 2000
		});

		jQuery('.jcarousel-service-control-next')
			.jcarouselControl({
				target: '-=1'
			});

		jQuery('.jcarousel-service-control-prev')
			.jcarouselControl({
				target: '+=1'
			});
	}


}
