import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
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
	controller: string = 'thiet-bi';

	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _EquipmentService: EquipmentService,
		private _Configuration: Configuration
	) {

	}

	ngOnInit() {
		let params: URLSearchParams = new URLSearchParams();
		params.set('item_status','active');
		this._EquipmentService.getListData(params).subscribe(res => {
			if(res.status == 'success'){

			}
		});
		console.log('EquipmentListComponent');
	}


	ngOnDestroy() {

	}
}
