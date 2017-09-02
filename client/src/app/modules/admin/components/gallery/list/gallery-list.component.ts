import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../../../shared';
import { AuthService, GalleryService } from '../../../../../services';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BreadcrumbComponent, FooterComponent, HeaderComponent, MainNavComponent } from '../../general';

declare var $: any;

@Component({
	selector: 'app-gallery-list',
	templateUrl: './gallery-list.component.html',
	providers: [ GalleryService ]
})

export class GalleryListComponent implements OnInit {
	private subscription: Subscription;
	private DTList;
	@ViewChild('modal') modal: ModalComponent;

	delete_id: number;
	url_list_data: String;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _GalleryService: GalleryService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,

	) {
		this.subscription = _ActivatedRoute.queryParams.subscribe((params:any) => {

		});

		this.url_list_data = this._GalleryService._list_data_URL;
	}

	ngOnInit(){

	}


}
