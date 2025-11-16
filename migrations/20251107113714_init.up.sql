CREATE SCHEMA lima;
CREATE TABLE lima.account_consents (
    client_id VARCHAR(255) NOT NULL,
    permissions TEXT [],
    reason TEXT,
    requesting_bank VARCHAR(255),
    requesting_bank_name VARCHAR(255),
    status VARCHAR(255),
    consent_id VARCHAR(255) NOT NULL,
    auto_approved BOOLEAN,
    consent_provider VARCHAR(255)
);

CREATE TABLE lima.accounts (
    account_id VARCHAR(255) UNIQUE NOT NULL,
    currency VARCHAR(255),
    account_type VARCHAR(255),
    nickname VARCHAR(255),
    servicer VARCHAR(255)
)