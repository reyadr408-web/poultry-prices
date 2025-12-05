<?php
/**
 * Save Dashboard Data API
 * يحفظ البيانات من لوحة التحكم إلى ملف JSON
 */

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validate data
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$requiredFields = ['poultry', 'chicksCompanies', 'feedCompanies', 'eggs', 'materials'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing field: $field"]);
        exit;
    }
}

// Update last update timestamp
$data['lastUpdate'] = date('c'); // ISO 8601 format

// Convert to pretty JSON
$jsonOutput = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// Save to file
$filePath = __DIR__ . '/full-data.json';
$backupPath = __DIR__ . '/backups/full-data-' . date('Y-m-d-H-i-s') . '.json';

// Create backup directory if not exists
if (!file_exists(__DIR__ . '/backups')) {
    mkdir(__DIR__ . '/backups', 0755, true);
}

// Create backup of old data
if (file_exists($filePath)) {
    copy($filePath, $backupPath);
}

// Save new data
$result = file_put_contents($filePath, $jsonOutput);

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save data']);
    exit;
}

// Success response
http_response_code(200);
echo json_encode([
    'success' => true, 
    'message' => 'Data saved successfully',
    'timestamp' => $data['lastUpdate'],
    'backup' => basename($backupPath)
]);
?>
