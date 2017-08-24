import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	//======================== API Config Variable ===============================
	// public server: string = "http://192.168.153.27/workflow/public/";
	public server: string = "http://vws-api.vision-vietnam.com/public/";
	public apiUrl: string = this.server + "api/v1/";
	public apiAuthUsername: string = "visionvn";
	public apiAuthPassword: string = "system_vws_vsvn";
	public apiAuth: string = btoa(this.apiAuthUsername + ':' + this.apiAuthPassword);

	//======================== System Config Variable ===============================
	public base_href = '';
	public session_expired = 8; //Session 8 hours
	public defaultLang = 'ja';
	public formatDate: string = "YYYY/MM/DD";
	public formatDateTS: string = "YYYY/MM/DD";
	public formatDateTimeTS: string = "YYYY/MM/DD HH:mm:ss";
	public formatDateMinTS: string = "YYYY/MM/DD HH:mm";
	public formatLocale: string = 'en-Us';

	//======================== Static Option Or Variable =====================
	public system_version = 'Version 2.0';
	public upload_file_extension = ['jpg', 'jpeg', 'gif', 'png', 'txt', 'csv', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'];

	//======================== Datatabe Configuration ========================
	public DtbPageLength = 20;
	public DtbLengthMenu = [10, 20, 50, 100];
	public limit_file_size = 5*1024*1024;
	public limit_files = 10;
	public limit_start_date = '0001-01-01';
	public limit_end_date = '3000-01-01';

	//======================== Route State Change ========================
	public allow_change_page = true;

	//======================== API Meeting Room ==========================
	public meetingroom_active = true;
	public meetingroom_server: string = "https://meeting-room.vision-vietnam.com/";
	public meetingroom_login_api = this.meetingroom_server + 'set_session';
	public meetingroom_logout_api = this.meetingroom_server + 'api/auths/logout?closed=true';
}
