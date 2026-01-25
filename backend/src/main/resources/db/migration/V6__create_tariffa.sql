-- =============================================
-- V6: Creazione tabella TARIFFA
-- Relazione Molti-a-Molti tra Tipologia e Periodo
-- =============================================

CREATE TABLE tariffa (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         tipologia_id BIGINT NOT NULL,
                         periodo_id BIGINT NOT NULL,
                         prezzo DECIMAL(10,2) NOT NULL,
                         attivo BOOLEAN NOT NULL DEFAULT TRUE,
                         data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Controllo che il prezzo non sia negativo
                         CONSTRAINT chk_tariffa_prezzo CHECK (prezzo >= 0),

    -- Chiavi Esterne
                         CONSTRAINT fk_tariffa_tipologia
                             FOREIGN KEY (tipologia_id) REFERENCES tipologia_camera(id),
                         CONSTRAINT fk_tariffa_periodo
                             FOREIGN KEY (periodo_id) REFERENCES periodo_tariffario(id),

    -- VINCOLO DI UNICITÀ (Richiesto)
    -- Impedisce duplicati per la coppia Tipologia + Periodo
                         CONSTRAINT uq_tariffa_tipologia_periodo UNIQUE (tipologia_id, periodo_id)
);