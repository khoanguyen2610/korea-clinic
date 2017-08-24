<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
$lang_code = \Cookie::get('lang_code');
$lang_code = (isset($lang_code) && !empty($lang_code))?$lang_code:\Config::get('language');
$translate = \Model_VsvnTranslate::find('all', ['where' => ['language_code' => $lang_code, 'status' => 'active']]);
$arrLang = \Vision_Common::as_array($translate, 'key', 'value');

$strLang = json_encode($arrLang);

$content = 'var language_translate = ' . $strLang;
File::update(DOCROOT . 'js/', 'language.js', $content);

return $arrLang;*/