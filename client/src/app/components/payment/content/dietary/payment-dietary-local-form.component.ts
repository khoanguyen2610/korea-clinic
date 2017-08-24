import { Component, Input, AfterViewInit } from '@angular/core';
import { TRequestDietary } from '../../../../models';

@Component({
	selector: 'payment-dietary-local',
	templateUrl: './payment-dietary-local-form.component.html',
})

export class PaymentDietaryLocalFormComponent{
	@Input('dietary') Item: TRequestDietary;
	@Input() is_draft_validated: boolean;
}