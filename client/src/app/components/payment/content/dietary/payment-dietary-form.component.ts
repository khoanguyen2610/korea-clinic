import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TRequestDietary } from '../../../../models';

@Component({
	selector: 'payment-dietary',
	templateUrl: './payment-dietary-form.component.html',
})

export class PaymentDietaryFormComponent{
	@Input('dietary') Item: TRequestDietary;
	@Input() is_draft_validated: boolean;
}