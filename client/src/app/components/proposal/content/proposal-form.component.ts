import { Component, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgStyle, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Configuration } from '../../../shared';
import { MUser, UserConcurrent } from '../../../models';
import { MMenuService, TProposalService, AuthService, GeneralService } from '../../../services';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { BreadcrumbComponent } from '../../general';
import { LocalStorageService } from 'angular-2-local-storage';

declare let $: any;
declare let moment: any;
declare let proposal_create: any;

const OTHER = 'その他';
const METHOD = {
	COPY: 'copy',
	CREATE: 'create',
	UPDATE: 'update',
};

@Component({
	selector: 'app-proposal-form',
	templateUrl: './proposal-form.component.html',
	providers: [MMenuService, TProposalService, GeneralService]
})
export class ProposalFormComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;

	current_user_info = {};
	curRouting?: string;
	counterValue = 3;
	minValue = 0;
	maxValue = 12;
	_params: any;
	Item = {};
	is_validated = false;
	is_draft_validated = false;
	uploadProgress: any;
	files_type = [];
	files_upload = 0;
	user_create_form = {};

	@ViewChild('modal') modal: ModalComponent;


	public uploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public hasAnotherDropZoneOver: boolean = false;


	constructor(
		private _ActivatedRoute: ActivatedRoute,
		private _Location: Location,
		private _Router: Router,
		private _Configuration: Configuration,
		private _FormBuilder: FormBuilder,
		private _MMenuService: MMenuService,
		private _TProposalService: TProposalService,
		private _AuthService: AuthService,
		private _ToastrService: ToastrService,
		private _GeneralService: GeneralService,
		private _LocalStorageService: LocalStorageService
	) {
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		)
		this.current_user_info = this._AuthService.getCurrent();
		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});

		//Allow extension file upload
		this.files_type = this._Configuration.upload_file_extension;
	}

	ngOnInit() {
		proposal_create.toggleMenu();
	}

	initData() {
		this.uploader = new FileUploader({});
		// Get current login user
		let self = this;
		switch (this._params['method']) {

			case "create":
				this.getMenuInputDetail(this._params['id']);

				break;
			case METHOD.UPDATE:
			case METHOD.COPY:
				this._TProposalService.getByID(this._params['id']).subscribe(res => {
					let formData = res.data;
					if (res.status == 'success' && formData) {
						// When method = 'update' and m_petition_status_id = 1
						if (this._params['method'] == METHOD.UPDATE && formData['m_petition_status_id'] != 1) {
							this._Router.navigate(['/']);
							return;
						}
						this.getMenuInputDetail(formData['m_menu_id'], formData);
					} else {
						this._Router.navigate(['/']);
					}
				});
				break;
		}

		setTimeout(() => {
			$('.daterange-single').datetimepicker({
				locale: 'ja',
				format: self._Configuration.formatDate,
			});
		}, 2000);


	}

	/*==============================================
	 * Get Menu Input Detail
	 *==============================================*/
	getMenuInputDetail(m_menu_id, proposalData = null) {
		this._MMenuService.getMenuInputDetail(m_menu_id).subscribe(res => {
			if (res.status == 'success' && res.data) {
				this.Item = res.data;

				//check enable flag of menu master
				if(res.data.enable_flg == 0){
					this._ToastrService.error('この様式は無効になっています。');
					this._Router.navigate(['/']);
				}

				this.Item['m_user_id'] = this.current_user_info['id'];
				this.Item['form_name'] = this.clone(this.Item['name']);
				this.Item['name'] = '';
				this.Item['priority_flg'] = '0';
				this.Item['change_route'] = '0';
				if(this._params['method'] == 'update') {
					this.user_create_form = proposalData['user_create_form'];
				}

				for (let key in this.Item['inputs']) {
					if (this.Item['inputs'][key].default_value) {
						this.Item['inputs'][key].value = this.Item['inputs'][key].default_value;
					}

					if (this.Item['inputs'][key].options_value) {
						this.Item['inputs'][key].options = JSON.parse(this.Item['inputs'][key].options_value);

					}
					if (!this.Item['inputs'][key].placeholder) {
						this.Item['inputs'][key].placeholder = '';
					}

					this.Item['inputs'][key].input_class = this.getSizeWidth(this.Item['inputs'][key].size_width);


					if (this.Item['inputs'][key].input_type_name_e == 'checkbox-group') {
						this.Item['inputs'][key].is_checked = false;
						this.Item['inputs'][key].optionsMap = this.initOptionsMap(this.Item['inputs'][key].options);
					}

					if (this.Item['inputs'][key].input_type_name_e == 'file') {
						this.Item['inputs'][key].uploader = new FileUploader({});
					}

				}
				this.Item['current_date'] = moment().format(this._Configuration.formatDate);

				// Case Update Form
				if(proposalData) {
					this.Item['id'] = proposalData['id'];
					this.Item['files_attach'] = proposalData['files_attach'];
					this.Item['name'] = proposalData['name'];
					this.Item['priority_flg'] = proposalData['priority_flg'];
					this.Item['change_route'] = proposalData['change_route'];

					for (let key in this.Item['inputs']) {
						let inputForm = this.Item['inputs'][key];
						var input = proposalData['inputs'][inputForm.m_input_id];
						if(input) {
							inputForm.value = input.value;
							inputForm.id = input.id;
							inputForm.m_input_id = input.m_input_id;
						} else {

							for (let i in proposalData['inputs']) {
								if (proposalData['inputs'][i].m_input_type_id == inputForm.input_type_id && proposalData['inputs'][i].m_input_name == inputForm.name) {
									inputForm.value = proposalData['inputs'][i].value;
									input = {
										value: inputForm.value
									};
								}
							}

						}
						if (input)  {
							switch (inputForm.input_type_name_e) {
								case "radio-group":
									for (let k in inputForm.options) {

										if (inputForm.options[k] == OTHER && input.value != null) {
											inputForm.value = inputForm.options[k];
											inputForm.other = input.value;
											inputForm.radio_other = true;
										}
									}
									break;

								case "select":
									for (let k in inputForm.options) {

										if (inputForm.options[k] == OTHER && input.value != null) {
											inputForm.value = inputForm.options[k];
											inputForm.other = input.value;
											inputForm.selected_other = true;
										}
									}
									break;

								case "checkbox-group":
									for (let k in inputForm.options) {
										if (input.value != null) {
											inputForm.is_checked = true;
											let checkOptions = JSON.parse(input.value);
											let has_other = false;
											for (let i in checkOptions) {

												if (inputForm.options.indexOf(checkOptions[i]) > -1) {
													inputForm.optionsMap[checkOptions[i]] = true;
												} else {
													inputForm.optionsMap[OTHER] = true;
													has_other = true;
												}


											}
											if (has_other) {
												let other_value = checkOptions.pop();
												inputForm.optionsMap[OTHER] = true;
												inputForm.other = other_value;
												inputForm.checked_other = true;
											} else {
												inputForm.other = '';
												inputForm.checked_other = false;
											}
										}

									}
									break;

								case "file":
									if (input.value != null) {
										let file_input = JSON.parse(input.value);
										inputForm.is_download = true;
										let item: any = { file: { name: file_input.filename, type: '', is_download: true }, _file: { id: file_input.id, name: file_input.filename, type: '' } };
										inputForm.uploader.queue.push(item);
									}
									break;
								case "textarea":
									if (inputForm.value) {
										inputForm.value = inputForm.value.replace(/\<br.*[\/]?\>/g, "");
									}

									break;

							}
						}


					}

					// Add files_attach into Form Attachment
					for (let key in proposalData['files_attach']) {
						var filename = proposalData['files_attach'][key].filename;
						var file_type = filename.split('.');
						let item: any = { file: { name: filename, type: file_type[1], is_download: true }, _file: { id: proposalData['files_attach'][key].id, name: filename, type: file_type[1], is_keeping: true } };
						this.uploader.queue.push(item);
					}

				}
			} else {
				// this._Router.navigate(['/']);
			}
		});
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

	/*==============================================
	 * Remove input file
	 *==============================================*/
	onRemoveInputFile(inputForm) {
		inputForm.uploader.queue = [];
		inputForm.is_download = false;
		inputForm.value = null;
	}

	/*==============================================
	 * Catching on change to update checked checkbox
	 *==============================================*/
	onUpdateCheckedOptions(item, option, event) {
		item.optionsMap[option] = event.target.checked;
		for(let key in item.optionsMap) {
			if (item.optionsMap[key] && key == OTHER) {
				item.checked_other = true;
			} else {
				item.checked_other = false;
			}
		}
		this.isCheckedCheckbox(item);
	}

	/*==============================================
	 * Catching on change radio
	 *==============================================*/
	onSelectedOtherRadio(item, option) {
		if (option === OTHER) {
			item.radio_other = true;
		} else {
			item.radio_other = false;
		}
	}

	/*==============================================
	 * Catching on change select box
	 *==============================================*/
	onSelectedOtherSelect(item, option) {
		if (option === OTHER) {
			item.selected_other = true;
		} else {
			item.selected_other = false;
		}
	}

	onCheckFocusValidate() {
		return true;
	}

	// onShowHelper(e, type:string = null) {
	// 	var target = e.target.parentElement.parentElement.parentElement.querySelector('label .help-text-inner');
	// 	if (type == 'show') {
	// 		target.style.display = 'block';
	// 	} else {
	// 		target.style.display = 'none';
	// 	}

	// }


	validateFieldName() {
		this.is_draft_validated = true;
		if(this.Item['name']) {
			return true;
		}
		return false;
	}

	/*==============================================
	 * Save with Validate
	 *==============================================*/
	onSave() {
		// Check validate field Name
		if(!this.validateFieldName()) {
			$('#proposal_name').focus();
			return;
		}
		this.is_validated = true;

		// Check form inputs
		let fallenValidated = false;

		for(let key in this.Item['inputs']) {
			var item_input_value = this.Item['inputs'][key].value;
			if(typeof item_input_value == "string"){
				item_input_value = item_input_value.trim();
			}
			if (!item_input_value && this.Item['inputs'][key].required == '1') {
				fallenValidated = true;

				if (this.Item['inputs'][key].input_type_name_e == 'text' || this.Item['inputs'][key].input_type_name_e == 'textarea'
					|| this.Item['inputs'][key].input_type_name_e == 'date' || this.Item['inputs'][key].input_type_name_e == 'select') {
					$("#" + this.Item['inputs'][key].input_type_name_e + key).focus();
					return;
				}

			} else {
				// Check radio options other
				if (this.Item['inputs'][key].radio_other && !this.Item['inputs'][key].other) {
					fallenValidated = true;
				}

				// Check checkbox options other
				if (this.Item['inputs'][key].checked_other && !this.Item['inputs'][key].other) {
					fallenValidated = true;
				}

				// Check selectbox options other
				if (this.Item['inputs'][key].selected_other && !this.Item['inputs'][key].other) {
					fallenValidated = true;
				}
			}

			if (this.Item['inputs'][key].input_type_name_e == 'checkbox-group') {
				this.Item['inputs'][key].value = this.updateOptions(this.Item['inputs'][key].optionsMap);
				if (!this.Item['inputs'][key].value.length && this.Item['inputs'][key].required == '1') {
					fallenValidated = true;
				}
			}
		}

		if (!fallenValidated) {
			this.savingData('apply');
		}
	}

	/*==============================================
	 * Saving Data
	 *==============================================*/
	protected savingData(type: string) {
		// apply_type {apply , draft}
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

		for (let key in this.Item['inputs']) {
			if (this.Item['inputs'][key].input_type_name_e == 'file' && this.Item['inputs'][key].uploader.queue.length) {
				var file = this.Item['inputs'][key].uploader.queue[0]._file;
				formData.append("upload_inputs[" + this.Item['inputs'][key].m_input_id + "]", file, file.name);

				var temp_uploader = {
					queue: [
						{ file: { name: file.name, type: file.type, is_download: !!file.id }, _file: { id: file.id, name: file.name, type: file.type } }
					]
				};

				this.Item['inputs'][key].uploader = JSON.parse(JSON.stringify(temp_uploader));
			}

		}

		if(this._params['method'] != METHOD.CREATE) {
			formData.append('files_attach', JSON.stringify(this.Item['files_attach']));
		}

		formData.append('method', this._params['method']);
		formData.append('apply_type', type);
		formData.append('m_menu_id', this.Item['m_menu_id']);
		formData.append('m_menu_code', this.Item['m_menu_code']);
		formData.append('m_user_id', this.Item['m_user_id']);
		formData.append('name', this.Item['name']);
		formData.append('date', this.Item['current_date']);
		formData.append('priority_flg', this.Item['priority_flg']);
		formData.append('change_route', this.Item['change_route']);
		formData.append('inputs', JSON.stringify(this.Item['inputs']));
		if(this._params['method'] == METHOD.COPY) {
			formData.append('copy_petition_id', this._params['id']);
		}


		this._TProposalService.getObserver()
			.subscribe(progress => {
				this.uploadProgress = progress;

			});
		try {
			result =  this._TProposalService.upload(formData, this.Item['id']).then((res) => {
				if (res.status == 'success') {
					$('.loading').hide();
					if(type == 'draft') {
						this._ToastrService.success('起案を保存しました。');
						this._Router.navigate(['/']);
					} else {
						var now = new Date().getTime();
						this.createSessionCreatedForm(1, res.record_id, now);
						if (this.Item['change_route'] === '1') {
							this._Router.navigate(['/proposal/set-routes', res.record_id]);
						} else {
							let current_path = '/proposal/form/update/' + res.record_id;
							this._Router.navigate(['/proposal/detail', res.record_id], { queryParams: { previous_page: encodeURIComponent(current_path) } });
						}
					}
				}
			});
		} catch (error) {
			document.write(error)
		}

	}

	/*==============================================
	 * Save Draft
	 *==============================================*/
	onSaveDraft() {
		if (!this.validateFieldName()) {
			$('#proposal_name').focus();
			return;
		}

		for (let key in this.Item['inputs']) {

			if (this.Item['inputs'][key].input_type_name_e == 'checkbox-group') {
				this.Item['inputs'][key].value = this.updateOptions(this.Item['inputs'][key].optionsMap);
			}
		}
		this.savingData('draft');
	}

	/*==============================================
	 * Reset Form
	 *==============================================*/
	onReset() {
		this.is_validated = false;
		this.Item['name'] = '';
		this.Item['priority_flg'] = '0';
		this.Item['change_route'] = '0';

		// Clear all input fields
		let inputs = this.Item['inputs']
		for(let key in inputs) {
			let input = inputs[key];

			switch (input.input_type_name_e) {
				case "checkbox-group":
					input.optionsMap = this.initOptionsMap(input.options);
					input.checked_other = false;
					input.other = '';
					input.value = '';
					break;
				case "radio-group":
					input.radio_other = false;
					input.other = '';
					input.value = '';
					break;
				case "select":
					input.selected_other = false;
					input.other = '';
					input.value = '';
					break;
				case "file":
					input.uploader = new FileUploader({});
					break;
				default:
					input.value = '';
					break;
			}

		}

		// reset file upload
		this.uploader = new FileUploader({});
		for (let k in this.Item['files_attach']) {
			this.Item['files_attach'][k].is_deleted = true;
		}

	}

	/*==============================================
	 * Change File Input with validate file type
	 *==============================================*/
	onChangeFileInput(item) {

		setTimeout(() => {
			let key = +item.uploader.queue.length;

			if (key - 1 >= 0) {

				var checked = false;
				for (let k in this.files_type) {
					if (item.uploader.queue[key - 1]._file.type.indexOf(this.files_type[k]) > 0) {
						checked = true;
						break;
					}
				}
				if (item.uploader.queue[key - 1]._file.size > this._Configuration.limit_file_size) {
					checked = false;
				}

				if (!checked) {
					this._ToastrService.error('アップロードファイルの形式は正しくないです。');
					item.uploader.queue.splice(key - 1, 1);
				} else {
					if (key - 1 > 0) {
						item.uploader.queue.splice(0, 1);
					}

				}
			}
		}, 500);

	}

	/*==============================================
	 * Download Form
	 *==============================================*/
	onDownloadForm(attachment_id, type: string) {
		/*==============================================
		 * Get Link Download File
		 *==============================================*/
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
		this._TProposalService.delete(this._params['id']).subscribe(res => {
			if (res.status == 'success') {
				this._ToastrService.success('データを削除しました。');
				this._Router.navigate(['/']);
			}
		})
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

						if(!checked) {
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
	 * Create Session Created Form
	 *====================================*/
	createSessionCreatedForm(petition_type, petition_id, time) {
		this._LocalStorageService.set(petition_type + '_' + petition_id, { petition_id: petition_id, time: time });
	}

	/*====================================
	 * Checked Checkbox
	 *====================================*/
	isCheckedCheckbox(item) {
		let is_checked = false;
		for (var x in item.optionsMap) {
			if (item.optionsMap[x]) {
				is_checked = true;
				break;
			}
		}
		item.is_checked = is_checked;
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e: any): void {
		this.onValidateFormFileType();
		this.hasAnotherDropZoneOver = e;
	}

	/*==============================================
	 * Update Options Selected Checkbox
	 *==============================================*/
	protected updateOptions(optionsMap) {
		let optionsChecked = [];
		for (var x in optionsMap) {
			if (optionsMap[x]) {
				optionsChecked.push(x);
			}
		}
		return optionsChecked;
	}

	/*==============================================
	 * Initialize Options Mapping Checkbox
	 *==============================================*/
	protected initOptionsMap(options) {
		let obj = {};
		for(let k in options) {
			obj[options[k]] = false;
		}
		return obj;
	}

	/*==============================================
	 * Get Size Width
	 *==============================================*/
	protected getSizeWidth(size_width) {
		let input_class = 'input-small';
		switch (size_width) {
			case "400":
			case "medium":
				input_class = 'input-medium';
				break;
			case "800":
			case "large":
				input_class = 'input-large';
				break;
		}
		return input_class;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
		this.modal.ngOnDestroy();
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
