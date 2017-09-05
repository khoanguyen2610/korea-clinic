import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	//======================== API Config Variable ===============================
	// public server: string = "http://clinic.laptrinhaz.com/api/public/";
	public server: string = "http://192.168.153.27/korea-clinic/public/";
	public apiUrl: string = this.server + "api/v1/";
	public apiAuthUsername: string = "visionvn";
	public apiAuthPassword: string = "system_vws_vsvn";
	public apiAuth: string = btoa(this.apiAuthUsername + ':' + this.apiAuthPassword);

	//======================== System Config Variable ===============================
	public base_href = '';
	public session_expired = 8; //Session 8 hours
	public defaultLang = 'en';
	public formatDate: string = "YYYY/MM/DD";
	public formatDateTime: string = "YYYY/MM/DD HH:mm:ss";
	public formatDateMin: string = "YYYY/MM/DD HH:mm";
	public formatLocale: string = 'en-Us';

	//======================== Static Option Or Variable =====================
	public system_version = 'Version 2.0';
	public upload_file_extension = ['jpg', 'jpeg', 'gif', 'png'];

	//======================== Datatabe Configuration ========================
	public DtbPageLength = 20;
	public DtbLengthMenu = [10, 20, 50, 100];
	public limit_file_size = 5*1024*1024; // 5Mb
	public limit_files = 10;

	//======================== Route State Change ========================
	public allow_change_page = true;

}
