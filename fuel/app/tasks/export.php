<?php
namespace Fuel\Tasks;

class Export
{	
    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Action export data form 0.4 - "購入精算"
     * Input: start_date
     *=============================================================*/
    public static function data_form_purchase_csv($start_month){
        $rest = new \Vision_Rest();

        $param = ['start_month' => $start_month];
        $start_date = isset($param['start_date'])?date('Y-m-d', strtotime($param['start_date'])):date('Y-m-d');
        $end_date = isset($param['end_date'])?date('Y-m-d', strtotime($param['end_date'])):date('Y-m-d');

        $start_month = isset($param['start_month'])?date('Y-m', strtotime($param['start_month'])):date('Y-m');
        $get_start_month = date('n', strtotime($start_month));
        $end_month = isset($param['end_month'])?date('Y-m', strtotime($param['end_month'])):date('Y-m');
        $get_end_month = date('n', strtotime($end_month));



        setlocale(LC_ALL, "en_US.UTF-8");

        while($start_month <= $end_month){
            $filePath = FILESPATH . '/form_data/purchase/' . $start_month . '.csv';
            $handle = fopen($filePath, 'w+');
            fputs($handle, $bom =( chr(0xEF) . chr(0xBB) . chr(0xBF) ));
            $header = ['起案番号','所属部門名称','所属部門コード','社員番号','申請者','申請名称','申請日', '種別', '件名','理由','優先度', '決裁経路変更', '状況',
                        '購入日', '購入先', '購入品名', '金額', 
                        '【金額】', '【仮払金額】', '【精算金額】'];

            fputcsv($handle, $header);            


            //======================== Begin Get Form From Other API ===============================

            $query = \DB::select('SM.id')
                            ->from(['t_request', 'SM'])
                            ->where('SM.m_request_menu_id', '=', 6)
                            ->and_where('SM.item_status', '=', 'active')
                            ->and_where('SM.date', 'LIKE', $start_month . '%')
                            ->order_by('SM.date', 'ASC');
            $arrForms = $query->execute()->as_array();
            if(!empty($arrForms)){
                $query = \DB::select('SM.id', 'SM.item')
                            ->from(['m_expense_item', 'SM'])
                            ->where('SM.item_status', '=', 'active');
                $expenseItemOption = $query->execute()->as_array('id', 'item');

                foreach ($arrForms as $val) {
                    $form_id = $val['id'];
                    $url = 'trequest/detail/' . $form_id;
                    $api_res = json_decode($rest->request($url, 'get'));
                    if($api_res->status == 'success'){
                        $item = $api_res->data;
                        // echo '<pre>';
                        // print_r($item);
                        // echo '</pre>';
                        // die;
                        if(!empty($item)){
                            
                            $code = $item->code;
                            $user_create_department_name = isset($item->user_create_form->department_name)?$item->user_create_form->department_name:null;
                            $user_create_department_code = isset($item->user_create_form->department_code)?$item->user_create_form->department_code:null;
                            $user_create_staff_no = isset($item->user_create_form->staff_no)?$item->user_create_form->staff_no:null;
                            $user_create_fullname = isset($item->user_create_form->fullname)?$item->user_create_form->fullname:null;
                            $request_menu_name = $item->request_menu_name;
                            $date = $item->date;
                            $name = $item->name;

                            $reason = $item->reason;
                            $reason = str_replace(["\r", "\n"], " ", $reason); 

                            $priority_flg = ($item->priority_flg == 0)?'通常':'優先';
                            $change_route = ($item->change_route == 0)?'無':'有';
                            $m_petition_status_id = $item->m_petition_status_id;
                            $m_petition_status_name = $item->m_petition_status_name;

                            $m_expense_item_id = $item->m_expense_item_id;
                            $m_expense_item_id = @$expenseItemOption[$item->m_expense_item_id];


                            $amount = $item->amount;
                            $suspense_payments = $item->suspense_payments;
                            $settlement_amount = $item->settlement_amount;



                            $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                        $user_create_fullname, $request_menu_name, $date, $m_expense_item_id, $name, $reason,
                                        $priority_flg, $change_route, $m_petition_status_name]; 

                            // fputcsv($handle, array_merge($basicData, ['', '', '', '', $amount, $suspense_payments, $settlement_amount]));

                            $t_purchase_reception_spec = $item->t_purchase_reception_spec;
                            //Get Detail information
                            if(!empty($t_purchase_reception_spec)){
                                
                                $i = 0;
                                foreach ($t_purchase_reception_spec as $item_purchase) {
                                    $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                        $user_create_fullname, $request_menu_name, $date, $m_expense_item_id, $name, $reason,
                                        $priority_flg, $change_route, $m_petition_status_name];  

                                    if($i != 0){
                                        $temp = [];
                                        foreach ($basicData as $key => $value) {
                                            $temp[] = '';
                                        }       
                                        $basicData = $temp;
                                    }


                                    $detail_reception_date = $item_purchase->reception_date;
                                    $detail_reception_target = $item_purchase->reception_target;
                                    $detail_target_item = $item_purchase->target_item;
                                    $detail_payments = $item_purchase->payments;


                                    $detailData = [$detail_reception_date, $detail_reception_target, $detail_target_item, $detail_payments];
                                    fputcsv($handle, array_merge($basicData, $detailData, [$amount, $suspense_payments, $settlement_amount]));

                                    $i++;
                                }
                            }else{
                                $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                        $user_create_fullname, $request_menu_name, $date, $m_expense_item_id, $name, $reason,
                                        $priority_flg, $change_route, $m_petition_status_name]; 

                                fputcsv($handle, array_merge($basicData, ['', '', '', '', $amount, $suspense_payments, $settlement_amount]));
                            }
                        }
                    }
                }
            }

            $start_month = date('Y-m', strtotime('+1 month', strtotime($start_month)));
            $get_start_month++;
        }
        fclose($handle);
        exit;
    }
	/*=============================================================
     * Author: Nguyen Anh Khoa
     * Action export data form 0.4 - "交通費精算"
     * Input: start_date
     *=============================================================*/
    public static function data_form_transport_csv($start_month){
    	$rest = new \Vision_Rest();

        $param = ['start_month' => $start_month];
        $start_date = isset($param['start_date'])?date('Y-m-d', strtotime($param['start_date'])):date('Y-m-d');
        $end_date = isset($param['end_date'])?date('Y-m-d', strtotime($param['end_date'])):date('Y-m-d');

        $start_month = isset($param['start_month'])?date('Y-m', strtotime($param['start_month'])):date('Y-m');
        $get_start_month = date('n', strtotime($start_month));
        $end_month = isset($param['end_month'])?date('Y-m', strtotime($param['end_month'])):date('Y-m');
        $get_end_month = date('n', strtotime($end_month));



        setlocale(LC_ALL, "en_US.UTF-8");

        while($start_month <= $end_month){
            $filePath = FILESPATH . '/form_data/transport/' . $start_month . '.csv';
            $handle = fopen($filePath, 'w+');
            fputs($handle, $bom =( chr(0xEF) . chr(0xBB) . chr(0xBF) ));
            $header = ['起案番号','所属部門名称','所属部門コード','社員番号','申請者','申請名称','申請日','件名','目的地','理由','優先度', '決裁経路変更', '状況',
                        '【金額】', '【仮払金額】', '【精算金額】', '使用日', '交通機関', '出発', '到着', '金額', '領収書'];

            fputcsv($handle, $header);            


            //======================== Begin Get Form From Other API ===============================

            $query = \DB::select('SM.id')
                            ->from(['t_request', 'SM'])
                            ->where('SM.m_request_menu_id', '=', 1)
                            ->and_where('SM.item_status', '=', 'active')
                            ->and_where('SM.date', 'LIKE', $start_month . '%')
                            ->order_by('SM.date', 'ASC');
            $arrForms = $query->execute()->as_array();
            if(!empty($arrForms)){
                $query = \DB::select('SM.id', 'SM.item')
                            ->from(['m_expense_item', 'SM'])
                            ->where('SM.type_code', '=', '01')
                            ->and_where('SM.item_status', '=', 'active');
                $expenseItemOption = $query->execute()->as_array('id', 'item');

                foreach ($arrForms as $val) {
                    $form_id = $val['id'];
                    $url = 'trequest/detail/' . $form_id;
                    $api_res = json_decode($rest->request($url, 'get'));
                    if($api_res->status == 'success'){
                        $item = $api_res->data;
                        // echo '<pre>';
                        // print_r($item);
                        // echo '</pre>';
                        // die;
                        if(!empty($item)){
                            
                            $code = $item->code;
                            $user_create_department_name = isset($item->user_create_form->department_name)?$item->user_create_form->department_name:null;
                            $user_create_department_code = isset($item->user_create_form->department_code)?$item->user_create_form->department_code:null;
                            $user_create_staff_no = isset($item->user_create_form->staff_no)?$item->user_create_form->staff_no:null;
                            $user_create_fullname = isset($item->user_create_form->fullname)?$item->user_create_form->fullname:null;
                            $request_menu_name = $item->request_menu_name;
                            $date = $item->date;
                            $name = $item->name;

                            $destination = $item->destination;
                            $destination = str_replace(["\r", "\n"], " ", $destination); 

                            $reason = $item->reason;
                            $reason = str_replace(["\r", "\n"], " ", $reason); 

                            $priority_flg = ($item->priority_flg == 0)?'通常':'優先';
                            $change_route = ($item->change_route == 0)?'無':'有';
                            $m_petition_status_id = $item->m_petition_status_id;
                            $m_petition_status_name = $item->m_petition_status_name;
                            $amount = $item->amount;
                            $suspense_payments = $item->suspense_payments;
                            $settlement_amount = $item->settlement_amount;



                            $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                        $user_create_fullname, $request_menu_name, $date, $name, $destination, $reason,
                                        $priority_flg, $change_route, $m_petition_status_name, $amount, $suspense_payments, $settlement_amount];
                            // fputcsv($handle, $basicData);

                            $t_request_transport_spec = $item->t_request_transport_spec;
                            //Get Detail information
                            if(!empty($t_request_transport_spec)){
                                $i = 0;
                                foreach ($t_request_transport_spec as $item_transport) {
                                    $detail_use_date = $item_transport->use_date;
                                    $detail_m_expense_item_id = $item_transport->m_expense_item_id;
                                    $detail_m_expense_item_id = @$expenseItemOption[$detail_m_expense_item_id];


                                    $departure_point = $item_transport->departure_point;
                                    $arrival_point = $item_transport->arrival_point;
                                    $transportation_spec_fee = $item_transport->transportation_spec_fee;
                                    $receipt_flg = ($item_transport->receipt_flg == 1)?'要':'不要';


                                    $basicData = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
                                    $detailData = [$detail_use_date, $detail_m_expense_item_id, $departure_point, $arrival_point,
                                                    $transportation_spec_fee, $receipt_flg];

                                    fputcsv($handle, array_merge($basicData, $detailData));
                                    $i++;
                                }
                            }else{
                                fputcsv($handle, $basicData);
                            }
                        }
                    }
                }
            }

            $start_month = date('Y-m', strtotime('+1 month', strtotime($start_month)));
            $get_start_month++;
        }
        fclose($handle);
        exit;
    }

    /*=============================================================
     * Author: Nguyen Anh Khoa
     * Action export data form 0.4 - "出張旅費精算(国内)"
     * Input: start_date
     *=============================================================*/
    public static function data_form_travel_csv($start_month){
    	$rest = new \Vision_Rest();

        $param = ['start_month' => $start_month];
        $start_date = isset($param['start_date'])?date('Y-m-d', strtotime($param['start_date'])):date('Y-m-d');
        $end_date = isset($param['end_date'])?date('Y-m-d', strtotime($param['end_date'])):date('Y-m-d');

        $start_month = isset($param['start_month'])?date('Y-m', strtotime($param['start_month'])):date('Y-m');
        $get_start_month = date('n', strtotime($start_month));
        $end_month = isset($param['end_month'])?date('Y-m', strtotime($param['end_month'])):date('Y-m');
        $get_end_month = date('n', strtotime($end_month));



        setlocale(LC_ALL, "en_US.UTF-8");


        while($start_month <= $end_month){
            $filePath = FILESPATH . '/form_data/travel/' . $start_month . '.csv';
            $handle = fopen($filePath, 'w+');
            fputs($handle, $bom =( chr(0xEF) . chr(0xBB) . chr(0xBF) ));
            $header = ['起案番号','所属部門名称','所属部門コード','社員番号','申請者','申請名称','申請日','件名','目的地','理由','優先度', '決裁経路変更', '状況',
                        '【精算日】', '【出張種別】', '【出張先】', '【宿泊先】', '【連絡先】', '【出発日】', '【交通機関】', '【時刻】', '【便名】',
                        '【到着日】', '【交通機関】', '【時刻】', '【便名】', '【備考】', '【報告事項】', 
                        '(日当)単価', '(日当)日数', '(日当)金額', 
                        '(宿泊)単価', '(宿泊)日数', '(宿泊)金額', 
                        'その他01', 'その他02', 'その他03',
                        '使用日', '交通機関', '出発', '到着', '金額', '領収書',
                        '【金額】', '【仮払金額】', '【精算金額】'];

            fputcsv($handle, $header);            


            //======================== Begin Get Form From Other API ===============================

            $query = \DB::select('SM.id')
                            ->from(['t_request', 'SM'])
                            ->where('SM.m_request_menu_id', '=', 4)
                            ->and_where('SM.item_status', '=', 'active')
                            ->and_where('SM.date', 'LIKE', $start_month . '%')
                            ->order_by('SM.date', 'ASC');
            $arrForms = $query->execute()->as_array();
            if(!empty($arrForms)){
                $query = \DB::select('SM.id', 'SM.item')
                            ->from(['m_expense_item', 'SM'])
                            ->where('SM.type_code', '=', '01')
                            ->and_where('SM.item_status', '=', 'active');
                $expenseItemOption = $query->execute()->as_array('id', 'item');

                $query = \DB::select('SM.id', 'SM.item')
                            ->from(['m_expense_item', 'SM'])
                            ->where('SM.id', 'IN', ['14', '15', '16'])
                            ->and_where('SM.item_status', '=', 'active');
                $withdrawalContentsOption = $query->execute()->as_array('id', 'item');
                

                foreach ($arrForms as $val) {
                    $form_id = $val['id'];
                    $url = 'trequest/detail/' . $form_id;
                    // $url = 'trequest/detail/9044';
                    $api_res = json_decode($rest->request($url, 'get'));
                    if($api_res->status == 'success'){
                        $item = $api_res->data;
                       
                        if(!empty($item)){
                            
                            $code = $item->code;
                            $user_create_department_name = isset($item->user_create_form->department_name)?$item->user_create_form->department_name:null;
                            $user_create_department_code = isset($item->user_create_form->department_code)?$item->user_create_form->department_code:null;
                            $user_create_staff_no = isset($item->user_create_form->staff_no)?$item->user_create_form->staff_no:null;
                            $user_create_fullname = isset($item->user_create_form->fullname)?$item->user_create_form->fullname:null;
                            $request_menu_name = $item->request_menu_name;
                            $date = $item->date;
                            $name = $item->name;

                            $destination = $item->destination;
                            $destination = str_replace(["\r", "\n"], " ", $destination); 

                            $reason = $item->reason;
                            $reason = str_replace(["\r", "\n"], " ", $reason); 

                            $priority_flg = ($item->priority_flg == 0)?'通常':'優先';
                            $change_route = ($item->change_route == 0)?'無':'有';
                            $m_petition_status_id = $item->m_petition_status_id;
                            $m_petition_status_name = $item->m_petition_status_name;

                            $amount = $item->amount;
                            $suspense_payments = $item->suspense_payments;
                            $settlement_amount = $item->settlement_amount;



                            $objTravel = $settlement_date = $business_trip_class = $business_trip_destination = null;
                            $accommodation = $contact_address = $departure_date = $departure_transportation_id = null;
                            $departure_time = $departure_flight = $end_date = $end_transportation_id = null;
                            $end_time = $end_flight = $memo = $report_memo = $perdiem_fee = $lodging_fee = null;
                            $other01 = $other02 = $other03 = null;

                            if(!empty($item->t_request_traveling_expenses)){
                                $objTravel = $item->t_request_traveling_expenses;
                                $settlement_date = isset($objTravel->settlement_date)?$objTravel->settlement_date:null;
                                $business_trip_class = ($objTravel->business_trip_class == 1)?'国内':'海外';
                                $business_trip_destination = isset($objTravel->business_trip_destination)?$objTravel->business_trip_destination:null;
                                $accommodation = isset($objTravel->accommodation)?$objTravel->accommodation:null;
                                $contact_address = isset($objTravel->contact_address)?$objTravel->contact_address:null;
                                $departure_date = isset($objTravel->departure_date)?$objTravel->departure_date:null;

                                $departure_transportation_id = isset($objTravel->departure_transportation_id)?$objTravel->departure_transportation_id:null;
                                $departure_transportation_id = @$expenseItemOption[$departure_transportation_id];


                                $departure_time = isset($objTravel->departure_time)?$objTravel->departure_time:null;
                                $departure_flight = isset($objTravel->departure_flight)?$objTravel->departure_flight:null;
                                $end_date = isset($objTravel->end_date)?$objTravel->end_date:null;

                                $end_transportation_id = isset($objTravel->end_transportation_id)?$objTravel->end_transportation_id:null;
                                $end_transportation_id = @$expenseItemOption[$end_transportation_id];

                                $end_time = isset($objTravel->end_time)?$objTravel->end_time:null;
                                $end_flight = isset($objTravel->end_flight)?$objTravel->end_flight:null;

                                $memo = isset($objTravel->memo)?$objTravel->memo:null;
                                $memo = str_replace(["\r", "\n"], " ", $memo); 

                                $report_memo = isset($objTravel->report_memo)?$objTravel->report_memo:null;
                                $report_memo = str_replace(["\r", "\n"], " ", $report_memo); 

                                $perdiem_daily = isset($objTravel->perdiem_daily)?$objTravel->perdiem_daily:null;
                                $perdiem_days = isset($objTravel->perdiem_days)?$objTravel->perdiem_days:null;
                                $perdiem_fee = isset($objTravel->perdiem_fee)?$objTravel->perdiem_fee:null;

                                $lodging_daily = isset($objTravel->lodging_daily)?$objTravel->lodging_daily:null;
                                $lodging_days = isset($objTravel->lodging_days)?$objTravel->lodging_days:null;
                                $lodging_fee = isset($objTravel->lodging_fee)?$objTravel->lodging_fee:null;

                                if(isset($objTravel->other[0])){
                                    $other_m_expense_item_id = isset($objTravel->other[0]->m_expense_item_id)?$objTravel->other[0]->m_expense_item_id:null;
                                    $other_m_expense_item_id = @$withdrawalContentsOption[$other_m_expense_item_id];
                                    $other_description = isset($objTravel->other[0]->description)?$objTravel->other[0]->description:null;
                                    $other_payments = isset($objTravel->other[0]->payments)?$objTravel->other[0]->payments:null;
                                    $other01 = $other_m_expense_item_id . ' ' . $other_description . ' ' . $other_payments;
                                }
                                if(isset($objTravel->other[1])){
                                    $other_m_expense_item_id = isset($objTravel->other[1]->m_expense_item_id)?$objTravel->other[1]->m_expense_item_id:null;
                                    $other_m_expense_item_id = @$withdrawalContentsOption[$other_m_expense_item_id];
                                    $other_description = isset($objTravel->other[1]->description)?$objTravel->other[1]->description:null;
                                    $other_payments = isset($objTravel->other[1]->payments)?$objTravel->other[1]->payments:null;
                                    $other02 = $other_m_expense_item_id . ' ' . $other_description . ' ' . $other_payments;
                                }
                                if(isset($objTravel->other[2])){
                                    $other_m_expense_item_id = isset($objTravel->other[2]->m_expense_item_id)?$objTravel->other[2]->m_expense_item_id:null;
                                    $other_m_expense_item_id = @$withdrawalContentsOption[$other_m_expense_item_id];
                                    $other_description = isset($objTravel->other[2]->description)?$objTravel->other[2]->description:null;
                                    $other_payments = isset($objTravel->other[2]->payments)?$objTravel->other[2]->payments:null;
                                    $other03 = $other_m_expense_item_id . ' ' . $other_description . ' ' . $other_payments;
                                }
                            }


                            $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                            $user_create_fullname, $request_menu_name, $date, $name, $destination, $reason,
                                            $priority_flg, $change_route, $m_petition_status_name,
                                            $settlement_date, $business_trip_class, $business_trip_destination,
                                            $accommodation, $contact_address, $departure_date, $departure_transportation_id,
                                            $departure_time, $departure_flight, $end_date, $end_transportation_id,
                                            $end_time, $end_flight, $memo, $report_memo, 
                                            $perdiem_daily, $perdiem_days, $perdiem_fee, 
                                            $lodging_daily, $lodging_days, $lodging_fee,
                                            $other01, $other02, $other03
                                        ];
                                        
                            // fputcsv($handle, array_merge($basicData, ['', '', '', '', '', '', $amount, $suspense_payments, $settlement_amount]));            

                            $t_request_transport_spec = $item->t_request_transport_spec;
                            //Get Detail information
                            if(!empty($t_request_transport_spec)){
                                $temp = [];
                                foreach ($basicData as $key => $value) {
                                    $temp[] = '';
                                }       
                                $basicData = $temp;
                                $i = 0;
                                foreach ($t_request_transport_spec as $item_transport) {
                                    $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                            $user_create_fullname, $request_menu_name, $date, $name, $destination, $reason,
                                            $priority_flg, $change_route, $m_petition_status_name,
                                            $settlement_date, $business_trip_class, $business_trip_destination,
                                            $accommodation, $contact_address, $departure_date, $departure_transportation_id,
                                            $departure_time, $departure_flight, $end_date, $end_transportation_id,
                                            $end_time, $end_flight, $memo, $report_memo, 
                                            $perdiem_daily, $perdiem_days, $perdiem_fee, 
                                            $lodging_daily, $lodging_days, $lodging_fee,
                                            $other01, $other02, $other03
                                        ];

                                    if($i != 0){
                                        $temp = [];
                                        foreach ($basicData as $key => $value) {
                                            $temp[] = '';
                                        }       
                                        $basicData = $temp;
                                    }


                                    $detail_use_date = $item_transport->use_date;
                                    $detail_m_expense_item_id = $item_transport->m_expense_item_id;
                                    $detail_m_expense_item_id = @$expenseItemOption[$detail_m_expense_item_id];


                                    $departure_point = $item_transport->departure_point;
                                    $arrival_point = $item_transport->arrival_point;
                                    $transportation_spec_fee = $item_transport->transportation_spec_fee;
                                    $receipt_flg = ($item_transport->receipt_flg == 1)?'要':'不要';

                                    $detailData = [$detail_use_date, $detail_m_expense_item_id, $departure_point, $arrival_point,
                                                    $transportation_spec_fee, $receipt_flg];


                                    fputcsv($handle, array_merge($basicData, $detailData, [$amount, $suspense_payments, $settlement_amount]));

                                    $i++;
                                }
                            }else{
                                $basicData = [$code, $user_create_department_name, $user_create_department_code, $user_create_staff_no,
                                            $user_create_fullname, $request_menu_name, $date, $name, $destination, $reason,
                                            $priority_flg, $change_route, $m_petition_status_name,
                                            $settlement_date, $business_trip_class, $business_trip_destination,
                                            $accommodation, $contact_address, $departure_date, $departure_transportation_id,
                                            $departure_time, $departure_flight, $end_date, $end_transportation_id,
                                            $end_time, $end_flight, $memo, $report_memo, 
                                            $perdiem_daily, $perdiem_days, $perdiem_fee, 
                                            $lodging_daily, $lodging_days, $lodging_fee,
                                            $other01, $other02, $other03
                                        ];
                                        
                                fputcsv($handle, array_merge($basicData, ['', '', '', '', '', '', $amount, $suspense_payments, $settlement_amount]));            
                            }
                        }
                    }
                }
            }

            $start_month = date('Y-m', strtotime('+1 month', strtotime($start_month)));
            $get_start_month++;
        }
        fclose($handle);
        exit;
    }
}