-- =============================================
-- V3: Creazione tabella PERIODO_TARIFFARIO
-- Sistema Gestionale Motel
-- =============================================

CREATE TABLE periodo_tariffario (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    nome VARCHAR(50) NOT NULL UNIQUE,
                                    data_inizio DATE NOT NULL,
                                    data_fine DATE NOT NULL,
                                    attivo BOOLEAN NOT NULL DEFAULT TRUE,
                                    data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    CHECK (data_fine >= data_inizio)
);