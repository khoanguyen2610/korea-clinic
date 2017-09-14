import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Configuration } from '../../../../../shared';
import { EquipmentService } from '../../../../../services';

declare let jQuery: any;
declare let initEssGrid: any;

@Component({
	selector: 'app-public-home-equipment',
	templateUrl: './equipment.component.html',
	providers: [EquipmentService]
})

export class EquipmentComponent implements OnInit {
	@Input() modules: any;
	Items: Array<any> = [];
	language_code: string = this._Configuration.defaultLang;
	controller: string = 'thiet-bi';
	number_item: number = 4;
	module_name: string = 'equipment';
	width: string = '480';
	width_preview = 'width=1280';
	width_default = 'width=' + this.width;

	constructor(
		private _EquipmentService: EquipmentService,
		private _Configuration: Configuration
	) {
	}

	ngOnInit() {
		this.getListData();
	}

	getListData() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('limit', String(this.number_item));
		params.set('image_resize_width', this.width);
		params.set('item_status', 'active');
		this._EquipmentService.getListAll(params).subscribe(res => {
			if (res.status == 'success') {
				// Process Array include many array with 4 elements
				if (res.data.length) {
					var items = res.data;
					items.forEach(item => {
						var preview_image = item.image_url.replace(this.width_default, this.width_preview);
						item['preview_image'] = preview_image;

					});
					this.Items = items;

					// setTimeout(() => {
					// 	if (jQuery(".esg-grid").length > 0) { initEssGrid(); };
					// }, 200);
				}

			}
		});
	}

	getModuleNameByLang() {
		return this.module_name;
	}
}
