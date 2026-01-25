-- V14__create_ospite_prenotazione.sql
-- Tabella associativa N:N tra ospiti e prenotazioni

CREATE TABLE ospite_prenotazione (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Riferimenti
                                     ospite_id BIGINT NOT NULL,
                                     prenotazione_id BIGINT NOT NULL,

    -- Ruolo nella prenotazione
                                     titolare BOOLEAN NOT NULL DEFAULT FALSE,

    -- Audit
                                     data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Vincolo unicità: stesso ospite non può essere due volte nella stessa prenotazione
                                     CONSTRAINT uk_ospite_prenotazione UNIQUE (ospite_id, prenotazione_id),

    -- Foreign keys
                                     CONSTRAINT fk_ospite_prenotazione_ospite
                                         FOREIGN KEY (ospite_id) REFERENCES ospite(id),
                                     CONSTRAINT fk_ospite_prenotazione_prenotazione
                                         FOREIGN KEY (prenotazione_id) REFERENCES prenotazione(id)
);

-- Indici per ricerche frequenti
CREATE INDEX idx_ospite_prenotazione_ospite ON ospite_prenotazione(ospite_id);
CREATE INDEX idx_ospite_prenotazione_prenotazione ON ospite_prenotazione(prenotazione_id);