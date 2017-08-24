<?php
class Vision_Recursive {
	
    //Get all data comment
	public function buildComment(array $elements, $parentId = 0) {
		$comments = array();
        foreach ($elements as $element) {
            if ($element['parent'] == $parentId) {
                $children = $this->buildComment($elements, $element['id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $comments[] = $element;
            }
        }
        return $comments;
	}

    //get array comments to print pdf
    public function generateComment(array $elements, $parentId = 0, &$comments, &$index){
        foreach ($elements as $element) {
            if($element->parent == $parentId){
                $element->blank_level = str_repeat('--',$element->level);
                $comments[$index] = $element;
                $index++;
                if(property_exists($element,'children')){
                    $this->generateComment($element->children,$element->id,$comments,$index);
                }
            }
        }
    }

    //Get all copy form petition
    public function getCopyPetition($petition_id, $petition_type, &$copyPetitions){
        if(!empty($petition_id)){
            switch ($petition_type) {
                case '1': //form 0.2 - t_proposal
                    $Item = \Model_TProposal::find($petition_id);
                    break;
                case '2': //form 0.4 - t_request
                    $Item = \Model_TRequest::find($petition_id);
                    break;
            }
            if(!empty($Item)){
                $copyPetitions[] = $Item;
                if(!empty($Item->copy_petition_id)){
                    $this->getCopyPetition($Item->copy_petition_id, $petition_type, $copyPetitions);
                }
            }
        }
    }
}