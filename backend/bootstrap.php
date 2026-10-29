<?php
declare(strict_types=1);

function config(): array {
    static $config;
    if ($config === null) {
        $path = getenv('AL_MANAL_CONFIG') ?: dirname(__DIR__, 2) . '/al-manal-config.php';
        if (!is_file($path)) throw new RuntimeException('Booking configuration is missing.');
        $config = require $path;
        foreach (['site_url', 'dsn', 'rate_limit_secret'] as $key) {
            if (empty($config[$key])) throw new RuntimeException('Booking configuration is incomplete.');
        }
    }
    return $config;
}
function db(): PDO {
    static $db;
    if (!$db) {
        $c = config();
        $db = new PDO($c['dsn'], $c['db_user'] ?? null, $c['db_password'] ?? null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql') $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
    return $db;
}
function json_response(int $status, array $body): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit;
}
function same_origin(): bool {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $url = parse_url(config()['site_url']);
    $expected = ($url['scheme'] ?? 'https') . '://' . $url['host'] . (isset($url['port']) ? ':' . $url['port'] : '');
    return hash_equals($expected, rtrim($origin, '/'));
}
// A fixed window stored in the database works across PHP workers. No raw IP is retained.
function rate_limit(string $scope, int $limit, int $seconds): bool {
    $key = hash_hmac('sha256', $scope . ':' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), config()['rate_limit_secret']);
    $bucket = (int) floor(time() / $seconds) * $seconds;
    $db = db();
    $driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);
    $sql = $driver === 'mysql'
        ? 'INSERT INTO booking_rate_limits (client_key, bucket, hits) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE hits = hits + 1'
        : 'INSERT INTO booking_rate_limits (client_key, bucket, hits) VALUES (?, ?, 1) ON CONFLICT(client_key, bucket) DO UPDATE SET hits = hits + 1';
    $db->prepare($sql)->execute([$key, $bucket]);
    $q = $db->prepare('SELECT hits FROM booking_rate_limits WHERE client_key = ? AND bucket = ?');
    $q->execute([$key, $bucket]);
    $allowed = (int) $q->fetchColumn() <= $limit;
    $db->prepare('DELETE FROM booking_rate_limits WHERE bucket < ?')->execute([time() - 86400]);
    return $allowed;
}
function services(): array { return ['Smile Design', 'Veneers', 'Root Canal Treatment', 'Dental Crowns', 'Dental Implants', 'Orthodontics', 'Packages & Offers']; }
function doctors(): array { return ['Dr. Talaat Al Qadi', 'Dr. Gaith Helal', 'Dr. Mai Abdelraouf', 'Dr. Manal Dandan', 'Dr. Amr Hassoun', 'Dr. Ihssan Tayseer', 'Dr. Claude Istanbouli']; }
function validate_booking(array $input): array {
    $values = [];
    $errors = [];
    foreach (['name'=>120, 'phone'=>30, 'email'=>254, 'service'=>80, 'doctor'=>120, 'date'=>10, 'time'=>5, 'notes'=>2000, 'request_id'=>36, 'website'=>200] as $field=>$max) {
        $value = $input[$field] ?? '';
        if (!is_string($value) || strlen($value) > $max || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $value)) {
            $errors[$field] = 'Please enter a valid value.';
            $value = '';
        }
        $values[$field] = trim($value);
    }
    if ($values['name'] === '') $errors['name'] = 'Enter your full name.';
    if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email address.';
    if (!preg_match('/^[+0-9() .-]+$/', $values['phone']) || strlen(preg_replace('/\D/', '', $values['phone'])) < 7 || strlen(preg_replace('/\D/', '', $values['phone'])) > 15) $errors['phone'] = 'Enter a valid phone number.';
    if (!in_array($values['service'], services(), true)) $errors['service'] = 'Select a service.';
    if (!in_array($values['doctor'], doctors(), true)) $errors['doctor'] = 'Select a doctor.';
    $tz = new DateTimeZone('Asia/Dubai');
    $today = new DateTimeImmutable('today', $tz);
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $values['date'], $tz);
    if (!$date || $date->format('Y-m-d') !== $values['date'] || $date < $today || $date > $today->modify('+1 year')) $errors['date'] = 'Select a date within the next year.';
    if ($values['time'] !== '') {
        if (!preg_match('/^(?:1[0-9]|2[01]):[0-5][0-9]$|^22:00$/', $values['time'])) $errors['time'] = 'Select a time between 10:00 AM and 10:00 PM.';
        elseif ($date && new DateTimeImmutable($values['date'].' '.$values['time'], $tz) <= new DateTimeImmutable('now', $tz)) $errors['time'] = 'Select a future time.';
    }
    if ($values['notes'] === '') $errors['notes'] = 'Enter a short note about your request.';
    if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i', $values['request_id'])) $errors['request_id'] = 'Please reload the page and try again.';
    return [$values, $errors];
}
function booking_hash(array $values): string {
    unset($values['request_id'], $values['website']);
    return hash('sha256', json_encode($values, JSON_THROW_ON_ERROR));
}
