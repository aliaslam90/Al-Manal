<?php
declare(strict_types=1);
require dirname(__DIR__) . '/backend/bootstrap.php';
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: POST'); json_response(405, ['message'=>'Use POST to submit a booking request.']); }
    if (!same_origin()) json_response(403, ['message'=>'Please submit from the clinic website.']);
    if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') json_response(415, ['message'=>'JSON is required.']);
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) json_response(413, ['message'=>'Request is too large.']);
    $raw = file_get_contents('php://input', false, null, 0, 16385);
    if (strlen($raw) > 16384) json_response(413, ['message'=>'Request is too large.']);
    try { $input = json_decode($raw, true, 16, JSON_THROW_ON_ERROR); }
    catch (JsonException $e) { json_response(400, ['message'=>'Invalid request.']); }
    if (!is_array($input) || array_is_list($input)) json_response(400, ['message'=>'Invalid request.']);
    if (!rate_limit('booking', 10, 600)) { header('Retry-After: 600'); json_response(429, ['message'=>'Too many attempts. Please try again in 10 minutes or call the clinic.']); }
    [$values, $errors] = validate_booking($input);
    if ($values['website'] !== '') json_response(422, ['message'=>'Unable to accept this request.']);
    if ($errors) json_response(422, ['message'=>'Please check the highlighted fields.', 'errors'=>$errors]);
    $db = db();
    $hash = booking_hash($values);
    $find = $db->prepare('SELECT reference, payload_hash FROM bookings WHERE request_id = ?');
    $find->execute([$values['request_id']]);
    $existing = $find->fetch();
    if ($existing) {
        if (!hash_equals($existing['payload_hash'], $hash)) json_response(409, ['message'=>'This request has already been submitted. Reload to make a new request.']);
        json_response(200, ['reference'=>$existing['reference'], 'message'=>'Your request is saved. The clinic will contact you to confirm availability.']);
    }
    $reference = 'AM-' . gmdate('Ymd') . '-' . strtoupper(bin2hex(random_bytes(6)));
    $now = gmdate('Y-m-d\TH:i:s\Z');
    try {
        $db->prepare('INSERT INTO bookings (reference, request_id, payload_hash, name, phone, email, service, doctor, preferred_date, preferred_time, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([$reference, $values['request_id'], $hash, $values['name'], $values['phone'], $values['email'], $values['service'], $values['doctor'], $values['date'], $values['time'], $values['notes'], $now, $now]);
    } catch (PDOException $e) {
        // A retry can arrive while the first response is still in flight.
        $find->execute([$values['request_id']]);
        $existing = $find->fetch();
        if (!$existing) throw $e;
        if (!hash_equals($existing['payload_hash'], $hash)) json_response(409, ['message'=>'This request has already been submitted.']);
        $reference = $existing['reference'];
    }
    json_response(201, ['reference'=>$reference, 'message'=>'Your request is saved. The clinic will contact you to confirm availability.']);
} catch (Throwable $e) {
    error_log('Booking endpoint failed: ' . get_class($e));
    json_response(503, ['message'=>'Booking is temporarily unavailable. Please try again or call +971 2 556 9213.']);
}
