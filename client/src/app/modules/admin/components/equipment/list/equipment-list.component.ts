import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, EquipmentService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-equipment-list',
	templateUrl: './equipment-list.component.html',
	providers: [ EquipmentService ]
})

export class EquipmentListComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _EquipmentService: EquipmentService,

		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {

	}

	ngOnInit(){

	}

}