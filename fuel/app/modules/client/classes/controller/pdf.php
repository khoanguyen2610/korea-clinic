<?php
/**
 * @Author: p_hoang
 * @Date:   2016-12-29 09:42:20
 * @Last Modified by:   k_nguyen
 * @Last Modified time: 2017-02-21 10:36:38
 */

namespace Client;
use \Controller\Exception;

class Controller_Pdf extends \Controller_Common {
	public function before() {
		parent::before();
		\Package::loaded('mpdf60') || \Package::load('mpdf60');
	}

	/*=============================================================
     * Author: Hoang Phong Phu
     * Action export pdf single | multiple form payment content (user)
     *=============================================================*/
	public function action_print_format_user(){
		$param = \Input::param();
		$contents = [];
		
		if(isset($param['p'])){
			parse_str(base64_decode($param['p']), $params);
			$petition_id = isset($params['petition_id'])?$params['petition_id']:null;
			$cids = explode(',', $petition_id);
			//get forms required
			$select = ['SM.id', 'SM.copy_petition_id', 'SM.m_request_menu_id', 'SM.m_user_id', 'SM.m_currency_id', 'SM.m_petition_status_id', 'SM.code', 'SM.date', 'SM.type', 'SM.name', 'SM.reason', 'SM.amount', 'SM.suspense_payments', 'SM.settlement_amount',
	            \DB::expr('MRM.name AS request_menu_name'), \DB::expr('MRM.code AS request_menu_code'),
	            'TRP.m_expense_item_id', 'MU.fullname',
	            \DB::expr('MCU.symbol AS currency_symbol')
	        ];
	        $query = \DB::select_array($select)
	                     ->from(['t_request', 'SM'])
	                     ->join(['m_request_menu', 'MRM'], 'left')->on('SM.m_request_menu_id', '=', 'MRM.id')
	                     ->join(['t_request_purchase', 'TRP'], 'left')->on('TRP.t_request_id', '=', 'SM.id')
	                     ->join(['m_user', 'MU'], 'left')->on('MU.id', '=', 'SM.m_user_id')
	                     ->join(['m_currency', 'MCU'], 'left')->on('MCU.id', '=', 'MU.m_currency_id');

	        empty($cids) || $query->where('SM.id','IN',$cids);
	        
	        $items = $query->execute()->as_array();

			foreach($items as $item){
				//get info of user created form 
				$user_info = \Model_MUserDepartment::getCurrentDepartment($item['m_user_id']);
				$user_info['fullname'] = $item['fullname'];
				$this->_arrParam['user_info'] = $user_info;

				//get data from relative table
	            switch ($item['request_menu_code']) {
	            	//form transportation
	            	case '200101':
		            		$this->_arrParam['title'] = '交通費';
		            		//Get data from table t_request_transport_spec 
				            $query = \DB::select('TRTS.id', 'TRTS.use_date', 'TRTS.departure_point', 'TRTS.arrival_point', 'TRTS.transportation_spec_fee', 'TRTS.receipt_flg', 'MEI.item')
				                         ->from(['t_request_transport_spec', 'TRTS'])
				                         ->join(['m_expense_item','MEI'],'left')->on('MEI.id','=','TRTS.m_expense_item_id')
				                         ->where('TRTS.t_request_id', '=', $item['id'])
				                         ->and_where('TRTS.item_status', '=', 'active')
				                         ->order_by('TRTS.use_date', 'ASC');
				            $result = $query->execute()->as_array();
				            $this->_arrParam['t_request_transport_spec'] = $result;
		            		$view = \View::forge('pdf_user_template/_transportation');
	            		break;

	            	//form pre-traveling
	            	case '200201':
	            	case '200301':
		            		$this->_arrParam['title'] = '出張旅費';
		            		//Get data from table t_request_traveling_expenses 
				            $query = \DB::select('SM.*', 'MTA.name', \DB::expr('MEI1.item AS departure_item'), \DB::expr('MEI2.item AS end_item'))
				                         ->from(['t_request_traveling_expenses', 'SM'])
				                         ->join(['m_trip_area','MTA'],'left')->on('MTA.id','=','SM.m_trip_area_id')
				                         ->join(['m_expense_item','MEI1'],'left')->on('MEI1.id','=','SM.departure_transportation_id')
				                         ->join(['m_expense_item','MEI2'],'left')->on('MEI2.id','=','SM.end_transportation_id')
				                         ->where('SM.t_request_id', '=', $item['id'])
				                         ->and_where('SM.item_status', '=', 'active');
				            $result = $query->execute()->current();
				            $this->_arrParam['t_request_traveling_expenses'] = $result;
				            $view = \View::forge('pdf_user_template/_pretravel');
	            		break;

	            	//form traveling
	            	case '200401':
	            	case '200501':
		            		$this->_arrParam['title'] = '出張旅費';
		            		//Get data from table t_request_transport_spec 
				            $query = \DB::select('TRTS.id', 'TRTS.use_date', 'TRTS.departure_point', 'TRTS.arrival_point', 'TRTS.transportation_spec_fee', 'TRTS.receipt_flg', 'MEI.item')
				                         ->from(['t_request_transport_spec', 'TRTS'])
				                         ->join(['m_expense_item','MEI'],'left')->on('MEI.id','=','TRTS.m_expense_item_id')
				                         ->where('TRTS.t_request_id', '=', $item['id'])
				                         ->and_where('TRTS.item_status', '=', 'active')
				                         ->order_by('TRTS.use_date', 'ASC');
				            $result = $query->execute()->as_array();
				            $this->_arrParam['t_request_transport_spec'] = $result;
				            //Get data from table t_request_traveling_expenses 
				            $query = \DB::select('SM.*', 'MTA.name', \DB::expr('MEI1.item AS departure_item'), \DB::expr('MEI2.item AS end_item'))
				                         ->from(['t_request_traveling_expenses', 'SM'])
				                         ->join(['m_trip_area','MTA'],'left')->on('MTA.id','=','SM.m_trip_area_id')
				                         ->join(['m_expense_item','MEI1'],'left')->on('MEI1.id','=','SM.departure_transportation_id')
				                         ->join(['m_expense_item','MEI2'],'left')->on('MEI2.id','=','SM.end_transportation_id')
				                         ->where('SM.t_request_id', '=', $item['id'])
				                         ->and_where('SM.item_status', '=', 'active');
				            $result = $query->execute()->current();
				            //Get data from table t_request_traveling_expenses_other 
				            if(!empty($result)){
				                $query = \DB::select(\DB::expr('SUM(payments) AS amount'))
				                             ->from(['t_request_traveling_expenses_other', 'SM'])
				                             ->where('SM.t_request_traveling_expenses_id', '=', $result['id']);
				                $other = $query->execute()->current();
				                $result['other'] = $other['amount'];
				            }
		           			$this->_arrParam['t_request_traveling_expenses'] = $result;
		           			$view = \View::forge('pdf_user_template/_travel');
			    		break;

					//form purchase
	            	case '200601':
	            			$this->_arrParam['title'] = '購入';
	            			//Get data from table t_purchase_reception_spec 
				            $query = \DB::select()
				                         ->from(['t_purchase_reception_spec', 'SM'])
				                         ->where('SM.t_request_id', '=', $item['id'])
				                         ->and_where('SM.item_status', '=', 'active')
				                         ->order_by('SM.id', 'ASC');
				            $result = $query->execute()->as_array();
				            $this->_arrParam['t_purchase_reception_spec'] = $result;
				            $view = \View::forge('pdf_user_template/_purchase');
	            		break;

	            	//form dietary
	            	case '200801':
	            	case '200901':
	            			$this->_arrParam['title'] = '飲食';
	            			//Get data from table t_purchase_reception_spec 
				            $query = \DB::select()
				                         ->from(['t_purchase_reception_spec', 'SM'])
				                         ->where('SM.t_request_id', '=', $item['id'])
				                         ->and_where('SM.item_status', '=', 'active')
				                         ->order_by('SM.id', 'ASC');
				            $result = $query->execute()->as_array();
				            $this->_arrParam['t_purchase_reception_spec'] = $result;
				            //Get data from table t_request_dietary 
				            $query = \DB::select()
				                         ->from(['t_request_dietary', 'SM'])
				                         ->where('SM.t_request_id', '=', $item['id'])
				                         ->and_where('SM.item_status', '=', 'active');
				            $result = $query->execute()->current();
							$this->_arrParam['t_request_dietary'] = $result;
				            $view = \View::forge('pdf_user_template/_dietary');
	            		break;
	            }
	            $this->_arrParam['item'] = $item;
				$contents[] = $view->set($this->_arrParam);
			}
			//render forms content to html
			$html = \View::forge('pdf', ['contents' => $contents])->render();

			$mpdf = new \mPDF();
			$mpdf->SetProtection(array('print'));
			$mpdf->SetTitle('Invoice Payment');
			$mpdf->SetAuthor("VisionVietnam Co.");
			$mpdf->showWatermarkText = true;
			$mpdf->watermark_font = 'DejaVuSansCondensed';
			$mpdf->watermarkTextAlpha = 0.1;
			$mpdf->autoScriptToLang = true;
			$mpdf->baseScript = 1;
			$mpdf->addFont('ipaexg');
			//$mpdf->autoLangToFont = true;
			$mpdf->allow_charset_conversion = true;  // Set by default to TRUE
			$mpdf->SetDisplayMode('fullpage');
			$mpdf->WriteHTML($html);

			$mpdf->Output();
			exit;
		}
		exit('Invalid Url');
	}

