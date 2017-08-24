<?php
class MyRules {
    public static function _validation_unique($val, $options) {
        $arrOption = explode('.', $options);

        $table = $arrOption[0];
        $pk    = $arrOption[1];
        $field = $arrOption[2];
        $id    = isset($arrOption[3])?$arrOption[3]:'';
        $query = DB::select("$pk", DB::expr("LOWER (\"$field\")"))
                        ->where($field, '=', Str::lower($val))
                        ->from($table);
        $result = DBUtil::field_exists($table,array('item_status'))?$query->where('item_status','=','active')->execute()->current():$query->execute()->current();
        Validation::active()->set_message('unique', __('この種別は既に設定されています。',array(),'この種別は既に設定されています。'));
  
        if(isset($id) && !empty($id)){
            $id = str_replace('id_', '', $id);
            if(empty($result)){
                return true;
            }else{
                if($id == $result[$pk]){
                    return true;
                }
                return false;
            }
        }else{
            return empty($result)?true:false;
        }
    }
    
    public static function _validation_re_password($val, $password) {
        $password = Input::param($password);
        if(empty($password))
            return true;
        Validation::active()->set_message('re_password', __('Your re-password is not correct.', array(), 'Your re-password is not correct.'));
        if($val === $password){
            return true;
        }
        return false;
    }

    // note this is a non-static method
    public function _validation_is_upper($val) {
        return $val === strtoupper($val);
    }


    //user.seq_id.email.' . $arrParam['seq_id']);
 
    public static function _validation_current_password($val, $options) {
        $encode_password = \Auth::hash_password($val);
        $arrOption = explode('.', $options);
        $table = $arrOption[0];
        $pk    = $arrOption[1];
        $field = $arrOption[2];
        $id    = isset($arrOption[3])?$arrOption[3]:'';
        $result = DB::select("LOWER (\"$field\"), $pk")
                        ->where($pk, '=', $id)
                        ->and_where($field, '=', $encode_password)
                        ->from($table)->execute()->current();
        
        Validation::active()->set_message('current_password', __('Your current password is not correct.', array(), 'Your current password is not correct.'));
        return !empty($result)?true:false;
    }
}
