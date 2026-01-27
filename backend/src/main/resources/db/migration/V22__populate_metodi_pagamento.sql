-- =============================================
-- V22: Popola metodi di pagamento standard
-- =============================================

INSERT INTO metodo_pagamento (nome, attivo) VALUES
('Contanti', TRUE),
('Carta di Credito', TRUE),
('Carta di Debito', TRUE),
('Bonifico Bancario', TRUE),
('Satispay', TRUE),
('PayPal', TRUE);
