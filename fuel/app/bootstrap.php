<?php
// Bootstrap the framework DO NOT edit this
require COREPATH.'bootstrap.php';

\Autoloader::add_classes(array(
	// Add classes you want to override here
	// Example: 'View' => APPPATH.'classes/view.php',
	'MyRules' => APPPATH.'classes/myrule.php',
));

// Register the autoloader
\Autoloader::register();

/**
 * Your environment.  Can be set to any of the following:
 *
 * Fuel::DEVELOPMENT
 * Fuel::TEST
 * Fuel::STAGING
 * Fuel::PRODUCTION
 */
switch (ENVIROMENT) {
	case 'DEVELOPMENT':
		$enviroment = \Fuel::DEVELOPMENT;
		break;
	case 'TEST':
		$enviroment = \Fuel::TEST;
		break;
	case 'STAGING':
		$enviroment = \Fuel::STAGING;
		break;
	case 'PRODUCTION':
		$enviroment = \Fuel::PRODUCTION;
		break;
	default:
		$enviroment = \Fuel::DEVELOPMENT;
		break;
}
\Fuel::$env = (isset($_SERVER['FUEL_ENV']) ? $_SERVER['FUEL_ENV'] : $enviroment);

// Initialize the framework with the config file.
\Fuel::init('config.php');
