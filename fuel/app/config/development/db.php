<?php
/**
 * The development database settings. These get merged with the global settings.
 */
return array(
    'default' => array(
        'connection'  => array(
            'dsn'        => 'mysql:host=localhost;dbname=workflow_rebuild',
            'username'   => 'root',
            'password'   => '',
        ),
    ),
    'old_system' => array(
        'connection'  => array(
            'dsn'        => 'mysql:host=localhost;dbname=workflow',
            'username'   => 'root',
            'password'   => '',
        ),
        'type'        => 'pdo',
		'identifier'   => '`',
		'table_prefix' => '',
		'charset'      => 'utf8',
		'collation'    => false,
		'enable_cache' => true,
		'profiling'    => false,
		'readonly'     => false,
    ),
);
