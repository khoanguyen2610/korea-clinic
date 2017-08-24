export class MDepartment {
	public id: number; 
    public m_company_id: number; 
    public code: string; 
    public sub_code: string; 
    public name: string; 
    public description: string;
    public parent: number; 
    public level: number;
    public order: number;
    public allow_export_routes: number;
    public enable_start_date: Date;
    public enable_end_date: Date;
}