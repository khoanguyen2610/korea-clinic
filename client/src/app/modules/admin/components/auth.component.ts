import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Configuration, Theme } from './../../../shared';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ScriptService } from './../../../services';
import { URLSearchParams } from '@angular/http';
import { NgForm } from '@angular/forms';
import { LocalStorageService } from 'angular-2-local-storage';

declare var $: any;
declare var window: any;
declare var applyCleaveJs: any;

@Component({
	selector: 'app-auth-root',
	templateUrl: './auth.component.html',
})

export class AuthComponent  {

	constructor(
	) {

	}
}
