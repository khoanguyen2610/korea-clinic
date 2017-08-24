<?php
return array(
    // '_root_' => 'system/default/login', // The default route
    // '_404_' => 'system/default/response/404', 
    '_root_' => 'checkin/default/login', // The default route
    '_404_' => 'checkin/default/page_no_found',
    'api/v1/(:any)' => 'api_v1/$1', 
    'api/v2/(:any)' => 'api_v2/$1', 
);

