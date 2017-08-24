import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Configuration } from '../../../shared';
import { GeneralService, FormProcessService, AuthService, TProposalService, TRequestService } from '../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;
declare let general: any;

@Component({
	selector: 'app-navigation-form',
	templateUrl: './navigation-form.component.html',
	providers: [GeneralService, LocalStorageService, FormProcessService, AuthService, TProposalService, TRequestService]
})
export class NavigationFormComponent implements OnInit {
	private subscription: Subscription;
	@ViewChild('modal') modal: ModalComponent;
	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	@Input('access_area') access_area: String;
	@Input('petition_type') petition_type: String;
	@Input('petition_id') petition_id: String;
	@Input('approval_status_id') approval_status_id: String;
	@Input('m_petition_status_id') m_petition_status_id: String;
	@Input('creator_id') creator_id: String;
	@Output('IDs') IDs = new EventEmitter();
	delete_item: any;
	current_user_info = {};
	listButton = [];
	_queryParams = {};
	arrID = [];
	arrParams = [];
	formType = {
		confirm_msg: '',
		type: ''
	};

	constructor(private _Router: Router,
		private _Configuration: Configuration,
		private _ActivatedRoute: ActivatedRoute,
		private _FormProcessService: FormProcessService,
		private _AuthService: AuthService,
		private _ToastrService: ToastrService,
		private _TProposalService: TProposalService,
		private _TRequestService: TRequestService,
		private _GeneralService: GeneralService,
		private _LocalStorageService: LocalStorageService
	) {
		// subscribe to router event
		this.subscription = this._ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this._queryParams = param;
			});
	}

	ngOnInit() {
		this.current_user_info = this._AuthService.getCurrent();
	}

	/*=================================
	 * Load data of button when pettion_id has value
	 *=================================*/
	ngOnChanges() {
		if(this.petition_id) {
			$('.loading').show();
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('access_area', String(this.access_area));
			paramData.set('petition_type', String(this.petition_type));
			paramData.set('petition_id', String(this.petition_id));
			paramData.set('m_user_id', this.current_user_info['id']);

			this._FormProcessService.generateFormButton(paramData).subscribe(res => {
				if (res.status == 'success') {
					this.listButton = res.data;
					
				}
			});

			// Previsous and Next button
			let previous_page = decodeURIComponent(this._queryParams['previous_page']);
			let strParams = previous_page.replace(/.*\?/, '');
			let params = strParams.split('&');

			for(let key in params) {
				let temp = params[key].split('=');
				this.arrParams[temp[0]] = temp[1];
			}

			let queryParams: URLSearchParams = new URLSearchParams();
			if (this.arrParams) {
				let title = 'approval_user';

				if (this.creator_id == this.current_user_info['id']) {
					title = 'apply_user';
				}

				if (this.access_area != 'management-list-form-payment' && this.access_area != 'management-list-form-payment-obic') {
					queryParams.set(title, 'me');
				} else {
					queryParams.set('request_area', 'management-list-form-payment');
				}

				for(let k in this.arrParams) {
					queryParams.set(k, this.arrParams[k]);
				}
				
			}
			queryParams.set('group_by_id', String(true));
			queryParams.set('select_id_only', String(true));

			this._FormProcessService.getListForm(queryParams).subscribe(res => {
				if (res.status == 'success') {
					this.arrID = this.getNextAndPreviousID(res.data);
					this.IDs.emit(this.arrID);
					$('.loading').hide();

				}
			});
		}
	}

	/*====================================
	 * Function get next and previous ID
	 *====================================*/
	protected getNextAndPreviousID(data) {
		let main_key: any;
		let arr = [];
		let count = 0;
		for(let key in data) {
			count++;
			if(data[key].id == this.petition_id) {
				main_key = +key;
				break;
			}
		}

		if(typeof main_key != 'undefined') {
			if(data[main_key + 1]) {
				arr['next'] = data[main_key + 1].id;
				arr['petition_type_next'] = data[main_key + 1].petition_type;
			}
			if (data[main_key - 1]) {
				arr['previous'] = data[main_key - 1].id;
				arr['petition_type_prev'] = data[main_key - 1].petition_type;
			}
		} else {
			// Set default first row for comment = unread
			if(count) {
				arr['next'] = data[0].id;
				arr['petition_type_next'] = data[0].petition_type;
			}
		}
		return arr;
	}

	/*====================================
	 * Function link to detail ID
	 *====================================*/
	onLinkDetailID(id, petition_type) {
		let form_type = (petition_type === '1') ? '/proposal/' : '/payment/';
		if (this.access_area == 'management-list-form-payment') {
			form_type = '/management' + form_type;
		}
		
		let queryParams = '';

		if (typeof this._queryParams['previous_page'] !== 'undefined') {
			queryParams = '?access_area=' + this.access_area + '&previous_page=' + encodeURIComponent(this._queryParams['previous_page']);
		}

		this.arrID = [];
		this._Router.navigateByUrl(form_type + 'detail/' + id + queryParams);
	}

	/*====================================
	 * Function open modal confirm delete
	 *====================================*/
	onOpenModalConfirm() {
		this.modal.open('sm');
	}

	/*====================================
	 * Function delete proposal form
	 *====================================*/
	onConfirmDelete() {
		this.modal.close();
		switch (this.petition_type) {
			case '1': //Delete table t_proposal
				this._TProposalService.delete(+this.petition_id).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('データを削除しました。');
						this._Router.navigate(['/']);
					}
				})
				break;
			case '2': //Delete table t_request
				this._TRequestService.delete(+this.petition_id).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('データを削除しました。');
						this._Router.navigate(['/']);
					}
				})
				break;
		}
	}

	/*=================================
	 * Process type of button
	 *=================================*/
	onClickButton(type) {
		if ((type == 'back_update' || type == 'back_home' || type == 'back_management_list_form') && this._queryParams['previous_page']) {
			this._Router.navigateByUrl(decodeURIComponent(this._queryParams['previous_page']));
			return;
		}
		let arr_required = ['apply', 'draft', 'with_draw', 're_draft', 'delete', 'export_pdf', 'update_notice_confirm', 'change_route', 'back_update', 'back_home'];
		
		if (this.approval_status_id === '1' || this.approval_status_id === '7' || arr_required.indexOf(type) > -1) {
			let form_type = (this.petition_type === '1') ? '/proposal/' : '/payment/';
			this.formType['type'] = type;

			switch (type) {
				case "draft": // 1-00
					this._Router.navigate(['/']);
					break;
				case "apply": // 2-01
				case "with_draw": // 6-05
					this.processFormType(this.formType['type']);
					break;

				case "approve": // 3-02
				case "last_approve": // 3-02
					this.formType['confirm_msg'] = '承認しますか？';
					this.modalConfirm.open('sm');
					break;

				case "deny": // 5-04
					this.formType['confirm_msg'] = '否認しますか？';
					this.modalConfirm.open('sm');
					break;
				case "return": //4-03
					this.formType['confirm_msg'] = '差戻しますか？';
					this.modalConfirm.open('sm');
					break;
				case "broadcast": // 2-01
					this.formType['confirm_msg'] = '同報承認します、よろしいですか？';
					this.modalConfirm.open('sm');
					break;
				case "update_notice_confirm": // 8-07
					this.formType['confirm_msg'] = '確認しました?';
					this.modalConfirm.open('sm');
					break;

				case "change_route":
					let filter = {
						permission: 1,
						previous_page: this._queryParams['previous_page']
					}
					this._Router.navigate([form_type + 'set-routes', this.petition_id], { queryParams: filter });
					break;

				case "re_draft":

					this._Router.navigate([form_type + 'form/copy', this.petition_id]);
					break;
				case "delete":
					this.onOpenModalConfirm();
					break;
				case "export_pdf":
					/*==============================================
					 * Get Link Export PDF
					 *==============================================*/
					var params: URLSearchParams = new URLSearchParams();
					params.set('petition_id', String(this.petition_id));
					params.set('petition_type', String(this.petition_type));
					params.set('m_user_id', this.current_user_info['id']);
					params.set('format', 'user');

					var windowReference = window.open();
					this._GeneralService.exportFormPDF(params).subscribe(res => {
						if (res.status == 'success' && res.data != null) {
							windowReference.location.href = res.data.url;
						}
					});
					break;

				case "back_update":
					this._Router.navigate([form_type + 'form/update', this.petition_id]);
					break;

				case "back_home":
				case "back_management_list_form":
					this._Router.navigate(['/']);
					break;

				default:
					// code...
					break;
			}
		} else {
			this._ToastrService.error('承認するために、後閲ボタンを押してください。');
		}
	}

	/*=================================
	 * Process confirm msg
	 *=================================*/
	onConfirmMsg() {
		this.modalConfirm.close();
		this.processFormType(this.formType['type']);
	}

	/*=================================
	 * Get Icon Type
	 *=================================*/
	getIconType(type) {
		let icon = '';
		switch (type) {
			case "draft": // 1-00
				icon = 'fa-floppy-o'
				break;
			case "apply": // 2-01
				icon = 'fa-bar-chart';
				break;
			case "with_draw": // 6-05
				icon = 'fa-reply-all';
				break;

			case "approve": // 3-02
			case "last_approve": // 3-02
				icon = 'fa-check-circle-o';
				break;

			case "deny": // 5-04
				icon = 'fa-minus-circle';
				break;
			case "change_route":
				icon = "fa-exchange";
				break;
			case "return": //4-03
				icon = 'fa-share';
				break;
			case "broadcast": // 2-01
				icon = 'fa-life-ring';
				break;
			case "update_notice_confirm": // 8-07
				icon = "fa-bookmark";
				break;
			case "re_draft":
				icon = "fa-files-o";
				break;
			case "delete":
				icon = 'fa-trash';
				break;
			case "back_update":
			case "back_home":
			case "back_management_list_form":
				icon = 'fa-arrow-left';
				break;
			case "export_pdf":
				icon = 'fa-file-pdf-o';
				break;

			default:
				// code...
				break;
		}
		return icon;
	}

	/*=================================
	 * Process type with 'apply', 'with_draw'
	 *=================================*/
	protected processFormType(type) {
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('process_type', type);
		paramData.set('petition_type', String(this.petition_type));
		paramData.set('petition_id', String(this.petition_id));
		paramData.set('m_user_id', this.current_user_info['id']);
		paramData.set('request_m_user_id', this.current_user_info['id']);

		this._FormProcessService.singleProcess(paramData).subscribe(res => {
			if(res.status == 'success') {
				let msg = '';
				switch (type) {
					case "deny":
						msg = '否認しました';
						break;
					case "return":
						msg = '差戻しました';
						break;
					case "apply":
						if (this._LocalStorageService.get(this.petition_type + '_' + this.petition_id)) {
							this._LocalStorageService.remove(this.petition_type + '_' + this.petition_id);
						}
						
						msg = '申請しました';
						break;
					case "with_draw":
						msg = '取下げしました';
						break;
					default:
						msg = '承認しました';
						break;
				}
				this._ToastrService.success(msg);
				if (type != 'apply' && type != 'with_draw') {
					if (type == 'approve' || type == 'last_approve' || type == 'deny' || type == 'return' || type == 'broadcast' || type == 'update_notice_confirm') {
						if(this.arrID['next']) {
							this.onLinkDetailID(this.arrID['next'], this.arrID['petition_type_next']);
						} else if (this.arrID['previous']) {
							this.onLinkDetailID(this.arrID['previous'], this.arrID['petition_type_prev']);
						} else {
							if (this._queryParams['previous_page']) {
								this._Router.navigateByUrl(decodeURIComponent(this._queryParams['previous_page']));
							}
						}
					}
					
				} else {
					this._Router.navigate(['/']);
				}
				
			}
		})
	}

	ngOnDestroy(){
		this.modal.ngOnDestroy();
		this.modalConfirm.ngOnDestroy();
	}
}
