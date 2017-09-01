import { Injectable } from '@angular/core';

@Injectable()
export class Theme {
	public listScript: any;
	public listCss: any = [
		//Admin Template Css
		{ name: 'font-awesome.min', src: '../assets/admin/global/plugins/font-awesome/css/font-awesome.min.css'},
		{ name: 'simple-line-icons.min', src: '../assets/admin/global/plugins/simple-line-icons/simple-line-icons.min.css'},
		{ name: 'bootstrap.min', src: '../assets/admin/global/plugins/bootstrap/css/bootstrap.min.css'},
		{ name: 'bootstrap-switch.min', src: '../assets/admin/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css'},
		{ name: 'daterangepicker.min', src: '../assets/admin/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css'},
		{ name: 'morris', src: '../assets/admin/global/plugins/morris/morris.css'},
		{ name: 'fullcalendar.min', src: '../assets/admin/global/plugins/fullcalendar/fullcalendar.min.css'},
		{ name: 'jqvmap', src: '../assets/admin/global/plugins/jqvmap/jqvmap/jqvmap.css'},
		{ name: 'components.min', src: '../assets/admin/global/css/components.min.css'},
		{ name: 'plugins.min', src: '../assets/admin/global/css/plugins.min.css'},
		{ name: 'layout.min', src: '../assets/admin/layouts/layout/css/layout.min.css'},
		{ name: 'darkblue.min', src: '../assets/admin/layouts/layout/css/themes/darkblue.min.css'},
		{ name: 'custom.min', src: '../assets/admin/layouts/layout/css/custom.min.css'},
		//Public Template Css
	];

	public listCssTEST: any = [  '../assets/admin/global/plugins/font-awesome/css/font-awesome.min.css'];


	public getArrayCss(listName: Array<string>){
		var arrCss: Array<string> = [];
		for(let obj in this.listCss){
			if(listName.length == 0){
				arrCss.push(this.listCss[obj].src);
			}else{
				if(listName.indexOf(this.listCss[obj].name) != -1) arrCss.push(this.listCss[obj].src);
			}
		}
		return arrCss;
    }
}
