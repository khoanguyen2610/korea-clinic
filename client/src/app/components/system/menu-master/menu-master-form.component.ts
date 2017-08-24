import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Configuration } from '../../../shared';
import { URLSearchParams } from '@angular/http';
import { MMenuService, MPositionService, MDepartmentService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MMenu } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Rx';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { BreadcrumbComponent } from '../../general';
declare let $: any;

@Component({
	selector: 'app-system-menu-master-form',
	templateUrl: './menu-master-form.component.html',
	providers: [MMenuService, MPositionService, MDepartmentService]
})
export class MenuMasterFormComponent implements OnInit {
	private subscription: Subscription;
	private subscriptionEvents: Subscription;
	private intervalRouteChanges;
	@ViewChild('confirm_modal') confirm_modal: ModalComponent;
	@ViewChild('apply_modal') apply_modal: ModalComponent;

	_params: any;
	objStatus = [
		{value: 0, label: '無効'},
		{value: 1, label: '有効'}
	];
	limitPositionOpts?: Array<any> = [];
	Item = new MMenu();
	departments = [];
	formBuilder: any;
	curRouting?: string;
	curNumberInputs: number = 0;

	constructor(private _Router: Router, private _ActivatedRoute: ActivatedRoute,
		private _MMenuService: MMenuService,
		private _MDepartmentService: MDepartmentService,
		private _MPositionService: MPositionService,
		private _ToastrService: ToastrService,
		private _Configuration: Configuration) {
		//=============== Get Params On Url ===============
		this.subscription = _ActivatedRoute.params.subscribe(
			(param: any) => this._params = param
		)
		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});
	}

	ngOnInit() {	
		// this.initData();
	}


	/*=================================
	 * Generate Data
	 *=================================*/
	initData(){
		/*=================================
		 * Get Limit Position Approval Form
		 *=================================*/
		const listMPosition$ = this._MPositionService.getLimitApprovalForm();


		/*=================================
		 * Get list department
		 *=================================*/
		let params: URLSearchParams = new URLSearchParams();
		params.set('level', '2');
		params.set('item_status', 'active');

		this._MDepartmentService.getAll(params).subscribe(res => {
			if (res.status == 'success') {
				var departments = [];
				for (let key in res.data) {
					departments.push({ id: res.data[key].id, text: res.data[key].name });
				}
				this.departments = departments;
			}
		});

		var language = {
			ja: {
				addOption: '追加',
				allFieldsRemoved: '全てのカラムが削除されました。',
				allowSelect: '全ての選択を許可する',
				autocomplete: '自動完成',
				button: 'ボタン',
				cannotBeEmpty: 'この項目は必須です。',
				checkboxGroup: 'チェックボックス',
				checkbox: 'チェックボックス',
				checkboxes: '複数のチェックボックス',
				header: 'ラベル',
				className: '種別',
				clearAllMessage: '全てのメッセージを削除?',
				clearAll: '全て削除',
				close: '閉じる',
				copy: 'コピー',
				dateField: 'カレンダー',
				description: '説明',
				descriptionField: '説明カラム',
				devMode: '開発モード',
				editNames: '名前編集',
				editorTitle: '様式',
				editXML: 'XML編集',
				fieldVars: '変動カラム',
				fieldNonEditable: '修正不可カラム',
				fieldRemoveWarning: 'カラム削除警告',
				fileUpload: 'ファイル指定',
				formUpdated: '様式更新',
				getStarted: '右側から案件をここにドラッグする',
				hide: '編集',
				hidden: '非表示されました',
				label: 'ラベル名',
				labelEmpty: 'ラベル名空欄不可',
				limitRole: '制限権限',
				mandatory: '必須',
				maxlength: '最大長さ',
				minOptionMessage: '最低選択数は2項目',
				name: 'ID',
				no: 'いいえ',
				off: 'オフ',
				on: 'オン',
				option: '選択',
				optional: '選択的',
				optionLabelPlaceholder: '選択名',
				optionValuePlaceholder: '選択値',
				optionEmpty: '選択必須',
				paragraph: '文章分け',
				placeholder: '記入例',

				placeholders: {
					value: '値',
					label: 'ラベル',
					text: 'テキスト',
					textarea: 'テキストエリア',
					email: 'メールを入力してください',
					placeholder: 'プレスホルダ',
					className: '複数の場合はスペースで区分ける',
					password: 'パスワードを入力してください'
				},
				preview: 'プレビュー',
				radioGroup: 'ラジオボタン',
				radio: 'ラジオボタン',
				removeMessage: '削除',
				// remove: '削除;',
				required: '必須',
				richText: '編集ボックス',
				roles: '役割',
				save: '保存',
				selectOptions: 'オプション選択',
				select: 'ドロップダウン',
				selectColor: '色選択',
				selectionsMessage: '複数選択可能',
				size: 'サイズ',
				style: 'スタイル',
				text: 'テキストボックス',
				textArea: 'テキストエリア',
				toggle: '切替',
				warning: '警告',
				viewXML: '&lt;/&gt;',
				yes: 'はい',
				// rows: '行数 ',
				value: '値',
				sizeWidth: 'サイズ(横)',
				unit: '単位'
			}
		};

		var options = {
			messages: language['ja'] || {},
			controlOrder: [
				'text',
				'checkbox-group',
				'radio-group',
				'file',
				'textarea',
				'select',
				'date',
				'header'
			],
			disableFields: [
				'button',
				'checkbox',
				'hidden',
				'paragraph',
				'number',
				'autocomplete',
				'rows'
			],
			dataType: 'json',
			showActionButtons: false,
			typeUserAttrs: {
				'text': {
					className: {
						label: 'Class',
						value: 'form-control'
					},
					sizeWidth: {
						label: 'サイズ(横)',
						options: {
							'small': '小',
							'medium': '中',
							'large': '大'
						},
					},
					unit: {
						label: '単位'
					},
					
				},
				'file': {
					className: {
						label: 'Class',
						value: 'form-control'
					}
				},
				'textarea': {
					className: {
						label: 'Class',
						value: 'form-control'
					},
					sizeWidth: {
						label: 'サイズ(横)',
						options: {
							'small': '小',
							'medium': '中',
							'large': '大'
						},
					}
				},
				'select': {
					className: {
						label: 'Class',
						value: 'form-control'
					},
					sizeWidth: {
						label: 'サイズ(横)',
						options: {
							'small': '小',
							'medium': '中',
							'large': '大'
						},
					}
				},
				'date': {
					className: {
						label: 'Class',
						value: 'form-control'
					}
				}

				
			}
		};
		/*=================================
		 * Get Item Data 
		 * method: update & :id not null
		 *=================================*/
		
		switch (this._params.method) {
			case "update":
				if (this._params.id != null) {
					const mMenuItem$ = this._MMenuService.getByID(this._params.id);
					listMPosition$.subscribe(res => {
						var limitPositionOpts = [];
						if (res.status == 'success') {
							for (let key in res.data) {
								let obj = { id: res.data[key].id, text: res.data[key].name };
								limitPositionOpts.push(obj);
							}
							this.limitPositionOpts = limitPositionOpts;
						}

						/*=================================
						 * Get Menu Master Detail Sync 
						 * with calling after listMPosition
						 *=================================*/
						mMenuItem$.subscribe(res => {
							if (res.status == 'success') {
								this.Item = res.data;

								for (let key in res.data.inputs) {
									res.data.inputs[key].name = res.data.inputs[key].id;
									res.data.inputs[key].sizeWidth = res.data.inputs[key].size_width;
									res.data.inputs[key].description = res.data.inputs[key].supplementation;
									res.data.inputs[key].value = res.data.inputs[key].default_value;
									res.data.inputs[key].values = [];
									res.data.inputs[key].required = res.data.inputs[key].required == '1' ? 1: 0;
									if (res.data.inputs[key].options_value) {

										var parseArr = JSON.parse(res.data.inputs[key].options_value);
										for (let k in parseArr) {

											var objTemp = {
												label: parseArr[k],
												value: parseArr[k]
											}

											res.data.inputs[key].values.push(objTemp);
										}
									}

									if(!res.data.inputs[key].label){
										res.data.inputs[key].label = ' ';
									}

								}
								options['formData'] = JSON.stringify(res.data.inputs);

								$('#fb-editor').html('');
								this.formBuilder = $('#fb-editor').formBuilder(options);
								if(this.formBuilder) {
									let actions = this.formBuilder.data('formBuilder').actions;
									let input_element = JSON.parse(actions.exportData());
									this.curNumberInputs = input_element.length;
								}
								
								if (res.data == null) {
									this._Router.navigate(['/system/menu-master']);
								}
							} else {
								this._Router.navigate(['/system/menu-master']);
							}

						});
					});

				}
				break;
			case "create":
				// Set Default Create
				this.curNumberInputs = 0;
				this.Item['enable_flg'] = '1';
				this.Item['add_file_flg'] = '1';
				listMPosition$.subscribe(res => {
					var limitPositionOpts = [];
					if (res.status == 'success') {
						for (let key in res.data) {
							let obj = { id: res.data[key].id, text: res.data[key].name };
							limitPositionOpts.push(obj);
						}
						this.limitPositionOpts = limitPositionOpts;
					}

					this.formBuilder =  $('#fb-editor').formBuilder(options);
				});
				
				break;
			default:
				this._Router.navigate(['/system/menu-master']);
				break;
		}

		this.intervalRouteChanges = setInterval(() => {
			let actions = this.formBuilder.data('formBuilder').actions;
			let input_element = JSON.parse(actions.exportData());
			if (input_element.length != this.curNumberInputs) {
				this._Configuration.allow_change_page = false;
			}
		}, 1000);
	}

	/*====================================
	 * Event selected of ng2-select - MIT
	 *====================================*/
	onNgSelected(e, area){
		// Set value of select 2 to ngModel
		switch (area) {
			case "department":
				this.Item['m_department_id'] = e.id;
				break;
			case "limit_position":
				this.Item['limit_m_position_id'] = e.id;
				break;
		}
	}

	/*====================================
	 * Catching Key Press
	 *====================================*/
	onChangeInput() {
		this._Configuration.allow_change_page = false;
	}
	

	/*=======================================================
	 * Save Menu Master
	 *=======================================================*/
	onSubmit(form: NgForm) {
		let actions = this.formBuilder.data('formBuilder').actions;
		let input_element = JSON.parse(actions.exportData());	
		if (input_element.length) {
			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('m_department_id', this.Item['m_department_id']);
			paramData.set('name', this.Item['name']);
			paramData.set('description', this.Item['description']);
			paramData.set('limit_m_position_id', this.Item['limit_m_position_id']);
			paramData.set('enable_flg', this.Item['enable_flg']);
			paramData.set('add_file_flg', this.Item['add_file_flg']);
			paramData.set('input_element', JSON.stringify(input_element));

			if (this._params.method == 'update') {
				paramData.set('id', String(this.Item['id']));
				this._MMenuService.save(paramData, this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('情報を登録しました。');
					}
				});
			} else if (this._params.method == 'create') {
				this._MMenuService.save(paramData).subscribe(res => {
					if (res.status == 'success') {
						form.reset();
						actions.clearFields();
						this._ToastrService.success('情報を登録しました。');
					}
				});
			}

			//allow change route
			var repeat:number = 0;
	        var loadInterval = setInterval(() => {
									this._Configuration.allow_change_page = true;
									repeat++;
									if(repeat >= 5){
										clearInterval(loadInterval);
									}
								}, 500);
		}else{
			this._ToastrService.error('様式に項目を追加してください。');
		}
		
	}

	/*=======================================================
	 * Save Menu Master
	 *=======================================================*/
	onSaveDraft(form: NgForm) {
		if (this.formBuilder) {
			var actions = this.formBuilder.data('formBuilder').actions;
			var input_element = JSON.parse(actions.exportData());

			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('m_department_id', this.Item['m_department_id']);
			paramData.set('name', this.Item['name']);
			paramData.set('description', this.Item['description']);
			paramData.set('limit_m_position_id', this.Item['limit_m_position_id']);
			paramData.set('enable_flg', '2');
			paramData.set('add_file_flg', this.Item['add_file_flg']);
			paramData.set('input_element', JSON.stringify(input_element));
			paramData.set('method', 'draft');

			if (this._params.method == 'update') {
				paramData.set('draft_id', String(this.Item['id']));
				this._MMenuService.save(paramData, this.Item['id']).subscribe(res => {
					if (res.status == 'success') {
						this._ToastrService.success('下書を作成しました。');
						this._Router.navigate(['/system/menu-master']);
					}
				});
			}
			
			//allow change route
			var repeat:number = 0;
	        var loadInterval = setInterval(() => {
									this._Configuration.allow_change_page = true;
									repeat++;
									if(repeat >= 5){
										clearInterval(loadInterval);
									}
								}, 500);
		}
	}

	/*=================================
	 * Detect on modal close
	 *=================================*/
	onConfirmDeleteDraft(){
		this.confirm_modal.open('sm');
	}

	/*=================================
	 * Detect on modal close
	 *=================================*/
	onDeleteDraft(){
		this._MMenuService.delete(this.Item['id']).subscribe(res => {
			if (res.status == 'success') {
				this._ToastrService.success('下書を削除しました。');
				this._Router.navigate(['/system/menu-master']);
			}
			
		});
		this.confirm_modal.close();
	}


	/*=================================
	 * Detect on modal close
	 * Confirm apply draft
	 *=================================*/
	onConfirmApplyDraft(){
		this.apply_modal.open('sm');
	}

	/*=================================
	 * Detect on modal close
	 * Confirm apply draft => update data
	 *=================================*/
	onApplyDraft(){
		if (this.formBuilder) {
			var actions = this.formBuilder.data('formBuilder').actions;
			var input_element = JSON.parse(actions.exportData());

			let paramData: URLSearchParams = new URLSearchParams();
			paramData.set('m_department_id', this.Item['m_department_id']);
			paramData.set('name', this.Item['name']);
			paramData.set('description', this.Item['description']);
			paramData.set('limit_m_position_id', this.Item['limit_m_position_id']);
			paramData.set('enable_flg', '1');
			paramData.set('add_file_flg', this.Item['add_file_flg']);
			paramData.set('input_element', JSON.stringify(input_element));
			paramData.set('method', 'apply_draft');
			paramData.set('draft_id', String(this.Item['draft_id']));
			paramData.set('id', String(this.Item['id']));



			this._MMenuService.save(paramData, this.Item['id']).subscribe(res => {
				if (res.status == 'success') {
					this._ToastrService.success('様式を公開しました');
					this._Router.navigate(['/system/menu-master/update', this.Item['draft_id']]);
				}
			});
		}
		this.apply_modal.close();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscriptionEvents.unsubscribe();
		this.apply_modal.ngOnDestroy();
		this.confirm_modal.ngOnDestroy();
		clearInterval(this.intervalRouteChanges);
	}

}
