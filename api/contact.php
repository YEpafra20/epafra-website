<?php
// InfinityFree entry point: validates the form and stores a message with PDO.
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(503);
    echo json_encode(['message' => 'Database configuration is missing.']);
    exit;
}

try {
    $config = require $configPath;
} catch (Throwable $exception) {
    error_log($exception->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Database configuration could not be loaded. Upload a valid api/config.php file.']);
    exit;
}

foreach (['host', 'database', 'username', 'password'] as $configKey) {
    if (!isset($config[$configKey]) || $config[$configKey] === '') {
        http_response_code(500);
        echo json_encode(['message' => 'Database configuration is incomplete.']);
        exit;
    }
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['message' => 'Please provide a name, valid email, and message.']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4",
        $config['username'],
        $config['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    $statement = $pdo->prepare('INSERT INTO contact_messages (name, email, message) VALUES (:name, :email, :message)');
    $statement->execute(['name' => $name, 'email' => $email, 'message' => $message]);
    echo json_encode(['message' => 'Thanks, your message is on its way.']);
} catch (PDOException $exception) {
    error_log($exception->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'The message could not be saved right now.']);
}
