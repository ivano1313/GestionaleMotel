-- =============================================
-- V4: Creazione tabella METODO_PAGAMENTO
-- Sistema Gestionale Motel
-- =============================================

CREATE TABLE metodo_pagamento (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  nome VARCHAR(50) NOT NULL UNIQUE,
                                  attivo BOOLEAN NOT NULL DEFAULT TRUE, -- Soft Delete!
                                  data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
