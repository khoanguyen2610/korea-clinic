import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Configuration } from '../../../shared';
import { TRequestService, AuthService, MAuthorityService, MUserService, MNoticeFeeService, GeneralService, FormProcessService,
	TFormAttachmentService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../general';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare let $: any;
declare let moment: any;
declare let proposal_create: any;

@Component({
	selector: 'app-payment-detail',
	templateUrl: './payment-detail.component.html',
	providers: [TRequestService, MAuthorityService, MUserService, MNoticeFeeService, GeneralService, FormProcessService, TFormAttachmentService]
})
export class PaymentDetailComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;
	private querySubscription: Subscription;
	private DTList;
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;
	@ViewChild('modalWaitingConfirm') modalWaitingConfirm: ModalComponent;
	@ViewChild('modalUpload') modalUpload: ModalComponent;

	_params: any;
	queryParams = {};
	current_user_info = {};
	user_create_form = {};
	t_request_dietary = {};
	t_request_traveling_expenses = {};

	dataItem = {};
	dataList = [];
	dataInput = [];
	dataPetition = [];
	dataComment = [{ children: [{ children: [], parent: 0 }], parent: 0 }];

	authorityOptions: Array<any> = [];
	costArray: Array<any> = [];
	purchaseArray: Array<any> = [];
	transportArray: Array<any> = [];
	Item = {};
	curRouting?: string;
	decimal: any;
	petition_id: any;
	m_petition_status_id: any;
	access_area: any;
	petition_type = '2';
	creator_id: any;
	url_list_data: string;
	display_cost: boolean = true;
	display_destination: boolean;
	approval_status_id: any;
	selected_index_user_id: number;
	is_approval: boolean = false;
	selected_user_id: any;
	files_upload = 0;
	files_type = this._Configuration.upload_file_extension; //Allow extension file upload
	uploadProgress: any;

	constructor(
		private _AuthService: AuthService,
		private _Configuration: Configuration,
		private _GeneralService: GeneralService,
		private _MAuthorityService: MAuthorityService,
		private _MUserService: MUserService,
		private _MNoticeFeeService: MNoticeFeeService,
		private _TRequestService: TRequestService,
		private _FormProcessService: FormProcessService,
		private _TFormAttachmentService: TFormAttachmentService,
		private _ToastrService: ToastrService,
		private _ActivatedRoute: ActivatedRoute,
		private _Router: Router,
		private _LocalStorageService: LocalStorageService
	) {
		// subscribe to router event
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		);
		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
				this.access_area = param.access_area;
			}
		);

		this.current_user_info = this._AuthService.getCurrent();
		this.decimal = new DecimalPipe(this._Configuration.formatLocale);
		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.getAuthorityOptions();
				this.loadPaymentData();
			}
		});
	}

	ngOnInit() {
		proposal_create.toggleMenu();
	}

	loadPaymentData(){
		this.uploader = new FileUploader({});
		this._TRequestService.getByID(this._params.id).subscribe(res => {
			if(res.status=='success' && res.data){
				if(+res.data.m_petition_status_id == 1 && !this.checkSessionCreatedForm(2, res.data.id)){
					this._Router.navigate(['payment/form/update', this._params.id]);
				}else{
					//get form data
					if(res.data.suspense_payments == null){
						res.data.suspense_payments =  0;
					}
					this.Item = res.data;
					this.petition_id = res.data.id;
					this.m_petition_status_id = res.data.m_petition_status_id;
					this.creator_id = res.data.m_user_id;
					this.user_create_form = res.data.user_create_form;
					//get pre travel data
					if(res.data.t_request_traveling_expenses){
						let departure_time: string = res.data.t_request_traveling_expenses.departure_time;
						res.data.t_request_traveling_expenses.departure_time = departure_time.substring(0,departure_time.lastIndexOf(':'));
						let end_time: string = res.data.t_request_traveling_expenses.end_time;
						res.data.t_request_traveling_expenses.end_time = end_time.substring(0,end_time.lastIndexOf(':'));
					}
					this.t_request_traveling_expenses = res.data.t_request_traveling_expenses;
					//get dietary data
					this.t_request_dietary = res.data.t_request_dietary;
					//get divide cost array
					this.costArray = res.data.t_cost_divide;
					//get purchase array
					this.purchaseArray = Object.keys(res.data.t_purchase_reception_spec).map(index => {
						let obj = res.data.t_purchase_reception_spec[index];
						let parseDate = Date.parse(obj.reception_date);
						obj.reception_date = moment(parseDate).format(this._Configuration.formatDate);
						obj.payments = this.decimal.transform(obj.payments);
						return obj;
					});
					//get transport array
					this.transportArray = Object.keys(res.data.t_request_transport_spec).map(index => {
						let obj = res.data.t_request_transport_spec[index];
						let parseDate = Date.parse(obj.use_date);
						obj.use_date = moment(parseDate).format(this._Configuration.formatDate);
						obj.transportation_spec_fee = this.decimal.transform(obj.transportation_spec_fee);
						return obj;
					});

					this.display_cost = (res.data.type == 1 && res.data.m_request_menu_id != 2 && res.data.m_request_menu_id != 3);
					let request_menu_id = [1,2,3,4,5];
					this.display_destination = (request_menu_id.indexOf(+res.data.m_request_menu_id) != -1);
					// Push data in list comment
					var dataComment = [];
					for (let key in res.data['comments']) {
						dataComment.push(res.data['comments'][key]);
					}
					this.dataComment = dataComment;
					// Push data in list data
					this.dataList = res.data.routes;
					let is_first = true;
					for(let key in this.dataList) {
						if (this.dataList[key].approval_datetime) {
							this.is_approval = true;
							this.dataList[key].approval_datetime = moment(this.dataList[key].approval_datetime).format(this._Configuration.formatDateMinTS);
						}
						if (this.current_user_info['id'] == this.dataList[key].m_user_id && is_first) {
							this.approval_status_id = this.dataList[key].m_approval_status_id;
							this.selected_index_user_id = +key;
							is_first = false;
						}

						//Khoa Nguyen - fix 2017-03-10
						//Case user has 2 authority broadcast & approve
						if (this.current_user_info['id'] == this.dataList[key].m_user_id
							&& (this.dataList[key].m_approval_status_id == 1 || this.dataList[key].m_approval_status_id == 7)) {
							this.approval_status_id = this.dataList[key].m_approval_status_id;
							this.selected_index_user_id = +key;
						}
					}

					if (this.Item['priority_flg'] === '0') {
						this.Item['priority_flg'] = '通常';
					} else {
						this.Item['priority_flg'] = '優先';
					}

					if (this.Item['change_route'] === '0') {
						this.Item['change_route'] = '無';
					} else {
						this.Item['change_route'] = '有';
					}
					this.Item['date'] = moment(this.Item['date']).format(this._Configuration.formatDate);

					// Add files_attach into Form Attachment
					for (let key in res.data.files_attach) {
						var filename = res.data.files_attach[key].filename;
						var file_type = filename.split('.');
						var area_upload = res.data.files_attach[key].area_upload;
						let item: any = { file: { name: filename, type: file_type[1], is_download: true, area_upload: area_upload }, _file: { id: res.data.files_attach[key].id, name: filename, type: file_type[1], is_keeping: true } };
						this.uploader.queue.push(item);
					}

					// Push data in list petition
					var dataPetition = [];
					for (let key in res.data['copy_petition']) {
						dataPetition.push(res.data['copy_petition'][key]);
					}
					this.dataPetition = dataPetition;

					// Pass param dataItem
					this.dataItem['petition_id'] = res.data.id;
					this.dataItem['petition_type'] = 2;
					this.dataItem['m_user_id'] = res.data.m_user_id;
					this.dataItem['parent'] = 0;
				}
			}else{
				this._ToastrService.error('データはありません。');
				this._Router.navigate(['/']);
			}
		})
	}

	/*====================================
	 * Get List Authority
	 *====================================*/
	getAuthorityOptions() {
		this.authorityOptions = [{ value: null, label: null }];
		this._MAuthorityService.getAll().subscribe(res => {
			if (res.status == 'success') {
				if (res.data != null) {
					var options = [];
					for (let key in res.data) {
						if (res.data[key].name != '最終審議') {
							let obj = { value: res.data[key].id, label: res.data[key].name };
							options.push(obj);
						}

					}
					this.authorityOptions = options;
				}
			}
		});
	}

	ngAfterViewInit() {
		//check form amount is exceed notice fee or not
		setTimeout(() => {
			if(+this.Item['m_petition_status_id'] == 1){
				let params: URLSearchParams = new URLSearchParams();
				params.set('m_request_menu_id', this.Item['m_request_menu_id']);
				params.set('item_status', 'active');
				this._MNoticeFeeService.getAll(params).subscribe(res => {
					if(res.status == 'success'){
						let notice =  res.data;
						for(let k in notice){
							if(notice[k].m_request_menu_id == this.Item['m_request_menu_id']){
								let form_amount = parseFloat(this.Item['amount']);
								let notice_amount = parseFloat(notice[k].amount);
								if(form_amount > notice_amount){
									this._ToastrService.error('通常の精算金額を上回っています。');
								}
							}
						}
					}
				})
			}
		}, 3000);

		this.url_list_data = this._MUserService._list_data_URL;
		let self = this,
			_list_data_URL = this.url_list_data + '?has_invisible_data=1',
			Configuration = this._Configuration;
		this.DTList = $('#tbl-data-approval-menu').DataTable({
			autoWidth: false,
			pageLength: Configuration.DtbPageLength,
			lengthChange: false,
			searching: false,
			bServerSide: true,
			ajax: {
				'url': _list_data_URL,
				'type': 'GET',
				'beforeSend': function(request) {
					request.setRequestHeader('Authorization', 'Basic ' + self._Configuration.apiAuth);
				},
				xhrFields: {
					withCredentials: true
				}
			},
			columns: [
				{ 'data': 'fullname' },
				{ 'data': 'position_name' },
				{ 'data': 'business_name_code' },
				{ 'data': 'division_name_code' },
				{ 'data': 'department_name_code' },

			],
			columnDefs: [
				{
					targets: [0],
					className: 'text-left',
					data: null,
					render: function(data, type, full) {
						return '<a class="edit-record">' + data + '</a>';
					}
				}
			],
			order: [[0, "asc"]],
			fnDrawCallback: function(oSettings) { },
			fnRowCallback: function(nRow, aData, iDisplayIndex) { },
		});
	}

	/*==============================================
	 * Check Session Created Form
	 *==============================================*/
	checkSessionCreatedForm(pettion_type, petition_id) {
		let sessionForm = this._LocalStorageService.get(pettion_type + '_' + petition_id);
		if(sessionForm) {
			return true;
		}
		return false;
	}

	/*======================================================
	 * check fields required to detect form saved draft or not
	 *======================================================*/
	isFormDraft(data){
		let back_update: boolean;
		if(+data.m_petition_status_id > 1){
			back_update = false;
		}else{
			let current_form_info = this._LocalStorageService.get('2_' + data.id);
			if(current_form_info){
				let now = new Date().getTime();
				back_update = ((now - current_form_info['time']) > 10800000);
			}else{
				back_update = true;
			}
		}
		return back_update;
	}

	/*==============================================
	 * Download Form
	 *==============================================*/
	onDownloadForm(attachment_id, type: string) {
		// Get Link Download File
		var params: URLSearchParams = new URLSearchParams();
		params.set('attachment_id', attachment_id);
		params.set('attachment_type', type); // form_attachment, form_input
		params.set('m_user_id', this.current_user_info['id']);

		var windowReference = window.open();
		this._GeneralService.dowloadForm(params).subscribe(res => {
			if (res.status == 'success' && res.data != null) {
				// windowReference.location.href = res.data.url;
				let url = res.data.url;
				window.location.href = url;
				windowReference.location.href = url;
				windowReference.close();
			}
		});

	}

	getReplied(value){
		this._TRequestService.getByID(this._params.id).subscribe(res => {
			if(res.status=='success' && res.data){
				// Push data in list comment
				var dataComment = [];
				for (let key in res.data['comments']) {
					dataComment.push(res.data['comments'][key]);
				}
				this.dataComment = dataComment;
			}
		})
	}

	/*==============================================
	 * Change Approval User
	 *==============================================*/
	onChangeApprovalUser() {
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('process_type', 'waiting_confirm');
		paramData.set('petition_type', String(this.petition_type));
		paramData.set('petition_id', String(this.petition_id));
		paramData.set('m_user_id', this.selected_user_id);
		paramData.set('request_m_user_id', this.current_user_info['id']);

		this._FormProcessService.singleProcess(paramData).subscribe(res => {
			if (res.status == 'success') {
				this.loadPaymentData();
				this.modalWaitingConfirm.close();
			}
		})
	}

	/*==============================================
	 * Open Dialog Waiting Confirm
	 *==============================================*/
	onWaitingConfirmDialog(user_id) {
		this.selected_user_id = user_id;
		this.modalWaitingConfirm.open('sm');
	}

	/*==============================================
	 * Open Dialog Upload
	 *==============================================*/
	onUploadDialog() {
		this.modalUpload.open();
	}

	/*==============================================
	 * Remove file on stack
	 *==============================================*/
	onRemoveFile(index, file_id) {
		if (this.uploader.queue.length) {
			this.uploader.queue.splice(index, 1);
		}

		if (file_id) { // check id of file
			this.Item['files_attach'][file_id].is_deleted = true;
		}

	}

	/*====================================
	 * Upload Files on proposal detail
	 *====================================*/
	onUploadProposalDetail() {
		$('.loading').show();
		let formData: FormData = new FormData();
		let result: any;
		let files = [];
		if (this.uploader.queue.length) {
			for (let key in this.uploader.queue) {
				var upload = this.uploader.queue[key]._file;
				//Khoa Nguyen - 2017-03-13 - fix issue when attach file on firefox
				var objUpload = new Blob([upload]);
				if (upload['id']) {
					// formData.append("upload_inputs[" + upload['id'] + "]", objUpload, upload.name);
					// formData.append("uploads[" + upload['id'] + "]", upload, upload.name);
				} else {
					formData.append("uploads[]", objUpload, upload.name);
					// formData.append("uploads[]", upload, upload.name);
				}

			}
		}

		formData.append('files_attach', JSON.stringify(this.Item['files_attach']));
		formData.append('petition_id', this.petition_id);
		formData.append('petition_type', String(2));


		this._TFormAttachmentService.getObserver()
			.subscribe(progress => {
				this.uploadProgress = progress;

			});
		try {
			result = this._TFormAttachmentService.upload(formData).then((res) => {
				if (res.status == 'success') {
					$('.loading').hide();
					this.onCloseUploadDialog();
				}
			});
		} catch (error) {
			document.write(error)
		}
	}

	/*====================================
	 * Validate Form File Type
	 *====================================*/
	onValidateFormFileType() {
		this.uploader['error_limit_files'] = false;

		let pre_upload_files = +this.uploader.queue.length; // previous drag upload files
		setTimeout(() => {

			let after_upload_files = +this.uploader.queue.length; // after drag upload files
			if (after_upload_files <= this._Configuration.limit_files) {
				if (after_upload_files != this.files_upload) {
					let uploader = [];
					for (let key in this.uploader.queue) {
						var checked = false;
						var ext = this.uploader.queue[key]._file.name.split('.').pop();
						ext = ext.toLowerCase();

						for (let k in this.files_type) {

							if (ext.indexOf(this.files_type[k]) > -1) {
								checked = true;
								break;
							}
						}

						if (!checked) {
							var msgInvalidFileType = this.uploader.queue[key]._file.type + 'は無効なファイル形式です。' + this.files_type.join() + '形式のファイルのみサポートしています'
							this._ToastrService.error(msgInvalidFileType);
							checked = false;
						}

						if (this.uploader.queue[key]._file.size > this._Configuration.limit_file_size) {
							var msgSizeTooLarge = 'ファイル' + this.uploader.queue[key]._file.name + ' (' + Math.round(this.uploader.queue[key]._file.size / (1024 * 1024)) + 'MB)はアップロード可能な上限容量' + this._Configuration.limit_file_size / (1024 * 1024) + 'MBを超えています'
							this._ToastrService.error(msgSizeTooLarge);
							checked = false;
						}

						if (!checked) {
							// this.uploader.queue.splice(+key, 1);
							this.uploader.queue[key].isError = true;
						} else {
							this.uploader.queue[key]._file['is_keeping'] = true;
							uploader.push(this.uploader.queue[key]);
						}


					}
					this.uploader.queue = uploader;
					this.files_upload = this.uploader.queue.length;
				}
			} else {

				// Case over limit files > 10
				this._ToastrService.error('アップロード可能な上限数(10個)を超えているので、アップロードできません。');

				let queue = [];
				for (let i in this.uploader.queue) {
					if (this.uploader.queue[i]._file['is_keeping']) {
						queue.push(this.uploader.queue[i]);
					}
				}
				this.uploader.queue = queue;
			}


		}, 500);

	}

	/*====================================
	 * Close Upload Dialog
	 *====================================*/
	onCloseUploadDialog() {
		this.loadPaymentData();
		this.modalUpload.close();
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		this.onValidateFormFileType();
		this.hasAnotherDropZoneOver = e;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
		this.querySubscription.unsubscribe();
		this.modalWaitingConfirm.ngOnDestroy();
	}
}
