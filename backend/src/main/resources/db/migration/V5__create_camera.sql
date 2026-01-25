-- =============================================
-- V5: Creazione tabella CAMERA
-- Sistema Gestionale Motel
-- =============================================

CREATE TABLE camera (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        numero VARCHAR(10) NOT NULL UNIQUE,
                        stato_pulizia VARCHAR(20) NOT NULL DEFAULT 'PULITA',
                        tipologia_id BIGINT NOT NULL,
                        attivo BOOLEAN NOT NULL DEFAULT TRUE,
                        data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Chiave esterna verso TIPOLOGIA_CAMERA
                        CONSTRAINT fk_camera_tipologia
                            FOREIGN KEY (tipologia_id)
                                REFERENCES tipologia_camera(id)
);

