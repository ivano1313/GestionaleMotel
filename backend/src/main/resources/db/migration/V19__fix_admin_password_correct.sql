-- V19__fix_admin_password_correct.sql
-- Aggiorna la password dell'utente admin con un hash BCrypt VERIFICATO per "admin123"
-- Hash generato e testato con BCryptPasswordEncoder strength 10
-- Questo hash è stato verificato con successo nel test PasswordHashTest

UPDATE utente
SET password = '$2a$10$C9e52w81k.RYWEMgn/XFxeoltT0Yq2SBhiFs9cFTJCKAnne3RB67y'
WHERE username = 'admin';
