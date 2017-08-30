import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';


declare let $: any;
declare let moment: any;

@Component({
	selector: 'app-public-home-equipment',
	templateUrl: './equipment.component.html',
})

export class EquipmentComponent implements OnInit {

	constructor(

	) {

	}

	ngOnInit() {
		console.log('Equipment Homepage');
	}


	ngOnDestroy() {

	}
}
