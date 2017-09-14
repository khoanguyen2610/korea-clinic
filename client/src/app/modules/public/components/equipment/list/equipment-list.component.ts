import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { EquipmentService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
declare let initEssGrid: any;

@Component({
	selector: 'app-public-equipment-list',
	templateUrl: './equipment-list.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentListComponent implements OnInit {
	private subscription: Subscription;

	controller: string = 'thiet-bi';
	items: Array<any> = [];
	_params: any;
	queryParams: any;
	language_code: string;
	width: string = '480';
	width_preview = 'width=1280';
	width_default = 'width=' + this.width;

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _EquipmentService: EquipmentService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
		if(this.language_code == 'en'){
			this.controller = 'equipment';
		}
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('language_code', this.language_code);
		params.set('image_resize_width', this.width);
		params.set('item_status','active');
		this._EquipmentService.getListAll(params).subscribe(res => {
			if(res.status == 'success'){
				var items = res.data;
				items.forEach(item => {
					var preview_image = item.image_url.replace(this.width_default, this.width_preview);
					item['preview_image'] = preview_image;

				});
				this.items = items;

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
		// this.subscription.unsubscribe();
	}
}
