import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService} from 'angular-2-local-storage';

import { Configuration } from '../../../shared';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  providers: [ AuthService, LocalStorageService ]
})
export class LogoutComponent implements OnInit {
	system_version?: String = '';
	validateErrors = {};
	Item = {};
	component_destroy = false;
  	constructor(private _Router: Router,
		private _Configuration: Configuration,
	 	private _ActivatedRoute: ActivatedRoute,
	 	private _AuthService: AuthService,
	 	private _LocalStorageService: LocalStorageService
	) {
  		setInterval(() => {
			this.onCheckUserSession();
		}, 5000)
  	}

  	ngOnInit() {
  		
  	}

  	/*======================================
  	 * Check if login other tab || exist user sesion
  	 *======================================*/
  	onCheckUserSession(){
  		if(!this.component_destroy){
	  		let current_user_info = this._LocalStorageService.get('current_user_info');
	  		if(current_user_info){
				this._Router.navigate(['/home']);
	  		}else{
                this._Router.navigate(['/login']);
            }
	  	}
  	}

  	ngOnDestroy(){
  		this.component_destroy = true;
  	}

}
