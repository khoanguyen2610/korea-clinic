<?php
/*====================================================================
 * System environment. Can be set to any of the following:
 * Enviroment to conect database, display error.
 * DEVELOPMENT
 * TEST
 * STAGING
 * PRODUCTION
 *====================================================================*/
define('ENVIROMENT', 'DEVELOPMENT');

/*====================================================================
 * Host Server
 *====================================================================*/
define('HOST', 'localhost');

/*====================================================================
 * Host Server
 *====================================================================*/
define('PORT', '80');

/*====================================================================
 * Name of source code directory
 * "" when project in root directory
 *====================================================================*/
define('DIRECTORY_NAME','korea-clinic');

/*====================================================================
 * Define Client URL
 *====================================================================*/
define('CLIENT_URL', 'http://localhost');
/*====================================================================
 * Define API URL
 *====================================================================*/
define('API_URL', 'http://localhost/korea-clinic/public/api/');

/*====================================================================
 * Define Theme Path
 *====================================================================*/
define('THEMEPATH', __DIR__.DIRECTORY_SEPARATOR . 'themes/');


define('DISPLAY_DATE_FORMAT', 'Y/m/d');
define('DISPLAY_DATE_MONTH_FORMAT', 'm/d');

/*====================================================================
 * Define Check Permission OF System
 * True = check role | False = Do Not Check Anything
 *====================================================================*/
define('CHECK_PERMISSION', TRUE);

/*====================================================================
 * Default empty image URL
 *====================================================================*/
define('IMG_PLACEHOLDER_URL', 'images/placeholder.jpg');

/*====================================================================
 * Directory language flag image URL
 *====================================================================*/
define('IMG_FLAG_URL', 'images/flags/');

/*====================================================================
 * Prefix for all tables of database
 * Ex: vision_[Table_name]
 *====================================================================*/
define('TABLE_PREFIX', '');
