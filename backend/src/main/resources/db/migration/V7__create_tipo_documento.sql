-- =============================================
-- V7: Creazione e popolamento TIPO_DOCUMENTO
-- =============================================

CREATE TABLE tipo_documento (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                sigla VARCHAR(5) NOT NULL UNIQUE,
                                descrizione VARCHAR(100) NOT NULL,
                                attivo BOOLEAN NOT NULL DEFAULT TRUE,
                                data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Popolamento dati iniziali (Lookup)
INSERT INTO tipo_documento (sigla, descrizione) VALUES
                                                    ('CI', 'Carta d''Identità'),
                                                    ('PA', 'Passaporto'),
                                                    ('PT', 'Patente di Guida'),
                                                    ('AM', 'Altro Modello');