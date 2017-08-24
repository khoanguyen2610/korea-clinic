import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../../shared';
import { MExpenseItemService } from '../../../../services';
import { TRequestTravelingExpenses } from '../../../../models';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare let $: any;
declare let moment: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'payment-pre-travel',
	templateUrl: './payment-pre-travel-form.component.html',
	providers: [ MExpenseItemService ]
})

export class PaymentPreTravelFormComponent implements AfterViewInit {
	@Input('travel') Item: TRequestTravelingExpenses;
	@Input() currency_symbol: string;
	@Input() is_draft_validated: boolean;
	@Input() m_position_id: number;
	@Input('triptype') triptypeOption: Array<any> = [];
	@Input('triparea') tripareaOption: Array<any> = [];
	expenseItemOption: Array<any> = [];
	width: any;
	
	constructor(
		private _Configuration: Configuration,
		private _MExpenseItemService: MExpenseItemService,
		private _DomSanitizer : DomSanitizer
	) { 
		/*=============== Get request menu options ===============*/
		let params: URLSearchParams = new URLSearchParams();
		params.set('type_code','01');
		params.set('item_status','active');
		params.set('enable_flg','1');
		this.expenseItemOption.push({ id: null, text: null });
		this._MExpenseItemService.getAll(params).subscribe(res => {
			if(res.status=='success'){
				if(res.data){
					var options = [];
                    for (let key in res.data) {
                        let obj = { id: res.data[key].id, text: res.data[key].item };
                        options.push(obj);
                    }
                    this.expenseItemOption = options;
				}
			}
		});
	}

	ngAfterViewInit(){
		let self = this,
			Configuration = this._Configuration;
		//reload jquery plugin
		$('.daterange-single').datetimepicker({
			locale: 'ja',
			format: Configuration.formatDate,
		});

		$('.timepicker').timepicker({
			'showDuration': true,
			'timeFormat': 'H:i',
			'step' : 10
		});

		

  		//cleave number format
  		applyCleaveJs();

		//calculate width .select-box-2
		setTimeout(() => {
			let minus_width = (+this.Item.business_trip_class == 1) ? '0px' : '130px';
			this.width = this._DomSanitizer.bypassSecurityTrustStyle('calc(50% - ' + minus_width + ')');	
		});
		
	}

	onChangeSelect(event, field: string){
		this.Item[field] = event.id;
	}
}