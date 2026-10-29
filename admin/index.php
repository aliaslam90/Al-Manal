<?php
declare(strict_types=1);
require dirname(__DIR__) . '/backend/bootstrap.php';
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header("Content-Security-Policy: default-src 'none'; style-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
function esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
try {
    $c = config();
    $local = in_array(parse_url($c['site_url'], PHP_URL_HOST), ['localhost','127.0.0.1'], true);
    if (!$local && (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off')) { http_response_code(403); exit('Use HTTPS for staff access.'); }
    if (empty($c['admin_user']) || empty($c['admin_password_hash'])) { http_response_code(503); exit('Staff access has not been configured.'); }
    $authenticated = hash_equals($c['admin_user'], $_SERVER['PHP_AUTH_USER'] ?? '') && password_verify($_SERVER['PHP_AUTH_PW'] ?? '', $c['admin_password_hash']);
    if (!$authenticated) {
        if (!rate_limit('staff-login', 10, 900)) { http_response_code(429); exit('Too many sign-in attempts. Please try again in 15 minutes.'); }
        header('WWW-Authenticate: Basic realm="Al Manal Reception", charset="UTF-8"'); http_response_code(401); exit('Staff sign-in required.');
    }
    ini_set('session.use_strict_mode', '1');
    session_set_cookie_params(['httponly'=>true, 'secure'=>!$local, 'samesite'=>'Strict', 'path'=>'/admin']);
    session_start();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!is_string($_POST['csrf'] ?? null) || !hash_equals($_SESSION['csrf'], $_POST['csrf'])) { http_response_code(403); exit('Reload the page and try again.'); }
        $status = $_POST['status'] ?? '';
        if (!in_array($status, ['pending','contacted','confirmed','cancelled'], true)) { http_response_code(422); exit('Invalid status.'); }
        db()->prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE reference = ?')->execute([$status, gmdate('Y-m-d\TH:i:s\Z'), (string)($_POST['reference'] ?? '')]);
        header('Location: ./', true, 303); exit;
    }
    $page = max(1, min(100000, (int)($_GET['page'] ?? 1)));
    $offset = ($page - 1) * 25;
    $rows = db()->query('SELECT reference, name, phone, email, service, doctor, preferred_date, preferred_time, notes, status, created_at FROM bookings ORDER BY created_at DESC, reference DESC LIMIT 26 OFFSET ' . $offset)->fetchAll();
    $more = count($rows) > 25; $rows = array_slice($rows, 0, 25);
} catch (Throwable $e) { error_log('Booking staff page failed: '.get_class($e)); http_response_code(503); exit('Booking management is temporarily unavailable.'); }
?>
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Booking requests | Al Manal</title><link rel="stylesheet" href="admin.css"></head><body><main>
<header><div><p>AL MANAL · RECEPTION</p><h1>Booking requests</h1></div><a href="./">Refresh</a></header>
<p>Preferred dates and times are in UAE time. Contact the patient before confirming an appointment.</p>
<?php if (!$rows): ?><p class="empty">No booking requests yet.</p><?php endif; ?>
<?php foreach ($rows as $row): ?>
<article><div class="heading"><h2><?= esc($row['name']) ?></h2><strong><?= esc($row['reference']) ?></strong></div>
<dl><div><dt>Contact</dt><dd><?= esc($row['phone']) ?><br><?= esc($row['email']) ?></dd></div><div><dt>Service / doctor</dt><dd><?= esc($row['service']) ?><br><?= esc($row['doctor']) ?></dd></div><div><dt>Preferred visit (UAE)</dt><dd><?= esc($row['preferred_date']) ?> <?= esc($row['preferred_time'] ?: 'Time flexible') ?></dd></div><div><dt>Received (UTC)</dt><dd><?= esc($row['created_at']) ?></dd></div></dl>
<p class="notes"><?= nl2br(esc($row['notes'])) ?></p>
<form method="post"><input type="hidden" name="csrf" value="<?= esc($_SESSION['csrf']) ?>"><input type="hidden" name="reference" value="<?= esc($row['reference']) ?>"><label>Status <select name="status"><?php foreach (['pending','contacted','confirmed','cancelled'] as $status): ?><option <?= $row['status'] === $status ? 'selected' : '' ?> value="<?= $status ?>"><?= ucfirst($status) ?></option><?php endforeach; ?></select></label><button>Save status</button></form></article>
<?php endforeach; ?>
<nav><?php if ($page > 1): ?><a href="?page=<?= $page-1 ?>">Previous</a><?php endif; ?> <span>Page <?= $page ?></span> <?php if ($more): ?><a href="?page=<?= $page+1 ?>">Next</a><?php endif; ?></nav></main></body></html>
