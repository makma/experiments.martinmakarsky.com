<?php
// Simple router - handles all requests
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Serve root or signin page
if (($requestUri === '/' || $requestUri === '/signin') && $method === 'GET') {
    include __DIR__ . '/signin.php';
    exit;
}

// Handle signin API
if ($requestUri === '/api/signin' && $method === 'POST') {
    header('Content-Type: application/json');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $turnstileToken = $data['cf-turnstile-response'] ?? null;
    
    error_log('signin attempt (origin): ' . json_encode([
        'email' => $email,
        'password' => $password ? '***' : null,
        'turnstileToken' => $turnstileToken ? '***' : null,
    ]));
    
    // If the edge didn't require Turnstile, there will be no token.
    if (!$turnstileToken) {
        http_response_code(200);
        header('Cache-Control: no-store');
        echo json_encode(['message' => 'Login successful']);
        exit;
    }
    
    // Edge decided to require Turnstile, so we "verify" the token here.
    // For this demo, verification always passes.
    // In real setup, call Cloudflare's Turnstile verify endpoint:
    // $response = file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, stream_context_create([
    //     'http' => [
    //         'method' => 'POST',
    //         'header' => 'Content-Type: application/x-www-form-urlencoded',
    //         'content' => http_build_query([
    //             'secret' => 'YOUR_SECRET_KEY',
    //             'response' => $turnstileToken,
    //         ]),
    //     ],
    // ]));
    // $result = json_decode($response, true);
    // $ok = $result['success'] ?? false;
    $ok = true;
    
    if ($ok) {
        http_response_code(200);
        header('Cache-Control: no-store');
        echo json_encode(['message' => 'Login successful']);
        exit;
    }
    
    // This branch is unreachable with the fake verifier, but kept for completeness.
    http_response_code(403);
    header('Cache-Control: no-store');
    echo json_encode(['message' => 'Turnstile verification failed']);
    exit;
}

// 404 for unknown routes
http_response_code(404);
echo 'Not Found';

