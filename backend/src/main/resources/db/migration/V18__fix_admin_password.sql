-- V18__fix_admin_password.sql
-- Aggiorna la password dell'utente admin con l'hash corretto per "admin123"

UPDATE utente
SET password = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
WHERE username = 'admin';
