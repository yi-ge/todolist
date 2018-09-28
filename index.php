<?php
$f3 = require 'lib/base.php';
$f3->set('DEBUG', 1);
if ((float) PCRE_VERSION < 7.9) {
    trigger_error('PCRE version is out of date');
}

// Load configuration
$f3->config('config.ini');

$f3->set('db', new \DB\SQL('mysql:host=' . $f3->get('DBHOST') . ';port=' . $f3->get('DBPORT') . ';dbname=' . $f3->get('DBNAME'), $f3->get('DBUSER'), $f3->get('DBPASS')));

$f3->route('GET /',
    function () {
        echo View::instance()->render('home.html');
    }
);

$f3->route('POST /start', 'Board->new_board');

$f3->run();
