<?php
// upload.php
session_start();

// Must be logged in
if (!isset($_SESSION['fitup_logged_in']) || $_SESSION['fitup_logged_in'] !== true) {
    header('Location: index.php');
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    header('Location: index.php');
    exit;
}

$file     = $_FILES['image'];
$tmpName  = $file['tmp_name'];
$fileName = $file['name'];
$fileSize = $file['size'];

// Category handling
$allowedCategories = ['services','logos','other'];
$category = isset($_POST['category']) ? strtolower(trim($_POST['category'])) : 'other';
if (!in_array($category, $allowedCategories, true)) {
    $category = 'other';
}

// Size limit: ~5MB
$maxSize = 5 * 1024 * 1024;
if ($fileSize > $maxSize) {
    header('Location: index.php');
    exit;
}

// Validate extension
$allowedExt = ['jpg','jpeg','png','gif','webp','svg'];
$ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt, true)) {
    header('Location: index.php');
    exit;
}

// Ensure uploads/category directory exists
$uploadBase = __DIR__ . '/uploads';
$targetDir  = $uploadBase . '/' . $category;

if (!is_dir($uploadBase)) {
    mkdir($uploadBase, 0755, true);
}
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

// Generate safe filename
$baseName    = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', basename($fileName));
$targetName  = date('Ymd_His') . '_' . $baseName;
$targetPath  = $targetDir . '/' . $targetName;

// Move file
if (!move_uploaded_file($tmpName, $targetPath)) {
    header('Location: index.php');
    exit;
}

// Back to dashboard
header('Location: index.php');
exit;
