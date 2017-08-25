import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-admin-theme',
    template: '',
    styleUrls: [
		//Admin Template Css
		'../../../../assets/admin/global/plugins/font-awesome/css/font-awesome.min.css',
		'../../../../assets/admin/global/plugins/simple-line-icons/simple-line-icons.min.css',
		'../../../../assets/admin/global/plugins/bootstrap/css/bootstrap.min.css',
		'../../../../assets/admin/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
		'../../../../assets/admin/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css',
		'../../../../assets/admin/global/plugins/morris/morris.css',
		'../../../../assets/admin/global/plugins/fullcalendar/fullcalendar.min.css',
		'../../../../assets/admin/global/plugins/jqvmap/jqvmap/jqvmap.css',
		'../../../../assets/admin/global/css/components.min.css',
		'../../../../assets/admin/global/css/plugins.min.css',
		'../../../../assets/admin/layouts/layout/css/layout.min.css',
		'../../../../assets/admin/layouts/layout/css/themes/darkblue.min.css',
		'../../../../assets/admin/layouts/layout/css/custom.min.css',
    ],
    encapsulation: ViewEncapsulation.None,
})

export class AdminThemeComponent {
	constructor() {

	}

}
