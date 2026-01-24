<?php
// auth.php
session_start();

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

// Access code sent from login form
$accessCode = isset($_POST['access_code']) ? trim($_POST['access_code']) : '';

if ($accessCode === '') {
    header('Location: index.php?error=1');
    exit;
}

/*
 * We don't store the raw password anywhere.
 * We compute a SHA-256 hash of the provided value
 * and compare to an expected SHA-256 of "DEHY".
 */

$expectedHash = hash('sha256', 'DEHY');
$inputHash    = hash('sha256', $accessCode);

// Use hash_equals to avoid timing attacks (good habit)
if (hash_equals($expectedHash, $inputHash)) {
    $_SESSION['fitup_logged_in'] = true;
    header('Location: index.php');
    exit;
}

// Failed login
$_SESSION['fitup_logged_in'] = false;
header('Location: index.php?error=1');
exit;
