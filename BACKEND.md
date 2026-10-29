# Booking backend (Hostinger shared hosting)

PHP 8.1+ and PDO MySQL are required. No Node.js server or Composer dependencies are needed. Bookings are requests until reception confirms availability; this does not reserve live calendar slots. Email/SMS notifications are not configured. Reception reviews requests at `/admin/`.

## Hostinger setup

1. In hPanel, create a MySQL database and database user for this website. In phpMyAdmin select that database and import `backend/schema.sql` (or run `php backend/install.php` over SSH).
2. Upload the site, including `api/`, `admin/` and `backend/`, to `public_html`. Do not upload `.git`, `tests`, local databases, or configuration credentials.
3. Copy `backend/config.example.php` to `al-manal-config.php` in the directory immediately ABOVE `public_html`. Enter the exact HTTPS website URL, database DSN/user/password, reception username, password hash, and a random rate-limit secret. The configuration is loaded from outside the web root. Alternatively set `AL_MANAL_CONFIG` to its absolute path.
4. Generate a password hash locally or over SSH: `php -r 'echo password_hash(readline("Password: "), PASSWORD_DEFAULT), PHP_EOL;'`. Generate the rate-limit secret: `php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'`. Do not use an online password hashing website. Restrict the configuration file's permissions to the hosting account (for example 600).
5. Enable HTTPS. Open `/admin/` and sign in using the configured username and original password. Submit a test booking from both website forms, verify it appears, then mark it cancelled.
6. Back up the MySQL database using hosting backups. Set a clinic retention policy and remove expired records using phpMyAdmin; patient notes and contact details are private. The endpoint does not log patient payloads.

The site URL must match the browser origin exactly, including `www` and a development port. Configure redirects to this canonical URL. No cross-origin API access is enabled. On standard Hostinger Apache/LiteSpeed hosting the included `.htaccess` files deny web access to `backend/` and `tests/`. If using another server, block these directories there as well.

## Local preview and tests

Install PHP with PDO SQLite. Create a configuration file outside this repository using the example, with `site_url` set to `http://localhost:8000`, a `sqlite:/absolute/path/in/work/bookings.sqlite` DSN, a random secret and a generated admin password hash. SQLite is for local verification; production uses the configured MySQL database.

```
AL_MANAL_CONFIG=/absolute/path/to/local-config.php php backend/install.php
AL_MANAL_CONFIG=/absolute/path/to/local-config.php php -S localhost:8000
```

Run `php tests/validation.php`. API integration tests need a disposable database: `BOOKING_TEST_URL=http://localhost:8000 python3 tests/integration.py`. Do not run integration tests against a live patient database.

## API

`POST /api/bookings.php`, JSON body: `name`, `phone`, `email`, `service`, `doctor`, `date` (YYYY-MM-DD), optional `time` (HH:MM), `notes`, UUID-v4 `request_id`, and optional empty `website` honeypot. All values must be strings. Requests require a matching Origin header. Responses: 201 saved, 200 idempotent replay, 400 malformed, 403 wrong origin, 409 changed payload with reused request ID, 413 oversized, 415 unsupported media, 422 invalid fields, 429 rate limited, 503 unavailable. Success includes a reference and confirmation-pending message.

Preferred date/time is interpreted in Asia/Dubai, within the next year and clinic hours (10:00–22:00). The current website makes all seven doctors selectable for every service; availability and specialty routing require clinic-provided rules. The endpoint enforces the existing service/doctor choices.

Staff access uses HTTPS Basic authentication, hashed password verification, rate limiting, escaped HTML and session CSRF protection for status updates. Credentials are not included in source control. The first deployment requires configuration and database setup; it fails closed until those are ready.
