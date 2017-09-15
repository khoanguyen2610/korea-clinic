import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-public-general-footer',
	templateUrl: './footer.component.html',
})

export class FooterComponent implements OnInit {
	@Input() options: any;
	constructor(

	) {

	}

	ngOnInit() {
	}


	ngOnDestroy() {

	}
}
