import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { TNotifyService } from '../../../services';
import { TNotify } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';
declare let moment: any;

@Component({
	selector: 'app-manage-list',
	templateUrl: './notify-form.component.html',
	providers: [TNotifyService]
})
export class NotifyFormComponent implements OnInit {
	private subscription: Subscription;
	_params: any;
	Item = new TNotify();

	public release_flg = [
		{'value':'0','label':'非公開'},
		{'value':'1','label':'公開'}
	];

	public notice_type = [
		{'id':'01','text':'バージョンアップ'},
		{'id':'02','text':'お知らせ'},
		{'id':'03','text':'メンテナンス'},
		{'id':'99','text':'その他'}
	];

	constructor(
		private _TNotifyService: TNotifyService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router
	) { }

	ngOnInit() {
		//=============== Get Params On Url ===============
		this.subscription = this._ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);

		switch(this._params.method){
			case 'create':
				this.Item.release_flg = 1;
				break;
			case 'update':
				if(this._params.id != null){
					this._TNotifyService.getByID(this._params.id).subscribe(res => {
						if (res.status == 'success') {
							if(res.data == null){
								this._Router.navigate(['/system/notify']);
							}else{
								var repeat:number = 0;
								var loadInterval = setInterval(() => {
									this.Item = res.data;
									repeat++;
									if(repeat == 5){
										clearInterval(loadInterval);
									}
								}, 500);
								
							}
						}else{
							this._Router.navigate(['/system/notify']);
						}
					});
				}
				break;
			default:
				this._Router.navigate(['/system/notify']);
				break;
		}
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e){
		// Set value of select 2 to ngModel
		this.Item['type'] = e.id;
	}
	/*====================================
	 * Event removed of ng2-select - MIT
	 *====================================*/
	onNgRemoved(e){
		// Reset value of select 2 to ngModel
		this.Item['type'] = null;
	}

	onSubmit(form: NgForm){
		if(form.valid){
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('title', this.Item['title']);
			paramData.set('content', this.Item['content']);
			paramData.set('date', this.Item['date'].toString());
			paramData.set('type', this.Item['type'].toString());
			paramData.set('release_flg', this.Item['release_flg'].toString());

			if(this._params.method=='update'){
				paramData.set('id', this.Item['id'].toString());
				this._TNotifyService.save(paramData,this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
					}
				});	
			}else{
				//reset CKEditor
				this.Item.content = '';
				this._TNotifyService.save(paramData).subscribe(res => {
					if(res.status == 'success'){
						//reset form
						form.reset();
						this.Item.release_flg = 1;
						this._ToastrService.success('情報を登録しました。');
					}
				})
			}
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

}
