CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_name VARCHAR(100) NOT NULL,
    account_number INTEGER NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
