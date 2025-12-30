<?php
// Router script for PHP's built-in development server
// Usage: php -S localhost:8000 router.php

// Ensure we're in the correct directory
$routerDir = __DIR__;
chdir($routerDir);

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestFile = $routerDir . $requestUri;

// Serve static files directly (images, CSS, JS, etc.) if they exist
if ($requestUri !== '/' && $requestUri !== '/signin' && $requestUri !== '/api/signin') {
    if (file_exists($requestFile) && !is_dir($requestFile)) {
        return false; // Let PHP serve the file directly
    }
}

// Route all other requests through index.php
$_SERVER['SCRIPT_NAME'] = '/index.php';
require $routerDir . '/index.php';

