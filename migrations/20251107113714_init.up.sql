CREATE SCHEMA lima;
CREATE TABLE lima.account_consents (
    client_id VARCHAR(255) NOT NULL,
    permissions TEXT [],
    reason TEXT,
    requesting_bank VARCHAR(255),
    requesting_bank_name VARCHAR(255),
    status VARCHAR(255),
    consent_id TEXT NOT NULL,
    auto_approved BOOLEAN
);