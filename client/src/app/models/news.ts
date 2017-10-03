export class News {
	public id: number;
	public news_category_id: string;
	public language_code: string;
	public item_key: string;
	public title: string;
	public order: number;
	public description: string = '';
	public content: string = '';
	public feature: number = 0;
	public image: any;
	public image_title: any;
	public date: any;
	public meta_title: string;
	public meta_description: string;
	public meta_keyword: string;
	public meta_tag: string;
}
