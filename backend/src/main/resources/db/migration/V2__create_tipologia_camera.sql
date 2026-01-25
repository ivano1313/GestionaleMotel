-- =============================================
-- V2: Creazione tabella TIPOLOGIA_CAMERA
-- Sistema Gestionale Motel
-- =============================================

CREATE TABLE tipologia_camera (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  nome VARCHAR(50) NOT NULL UNIQUE,
                                  capienza_massima INT NOT NULL CHECK (capienza_massima >= 1),
                                  attivo BOOLEAN NOT NULL DEFAULT TRUE,
                                  data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);