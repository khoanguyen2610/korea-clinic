<?php
class Vision_Db {
    public static function datatable_query($query, $columns, $arrParam = null, $options = null){

        //======================= SEARCH =================
        $sWhere = "";
        if (@$arrParam['sSearch'] != "" ){
            $keyword = "%" . $arrParam['sSearch'] . "%";
            foreach($columns as  $value){
                $sWhere .= $value . " LIKE '" . $keyword . "' OR ";
            }
            $sWhere = substr_replace( $sWhere, "", -4 );
        }
        /* Individual column filtering */
        for($i=0; $i<count($columns); $i++ ){
            if ( @$arrParam['bSearchable_'.$i] == "true" && $arrParam['sSearch_'.$i] != '' ){
                if ($sWhere == "" ){
                    $sWhere = "WHERE ";
                }else{
                    $sWhere .= " AND ";
                }
                $sWhere .= $columns[$i]." LIKE '%".mysql_real_escape_string($arrParam['sSearch_'.$i])."%' ";
            }
        }
        if($sWhere != ""){
            $query->and_where_open();
            $query->and_where(DB::expr($sWhere));
            $query->and_where_close();
        }
        
        
        //======================= Paging =================
        if ( isset($arrParam['start']) && $arrParam['length'] != -1 ) {
            $query->limit(intval($arrParam['length']))->offset(intval($arrParam['start']));
        }

        //======================= Ordering =================
        $order = '';
        if ( isset($arrParam['order']) && count($arrParam['order']) ) {
            $orderBy = array();
            $dtColumns = self::pluck( $columns, 'dt' );
            for ( $i=0, $ien=count($arrParam['order']) ; $i<$ien ; $i++ ) {
                // Convert the column index into the column data property
                $columnIdx = intval($arrParam['order'][$i]['column']);
                $requestColumn = $arrParam['columns'][$columnIdx];
                $columnIdx = array_search( $requestColumn['data'], $dtColumns );
                $column = $columns[$arrParam['order'][$i]['column']];

                if ( $requestColumn['orderable'] == 'true' ) {
                    $dir = $arrParam['order'][$i]['dir'] === 'asc' ?
                        'ASC' :
                        'DESC';
                    $orderBy[] = $column['db'].' '.$dir;
                }
            }
            $order = implode(', ', $orderBy);
            $query->order_by(DB::expr($order));
        }




        // $sOrder = '';
        // if (isset($arrParam['iSortCol_0'])){
        //     for ( $i=0 ; $i<intval( $arrParam['iSortingCols'] ) ; $i++ ){
        //         if ( $arrParam[ 'bSortable_'.intval($arrParam['iSortCol_'.$i]) ] == "true"){
        //             $sOrder .= $aColumns[intval( $arrParam['iSortCol_'.$i] ) ]."
        //                 ". $arrParam['sSortDir_'.$i]  .", ";
        //         }
        //     }
        //     $sOrder = substr_replace( $sOrder, "", -2 );
        //     $query->order_by(DB::expr($sOrder));
        // }




        $query = preg_replace('# null#', '', $query);
        
        $result['data'] = DB::query($query)->execute()->as_array();
        $result['total'] = DB::query("SELECT FOUND_ROWS()")->execute()->current();
        $result['total'] = $result['total']['FOUND_ROWS()'];
        return $result;
    }

    static function pluck ( $a, $prop ){
        $out = array();
        for ( $i=0, $len=count($a) ; $i<$len ; $i++ ) {
            $out[] = $a[$i][$prop];
        }
        return $out;
    }
}
