import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { AuthService, EquipmentService } from '../../../../../services';
import { Configuration } from '../../../../../shared';

// declare let $: any;
// declare let moment: any;

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

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _EquipmentService: EquipmentService,
		private _Configuration: Configuration,
		private _LocalStorageService: LocalStorageService
	) {
		this.language_code = String(_LocalStorageService.get('language_code'));
	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('item_status','active');
		this._EquipmentService.getListData(params).subscribe(res => {
			if(res.status == 'success'){
				this.items = res.data;
			}
		});
		console.log('EquipmentListComponent');
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
