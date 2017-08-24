import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Configuration } from '../../../shared';
import { GeneralService, TCommentService, AuthService } from '../../../services';
import { ToastrService } from 'ngx-toastr';

declare let $: any;
declare let moment: any;
declare let general: any;

@Component({
	selector: 'app-comment',
	templateUrl: './comment.component.html',
	providers: [GeneralService, LocalStorageService, TCommentService, AuthService]
})
export class CommentComponent implements OnInit {
	

	@ViewChild('modalConfirm') modalConfirm: ModalComponent;
	@Input('comment') dataComment: Array<any> = [{ children: [{ children: [], parent: 0 }], parent: 0 }];
	@Input('item') dataItem = {};
	@Output('replied') replied = new EventEmitter();
	delete_item: any;
	current_user_info = {};

	constructor(private _Router: Router,
		private _Configuration: Configuration,
		private _TCommentService: TCommentService,
		private _ToastrService: ToastrService,
		private _AuthService: AuthService,
		private _ActivatedRoute: ActivatedRoute
	) {
		
	}

	ngOnInit() {
		this.current_user_info = this._AuthService.getCurrent();
	}

	ngAfterViewInit(){
		setTimeout(() => {
			this.toggleContent();
			$('.discuss-wrapper').mCustomScrollbar();
		}, 1500);
		
	}

	/*=================================
	 * Toggle Content JQuery
	 *=================================*/
	toggleContent(){
		var showTotalChar = 200, showChar = "もっと見る (+)", hideChar = "隠す (-)";
		$('.text-inner').each(function() {
			var content = $(this).html();
			if (content.length > showTotalChar) {
				var con = content.substr(0, showTotalChar);
				var hcon = content.substr(showTotalChar, content.length - showTotalChar);
				var txt= con + '<span class="dots">...</span><span class="morectnt"><span>' + hcon + '</span>&nbsp;&nbsp;<a href="" class="showmoretxt">' + showChar + '</a></span>';
				$(this).html(txt);
			}
		});
		$(".showmoretxt").click(function() {
			if ($(this).hasClass("sample")) {
				$(this).removeClass("sample");
				$(this).html(showChar);
			} else {
				$(this).addClass("sample");
				$(this).html(hideChar);
			}
			$(this).parent().prev().toggle();
			$(this).prev().toggle();
			return false;
		});
	}

	/*=================================
	 * Save comment
	 *=================================*/
	onReply(item, level) {
		let paramData: URLSearchParams = new URLSearchParams();
		paramData.set('petition_id', this.dataItem['petition_id']);
		paramData.set('petition_type', this.dataItem['petition_type']);
		paramData.set('content', item['child_content']);
		paramData.set('m_user_id', this.current_user_info['id']);
		if(level) {
			paramData.set('parent', item['id']);
			paramData.set('level', level);
		} else {
			paramData.set('parent', '0');
			paramData.set('level', '0');
		}


		this._TCommentService.save(paramData).subscribe(res => {
			if (res.status == 'success') {
				setTimeout(() => {
					this.toggleContent();
				}, 1000);
				item['child_content'] = '';
				this._ToastrService.success('コメントを追加しました。');
				this.replied.emit();
			}
		})
	}

	/*=================================
	 * Delete current comment
	 *=================================*/
	onDelete() {
		this.modalConfirm.close();
		this._TCommentService.delete(this.delete_item.id).subscribe(res => {
			if(res.status == 'success') {
				setTimeout(() => {
					this.toggleContent();
				}, 500);
				this._ToastrService.success('コメントを削除しました。');
				this.replied.emit();

			}
		})
	}

	/*====================================
	 * Function open modal confirm delete
	 *====================================*/
	onOpenModalConfirm(item) {
		this.delete_item = item;
		this.modalConfirm.open('sm');
	}

	/*====================================
	 * Convert DateTime
	 *====================================*/
	convertDateTime(date_time) {
		if (date_time) {
			return moment(date_time).format(this._Configuration.formatDateTimeTS);
		}
		return;
	}

	ngOnChanges() {
	}

	/*=================================
	 * Check user with 2 authority
	 *=================================*/
	onReplyMessage(item) {
		for(let key in this.dataComment) {
			
			let comment = this.dataComment[key];
			comment.is_reply = false;
			for (let k in comment.children) {
				comment.children[k].is_reply = false;

			}
		}
		item.is_reply = true;
	}

	ngOnDestroy(){
		this.modalConfirm.ngOnDestroy();
	}
}
