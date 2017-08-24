import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';

import { CommentComponent, BreadcrumbComponent } from '../../general';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { TCommentService, MDepartmentService, MCompanyService, MMenuService, MApprovalMenuService, MPositionService,
	MUserService, TProposalService, TApprovalStatusService, MAuthorityService, AuthService, ApprovalRoutesService,
	GeneralService, FormProcessService, TFormAttachmentService } from '../../../services';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { LocalStorageService } from 'angular-2-local-storage';



declare let $: any;
declare let moment: any;
declare let proposal_create: any;

@Component({
	selector: 'app-proposal-detail',
	templateUrl: './proposal-detail.component.html',
	providers: [MDepartmentService, MCompanyService, MMenuService, MApprovalMenuService, MPositionService, MUserService,
	TProposalService, TApprovalStatusService, MAuthorityService, AuthService, ApprovalRoutesService, GeneralService,
		FormProcessService, TFormAttachmentService],

})
export class ProposalDetailComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;
	private querySubscription: Subscription;
	private DTList;
	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;
	@ViewChild('modalWaitingConfirm') modalWaitingConfirm: ModalComponent;
	@ViewChild('modalUpload') modalUpload: ModalComponent;

	dataItem = {};
	dataList = [];
	dataInput = [];
	dataInputLoaded: boolean = false;
	dataPetition = [];
	dataComment = [{ children: [{ children: [], parent: 0 }], parent: 0 }];

	authorityOptions: Array<any> = [];
	positionOptions: Array<any> = [];
	curRouting?: string;
	Item = {};
	_params = {};
	queryParams = {};
	dataNavigation = [];

	url_list_data: String;
	selectedItem = {};
	remove_index: any;
	remove_authority: any;
	error_same_date = false;
	current_user_info = {};
	user_create_form = {};
	petition_id: any;
	petition_type = '1';
	access_area?: any;
	approval_status_id: any;
	m_petition_status_id: any;
	creator_id: any;
	selected_index_user_id: number;
	is_approval = false;
	selected_user_id: any;
	files_upload = 0;
	files_type = this._Configuration.upload_file_extension; //Allow extension file upload
	uploadProgress: any;


	constructor(private _Router: Router,
		private _Configuration: Configuration,
		private _MDepartmentService: MDepartmentService,
		private _MCompanyService: MCompanyService,
		private _MApprovalMenuService: MApprovalMenuService,
		private _MPositionService: MPositionService,
		private _MUserService: MUserService,
		private _TProposalService: TProposalService,
		private _TApprovalStatusService: TApprovalStatusService,
		private _TFormAttachmentService: TFormAttachmentService,
		private _MAuthorityService: MAuthorityService,
		private _ActivatedRoute: ActivatedRoute,
		private _ToastrService: ToastrService,
		private _AuthService: AuthService,
		private _ApprovalRoutesService: ApprovalRoutesService,
		private _MMenuService: MMenuService,
		private _GeneralService: GeneralService,
		private _FormProcessService: FormProcessService,
		private _LocalStorageService: LocalStorageService
	) {
		let routing = this._Router.url;
		let self = this;

		// subscribe to router event
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => {
				this._params = param;
			}
		)

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
				this.access_area = param.access_area;
			}
		)

		this.current_user_info = this._AuthService.getCurrent();

		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.getAuthorityOptions();
				this.loadProposalData();
			}
		});
	}

	ngOnInit() {
		proposal_create.toggleMenu();
	}

	/*====================================
	 * Load Proposal
	 *====================================*/

	loadProposalData() {
		this.uploader = new FileUploader({});
		this._TProposalService.getByID(this._params['id']).subscribe(res => {
			if (res.status == 'success' && res.data) {
				this.Item = res.data;
				this.dataInputLoaded = true;
				this.petition_id = res.data.id;
				this.m_petition_status_id = res.data.m_petition_status_id;

				// Check exist session created form
				if (+this.m_petition_status_id == 1 && !this.checkSessionCreatedForm(1, this.petition_id)) {
					this._Router.navigate(['/proposal/form/update', this._params['id']]);
					return;
				}
				this.creator_id = res.data.m_user_id;

				// Push data in list data
				this.dataList = this.clone(res.data['routes']);
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

				// Push data in list comment
				var dataComment = [];
				for (let key in res.data['comments']) {
					dataComment.push(res.data['comments'][key]);
				}

				this.dataComment = dataComment;

				// Push data in list petition
				var dataPetition = [];
				for (let key in res.data['copy_petition']) {
					dataPetition.push(res.data['copy_petition'][key]);
				}

				this.dataPetition = dataPetition;

				this.getMenuInputDetail(this.Item['m_menu_id'], res.data);

				// Pass param dataItem
				this.dataItem['petition_id'] = res.data.id;
				this.dataItem['petition_type'] = 1;
				this.dataItem['m_user_id'] = res.data.m_user_id;
				this.dataItem['parent'] = 0;
			} else {
				this._ToastrService.error('データはありません。');
				this._Router.navigate(['/']);
			}
		});
	}

	generateFormButton() {

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
			fnRowCallback: function(nRow, aData, iDisplayIndex) {

			},
		});
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

	/*=================================
	 * Create | Update Approval Department
	 *=================================*/
	onSave() {

		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('menu_type', 'menu');
		paramData.set('m_menu_id', this.Item['m_menu_id']);
		paramData.set('m_department_id', this.current_user_info['active_m_department_id']);
		paramData.set('user_check', '1');

		this._TApprovalStatusService.setRoutes(paramData, this._params['id']).subscribe(res => {
			if (res.status == 'success') {
				this._ToastrService.success('保存しました。');
				this._Router.navigate(['/proposal/detail', this._params['id']]);
			}
		});
	}

	getReplied(value) {
		this.loadProposalData();
	}

	/*==============================================
	 * Get Menu Input Detail
	 *==============================================*/
	getMenuInputDetail(m_menu_id, proposalData) {
		this._MMenuService.getMenuInputDetail(m_menu_id).subscribe(res => {
			if (res.status == 'success' && res.data) {

				this.Item['date'] = proposalData['date'];
				this.Item['id'] = proposalData['id'];
				this.Item['code'] = proposalData['code'];
				this.Item['menu_name'] = proposalData['menu_name'];
				this.Item['name'] = proposalData['name'];
				this.Item['m_petition_status_name'] = proposalData['m_petition_status_name'];
				this.user_create_form = proposalData['user_create_form'];

				let inputOptions = [];
				for (let key in proposalData['inputs']) {
					inputOptions.push(proposalData['inputs'][key]);
				}
				this.Item['inputs'] = inputOptions;
				if (proposalData['priority_flg'] === '0') {
					this.Item['priority_flg'] = '通常';
				} else {
					this.Item['priority_flg'] = '優先';
				}

				if (proposalData['change_route'] === '0') {
					this.Item['change_route'] = '無';
				} else {
					this.Item['change_route'] = '有';
				}

				let arr_input_id = [];
				// for (let key in this.Item['inputs']) {
				// 	let inputForm = this.Item['inputs'][key];
				// 	var input = proposalData['inputs'][inputForm.m_input_id];
				// 	if (input) {
				// 		arr_input_id.push(inputForm.m_input_id);

				// 		inputForm.value = input.value;
				// 		inputForm.id = input.id;
				// 		inputForm.m_input_id = input.m_input_id;

				// 		if (inputForm.input_type_name_e == 'checkbox-group') {
				// 			var temp = JSON.parse(inputForm.value);
				// 			if (Array.isArray(temp) || temp !== '[]') {
				// 				inputForm.value = temp.join();
				// 			} else {
				// 				inputForm.value = '';
				// 			}
				// 		}
				// 	} else {

				// 		for (let i in proposalData['inputs']) {
				// 			if (proposalData['inputs'][i].m_input_type_id == inputForm.input_type_id && proposalData['inputs'][i].m_input_name == inputForm.name) {
				// 				arr_input_id.push(proposalData['inputs'][i].m_input_id);
				// 				inputForm.value = proposalData['inputs'][i].value;
				// 				input = {
				// 					value: inputForm.value
				// 				};
				// 			}
				// 		}

				// 	}

				// 	if (inputForm.input_type_name_e == 'file') {
				// 		var temp = JSON.parse(inputForm.value);
				// 		if(temp) {
				// 			inputForm.filename = temp['filename'];
				// 		}
				// 	}

				// }

				/*console.log(this.Item['inputs']);
				// For case: data inputs are removed on master menu
				for (let key in proposalData['inputs']) {
					if(arr_input_id.indexOf(key) < 0) {
						var input_temp = proposalData['inputs'][key];
						input_temp.name = proposalData['inputs'][key].m_input_name;
						if (input_temp.input_type_name_e == 'checkbox-group') {
							var temp = JSON.parse(input_temp.value);
							if (Array.isArray(temp) && String(temp) !== '[]') {
								input_temp.value = temp.join();
							} else {
								input_temp.value = '';
							}
						}

						if (input_temp.input_type_name_e == 'file') {
							var temp = JSON.parse(input_temp.value);
							if (temp) {
								input_temp.filename = temp['filename'];
							}
						}

						this.Item['inputs'].push(input_temp);
					}
				}*/

				for (let key in this.Item['inputs']) {
					this.Item['inputs'][key].name = this.Item['inputs'][key].m_input_name;
					if (this.Item['inputs'][key].input_type_name_e == 'checkbox-group') {
						var temp = JSON.parse(this.Item['inputs'][key].value);
						if (Array.isArray(temp) && String(temp) !== '[]') {
							this.Item['inputs'][key].value = temp.join();
						} else {
							this.Item['inputs'][key].value = '';
						}
					}

					if (this.Item['inputs'][key].input_type_name_e == 'file') {
						var temp = JSON.parse(this.Item['inputs'][key].value);
						if (temp) {
							this.Item['inputs'][key].filename = temp['filename'];
						}
					}

					if (this.Item['inputs'][key].input_type_name_e == 'textarea' && this.Item['inputs'][key].value) {
						this.Item['inputs'][key].value = this.Item['inputs'][key].value.replace(/\t/g, "&nbsp;");
						this.Item['inputs'][key].value = this.Item['inputs'][key].value.replace(/\n/g, "<br>");
					}
				}

				// Add files_attach into Form Attachment
				for (let key in proposalData['files_attach']) {
					var filename = proposalData['files_attach'][key].filename;
					var file_type = filename.split('.');
					var area_upload = proposalData['files_attach'][key].area_upload;
					let item: any = { file: { name: filename, type: file_type[1], is_download: true, area_upload: area_upload }, _file: { id: proposalData['files_attach'][key].id, name: filename, type: file_type[1], is_keeping: true } };
					this.uploader.queue.push(item);
				}

				this.dataInput = this.Item['inputs'];
			} else {
				this._Router.navigate(['/']);
			}
		});
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
				this.loadProposalData();
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
	 * Check Session Created Form
	 *==============================================*/
	checkSessionCreatedForm(pettion_type, petition_id) {
		let sessionForm = this._LocalStorageService.get(pettion_type + '_' + petition_id);
		if(sessionForm) {
			return true;
		}
		return false;
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
		formData.append('petition_type', String(1));


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
		this.loadProposalData();
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

	protected clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
}
