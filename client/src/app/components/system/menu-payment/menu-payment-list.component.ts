import { Component, OnInit } from '@angular/core';
import { Configuration } from '../../../shared';
import { MRequestMenuService } from '../../../services';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../general';

declare let $: any;

@Component({
	selector: 'app-system-menu-payment-list',
	templateUrl: './menu-payment-list.component.html',
	providers: [MRequestMenuService]
})
export class MenuPaymentListComponent implements OnInit {
	objStatus = [
		{value: 0, label: '無効'},
		{value: 1, label: '有効'}
	];
	myOptions: Array<any>;

	constructor(private _Router: Router, 
		private _Configuration: Configuration, 
		private _MRequestMenuService: MRequestMenuService
	) { 
		
	}

	ngOnInit(){

	}

	/*======================================
	 * Change URL to page edit when click item
	 *======================================*/
	onRoutingUpdate(id: number){
		this._Router.navigate(['/system/menu-payment/update/', id]);
	}


	ngAfterViewInit(){
		let self = this,
			_list_data_URL = this._MRequestMenuService._list_data_URL,
			objStatus = this.objStatus,
			Configuration = this._Configuration;
		$('#tbl-data').DataTable({
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
			    'url': _list_data_URL,
			    'type': 'GET',
			    'beforeSend': function (request) {
			        request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
			    },
			    xhrFields: {
		            withCredentials: true
		        }
			},
			columns: [
				{ 'data': 'code' },
				{ 'data': 'name' },
				{ 'data': 'position_name' },
				{ 'data': 'enable_flg' },
				{ 'data': 'controls' },
			],
			columnDefs: [
				{
					targets: [3],
					render: function(data, type, full){
						var html = '';
						$.each(objStatus,function(i,arr){
							if(arr.value==data){
								html = arr.label;
								return false;
							}
						})
						return html;
					},
				},
				{
			        targets: [4],
					className: 'text-center',
			        data: null,
			        bSortable: false,
			        render: function (data, type, full) {
			            return '<a class="edit-record" href="#" id="btn_edit" title="編集"><i class="fa fa-pencil"></i></a>';
			        }
			    }
		    ],
			order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) {
				
			}
		});
		
		$('#tbl-data tbody').on( 'click', '#btn_edit', function () {
			let id: number = $(this).parents('tr').attr('id');
			self.onRoutingUpdate(id);
			return false;
	    });
	}
}
