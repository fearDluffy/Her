<?php
header('Content-Type: application/json; charset=utf-8');
// Allow same-origin AJAX; adjust as needed for cross-origin use
// header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'POST only']);
    exit;
}

$to = isset($_POST['to']) ? trim($_POST['to']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$from = isset($_POST['from']) ? trim($_POST['from']) : '';

if (!$to || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'Invalid recipient email']);
    exit;
}

if (!$subject) $subject = 'You got a proposal!';
if (!$message) $message = 'Someone sent you a message.';

$headers = [];
$serverName = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=utf-8';
$headers[] = 'From: no-reply@' . $serverName;
if ($from && filter_var($from, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $from;
}

$ok = false;
try {
    // use mail() - note: the server must be configured to send mail
    $ok = @mail($to, $subject, $message, implode("\r\n", $headers));
} catch (Exception $e) {
    $ok = false;
}

if ($ok) {
    echo json_encode(['ok' => true]);
} else {
    echo json_encode(['ok' => false, 'error' => 'Mail sending failed (server may need SMTP configured)']);
}
