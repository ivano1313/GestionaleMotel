-- V12__create_ospite.sql
-- Anagrafica ospiti con dati per schedina alloggiati

CREATE TABLE ospite (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Dati anagrafici
                        cognome VARCHAR(100) NOT NULL,
                        nome VARCHAR(100) NOT NULL,
                        sesso VARCHAR(1) NOT NULL,
                        data_nascita DATE NOT NULL,

    -- Luogo nascita (XOR: italiano o estero)
                        comune_nascita_id BIGINT NULL,
                        stato_nascita_id BIGINT NULL,

    -- Cittadinanza
                        cittadinanza_id BIGINT NOT NULL,

    -- Documento
                        tipo_documento_id BIGINT NOT NULL,
                        numero_documento VARCHAR(20) NOT NULL,

    -- Luogo rilascio documento (XOR: italiano o estero)
                        comune_rilascio_id BIGINT NULL,
                        stato_rilascio_id BIGINT NULL,

    -- Contatti (opzionali)
                        telefono VARCHAR(20) NULL,
                        email VARCHAR(100) NULL,

    -- Audit
                        attivo BOOLEAN NOT NULL DEFAULT TRUE,
                        data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- CHECK: sesso ammette solo M o F
                        CONSTRAINT chk_ospite_sesso CHECK (sesso IN ('M', 'F')),

    -- CHECK XOR: luogo nascita (esattamente uno valorizzato)
                        CONSTRAINT chk_ospite_luogo_nascita CHECK (
                            (comune_nascita_id IS NOT NULL AND stato_nascita_id IS NULL)
                                OR
                            (comune_nascita_id IS NULL AND stato_nascita_id IS NOT NULL)
                            ),

    -- CHECK XOR: luogo rilascio (esattamente uno valorizzato)
                        CONSTRAINT chk_ospite_luogo_rilascio CHECK (
                            (comune_rilascio_id IS NOT NULL AND stato_rilascio_id IS NULL)
                                OR
                            (comune_rilascio_id IS NULL AND stato_rilascio_id IS NOT NULL)
                            ),

    -- Foreign keys
                        CONSTRAINT fk_ospite_comune_nascita
                            FOREIGN KEY (comune_nascita_id) REFERENCES comune(id),
                        CONSTRAINT fk_ospite_stato_nascita
                            FOREIGN KEY (stato_nascita_id) REFERENCES stato(id),
                        CONSTRAINT fk_ospite_cittadinanza
                            FOREIGN KEY (cittadinanza_id) REFERENCES stato(id),
                        CONSTRAINT fk_ospite_tipo_documento
                            FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id),
                        CONSTRAINT fk_ospite_comune_rilascio
                            FOREIGN KEY (comune_rilascio_id) REFERENCES comune(id),
                        CONSTRAINT fk_ospite_stato_rilascio
                            FOREIGN KEY (stato_rilascio_id) REFERENCES stato(id)
);

-- Indici per ricerche frequenti
CREATE INDEX idx_ospite_cognome_nome ON ospite(cognome, nome);
CREATE INDEX idx_ospite_numero_documento ON ospite(numero_documento);