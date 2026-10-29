CREATE TABLE IF NOT EXISTS bookings (
    reference VARCHAR(40) PRIMARY KEY,
    request_id VARCHAR(36) NOT NULL UNIQUE,
    payload_hash VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(254) NOT NULL,
    service VARCHAR(80) NOT NULL,
    doctor VARCHAR(120) NOT NULL,
    preferred_date VARCHAR(10) NOT NULL,
    preferred_time VARCHAR(5) NOT NULL,
    notes TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at VARCHAR(25) NOT NULL,
    updated_at VARCHAR(25) NOT NULL
);
CREATE TABLE IF NOT EXISTS booking_rate_limits (
    client_key VARCHAR(64) NOT NULL,
    bucket BIGINT NOT NULL,
    hits INTEGER NOT NULL,
    PRIMARY KEY (client_key, bucket)
);