	/*=============================================================
     * Author: Hoang Phong Phu
     * Action export pdf single | multiple form payment content (keiri)
     *=============================================================*/
	public function action_print_format_keiri(){
		$contents = [];
		$param = \Input::param();
		
		if(isset($param['p'])){
			parse_str(base64_decode($param['p']), $params);
			$petition_id = isset($params['petition_id'])?$params['petition_id']:null;
			$cids = explode(',', $petition_id);
			
			$recursive = new \Vision_Recursive();

			if(!empty($cids) && !empty($petition_id)){
				foreach($cids as $cid){	
					//======================== Begin Get Form From Other API ===============================
	        		$api_res = json_decode($this->rest->request('trequest/detail/' . $cid, 'get'));
					if($api_res->status == 'success'){
						$this->_arrParam['payment'] = $payment = $api_res->data;
						if(empty($payment)) continue;
						//Get comment
			            $comments = [];
			            if($payment->comments){
			            	$index = 0;
							$recursive->generateComment($payment->comments, 0, $comments, $index);
			            }
	        			$this->_arrParam['comment'] = \View::forge('pdf_keiri_template/_comment')->set('comments',$comments);
	        			$this->_arrParam['status'] = \View::forge('pdf_keiri_template/_status')->set('m_petition_status_id',$payment->m_petition_status_id);
	        			$this->_arrParam['route'] = \View::forge('pdf_keiri_template/_route')->set('users',$payment->routes);
	        			switch($payment->request_menu_code){
	        				//form transportation
	        				case '200101':
	        						//get data from table m_expense_item
	        						$query = \DB::select('id','item')
				                         ->from(['m_expense_item', 'SM'])
				                         ->where('SM.type_code', '=', '01')
				                         ->and_where('SM.item_status', '=', 'active');
				                    $this->_arrParam['mei'] = $query->execute()->as_array('id','item');
									$view = \View::forge('pdf_keiri_template/_transportation');
	        					break;
	        				case '200201':
	        				case '200301':
	        						//get data from table m_expense_item
	        						$query = \DB::select('id','item')
				                         ->from(['m_expense_item', 'SM'])
				                         ->where('SM.type_code', '=', '01')
				                         ->and_where('SM.item_status', '=', 'active');
				                    $this->_arrParam['mei'] = $query->execute()->as_array('id','item');
				                    //get data from table m_trip_area
	        						$query = \DB::select('id','name')
	        							->from('m_trip_area')
	        							->where('item_status','=','active');
									$this->_arrParam['mta'] = $query->execute()->as_array('id','name');
									$view = \View::forge('pdf_keiri_template/_pretravel');
	        					break;
	        				case '200401':
	        				case '200501':
	        						//get data transport from table m_expense_item
	        						$query = \DB::select('id','item')
				                         ->from(['m_expense_item', 'SM'])
				                         ->where('SM.type_code', '=', '01')
				                         ->and_where('SM.item_status', '=', 'active');
				                    $this->_arrParam['mei'] = $query->execute()->as_array('id','item');
				                    //get data from table m_trip_area
	        						$query = \DB::select('id','name')
	        							->from('m_trip_area')
	        							->where('item_status','=','active');
									$this->_arrParam['mta'] = $query->execute()->as_array('id','name');
									//get data withdrawal from table m_expense_item
	        						$query = \DB::select('id','item')
				                         ->from(['m_expense_item', 'SM'])
				                         ->where('SM.id', 'IN', [14,15,16]);
				                    $this->_arrParam['withdrawal'] = $query->execute()->as_array('id','item');
									$view = \View::forge('pdf_keiri_template/_travel');
	        					break;
	        				case '200601':
	        						//get data from table t_request_purchase
	        						$query = \DB::select('SM.id','SM.date','MEI.item')
	        							->from(['t_request_purchase','SM'])
	        							->join(['m_expense_item','MEI'],'left')->on('MEI.id','=','SM.m_expense_item_id')
	        							->where('SM.t_request_id','=',$cid);
	        						$result = $query->execute()->current();
	        						$this->_arrParam['t_request_purchase'] = $result;
									$view = \View::forge('pdf_keiri_template/_purchase');
	        					break;
	        				case '200801':
	        				case '200901':
	        						//get data from table m_expense_item
	        						$query = \DB::select('id','item')
				                         ->from(['m_expense_item', 'SM'])
				                         ->where('SM.type_code', 'IN', ['05','06'])
				                         ->and_where('SM.item_status', '=', 'active');
				                    $this->_arrParam['mei'] = $query->execute()->as_array('id','item');
	        						$view = \View::forge('pdf_keiri_template/_dietary');
	        					break;
	        			}
	        			$contents[] = $view->set($this->_arrParam);
	        		}
				}
				//render forms content to html
				$html = \View::forge('pdf', ['contents' => $contents])->render();
				$mpdf = new \mPDF(); 
				//$mpdf = new \mPDF('-aCJK','A4','','',32,25,27,25,16,13); 
				$mpdf->SetProtection(['print']);
				$mpdf->SetTitle('Invoice Payment');
				$mpdf->SetAuthor("VisionVietnam Co.");
				$mpdf->showWatermarkText = true;
				$mpdf->watermark_font = 'DejaVuSansCondensed';
				$mpdf->watermarkTextAlpha = 0.1;
				$mpdf->autoScriptToLang = true;
				$mpdf->baseScript = 1;
				$mpdf->SetDisplayMode('fullpage');
				$mpdf->WriteHTML($html);
				
				$mpdf->Output();
				exit;
			}
		}
		exit('Invalid Url');
        
	}
}