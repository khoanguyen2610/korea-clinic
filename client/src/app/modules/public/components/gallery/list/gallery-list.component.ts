import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { GalleryService } from '../../../../../services';


declare let jQuery: any;
declare let initEssGrid: any;

@Component({
	selector: 'app-public-gallery-list',
	templateUrl: './gallery-list.component.html',
	providers: [ GalleryService ]
})

export class GalleryListComponent implements OnInit {

	Items: Array<any> = [];
	language_code: string;
	module_name: string = 'gallery';
	width: string = '480';
	width_preview = 'width=1280';
	width_default = 'width=' + this.width;

	constructor(
		private _GalleryService: GalleryService,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('item_status', 'active');
		params.set('image_resize_width', this.width);
		this._GalleryService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				var items = res.data;
				items.forEach(item => {
					var images = item.image_url;
					var preview_images = [];
					if (images) {
						images.forEach(image => {
							var preview_image = image.replace(this.width_default, this.width_preview);
							preview_images.push(preview_image);
						});
						item['preview_images'] = preview_images;
					}

				});
				this.Items = items;

				setTimeout(() => {
					initEssGrid();
				}, 200);
			}
		});
	}

	getAction(){
		return 'list';
	}

	ngOnDestroy() {

	}
}
