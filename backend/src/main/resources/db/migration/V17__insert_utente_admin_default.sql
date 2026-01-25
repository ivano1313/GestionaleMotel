-- V17__insert_utente_admin_default.sql
-- Inserisce utente admin di default per il sistema

-- Inserimento utente amministratore
-- Username: admin
-- Password: admin123 (hash BCrypt)
-- Hash generato con BCryptPasswordEncoder strength 10
INSERT INTO utente (username, password, nome, email, ruolo, attivo, data_creazione)
VALUES (
    'admin',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8FvFhGWKkEDH2OJPvO',
    'Amministratore',
    'admin@gestionalemotel.com',
    'ADMIN',
    TRUE,
    CURRENT_TIMESTAMP
);
