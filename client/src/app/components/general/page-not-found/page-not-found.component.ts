import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BreadcrumbComponent } from '../../general';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

  	constructor( private _Location: Location) { }

  	ngOnInit() {
  	}

  	backPrevious(){
  		this._Location.back();
  	}
}
