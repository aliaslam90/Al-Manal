<?php
// Copy OUTSIDE public_html as ../al-manal-config.php. Never commit real credentials.
return [
    'site_url' => 'https://your-domain.ae',
    'dsn' => 'mysql:host=localhost;dbname=YOUR_DATABASE;charset=utf8mb4',
    'db_user' => 'YOUR_DATABASE_USER',
    'db_password' => 'YOUR_DATABASE_PASSWORD',
    'admin_user' => 'reception',
    // Generate with: php -r 'echo password_hash(readline("Password: "), PASSWORD_DEFAULT), PHP_EOL;'
    'admin_password_hash' => '',
    'rate_limit_secret' => '', // Generate with: php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
];
