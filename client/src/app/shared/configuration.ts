import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	//======================== API Config Variable ===============================
	public server: string = "http://api-dev.whiteclinic.com.vn/public/";
	// public server: string = "http://192.168.153.27/korea-clinic/public/";
	public apiUrl: string = this.server + "api/v1/";
	public apiAuthUsername: string = "visionvn";
	public apiAuthPassword: string = "system_vws_vsvn";
	public apiAuth: string = btoa(this.apiAuthUsername + ':' + this.apiAuthPassword);

	//======================== System Config Variable ===============================
	public base_href = '';
	public base_url_image = this.server +  'files/';
	public session_expired = 8; //Session 8 hours
	public defaultLang: string = 'vi';
	public language_code: string;
	public formatDate: string = "YYYY/MM/DD";
	public formatDateTime: string = "YYYY/MM/DD HH:mm:ss";
	public formatDateMin: string = "YYYY/MM/DD HH:mm";
	public formatLocale: string = 'en-Us';
	public news_format_date: string = 'MMMM, DD YYYY';

	//======================== Static Option Or Variable =====================
	public system_version = 'Version 2.0';
	public upload_file_extension = ['jpg', 'jpeg', 'gif', 'png'];

	//======================== Datatabe Configuration ========================
	public DtbPageLength = 20;
	public DtbLengthMenu = [10, 20, 50, 100];
	public limit_file_size = 3*1024*1024; // 10Mb
	public limit_files = 10;

	//======================== Route State Change ========================
	public allow_change_page = true;

	//======================== SEO ========================
	public metas = ['meta_title', 'meta_description', 'meta_keyword', 'meta_tag'];
	public meta_title = '';
	public meta_description = '';
	public meta_keyword = '';
	public meta_tag = '';
}
