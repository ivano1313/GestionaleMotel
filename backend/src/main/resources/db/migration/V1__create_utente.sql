-- =============================================
-- V1: Creazione tabella UTENTE
-- Sistema Gestionale Motel
-- =============================================

CREATE TABLE utente (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(50) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        nome VARCHAR(100) NOT NULL,
                        email VARCHAR(100),
                        ruolo VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
                        attivo BOOLEAN NOT NULL DEFAULT TRUE,
                        data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        ultimo_accesso DATETIME
);