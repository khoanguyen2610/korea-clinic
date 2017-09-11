import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from '../../../../../shared';
import { GalleryService } from '../../../../../services';


// declare let $: any;
// declare let moment: any;

@Component({
	selector: 'app-public-gallery-list',
	templateUrl: './gallery-list.component.html',
	providers: [ GalleryService ]
})

export class GalleryListComponent implements OnInit {

	Items: Array<any> = [];
	language_code: string;
	module_name: string = 'gallery';

	constructor(
		private _Configuration: Configuration,
		private _GalleryService: GalleryService,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status', 'active');
		this._GalleryService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				var items = res.data;
				items.forEach(item => {
					var images = JSON.parse(item.image);
					var preview_images = [];
					if (images) {
						images.forEach(image => {
							var preview_image = this._Configuration.base_url_image + this.module_name + '/' + image.filepath;
							preview_images.push(preview_image);
						});
						item['preview_images'] = preview_images;
					}

				});
				console.log(items)
				this.Items = items;
			}
		});
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {

	}
}
