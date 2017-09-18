import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { StaffService } from '../../../../../services';

declare let jQuery: any;
declare let moment: any;
declare var jacqueline_init_actions: any;

@Component({
	selector: 'app-public-home-staff',
	templateUrl: './staff.component.html',
	providers: [StaffService]
})

export class StaffComponent implements OnInit {
	@Input() modules: any;
	Items: Array<any> = [];
	language_code: string;
	number_item: number = 4;
	module_name: string = 'staff';

	constructor(
		private _LocalStorageService: LocalStorageService,
		private _StaffService: StaffService,
		private _Configuration: Configuration,

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
		params.set('image_resize_square', '370');
		params.set('item_status', 'active');
		this._StaffService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				// let data = res.data;
				// let temp = [];

				// let j = 0;
				// let c = res.data.length;
				// for (let i = 0; i < data.length; i++) {
				// 	if (i && (i % this.number_item == 0)) {
				// 		this.Items.push(temp);
				// 		temp = [];
				// 	}

				// 	temp.push(data[i]);

				// 	j = i + 1;
				// 	if ((c == j) && (j % this.number_item != 0)) {
				// 		if (this.number_item > temp.length){
				// 			temp = temp.concat(data.slice(0, this.number_item - temp.length));
				// 		}
				// 		this.Items.push(temp);
				// 	}

				// }

				this.Items = res.data;

				setTimeout(() => {
					jacqueline_init_actions();
					jQuery(window).resize();
					this.loadCarousel();
				}, 200);

			}
		});
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

	getModuleNameByLang() {
		return this.module_name;
	}
}
