<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/bootstrap.php';
db()->exec(file_get_contents(__DIR__ . '/schema.sql'));
echo "Booking tables are ready.\n";
