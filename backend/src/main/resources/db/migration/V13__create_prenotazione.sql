-- V13__create_prenotazione.sql
-- Prenotazioni camere con prezzo congelato

CREATE TABLE prenotazione (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Camera prenotata
                              camera_id BIGINT NOT NULL,

    -- Periodo soggiorno
                              data_checkin DATE NOT NULL,
                              data_checkout DATE NOT NULL,

    -- Stato prenotazione
                              stato VARCHAR(20) NOT NULL,

    -- Prezzo totale congelato alla creazione
                              prezzo_totale DECIMAL(10,2) NOT NULL,

    -- Audit
                              attivo BOOLEAN NOT NULL DEFAULT TRUE,
                              data_creazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- CHECK: checkout dopo checkin
                              CONSTRAINT chk_prenotazione_date CHECK (data_checkout > data_checkin),

    -- CHECK: prezzo non negativo
                              CONSTRAINT chk_prenotazione_prezzo CHECK (prezzo_totale >= 0),

    -- CHECK: stati ammessi
                              CONSTRAINT chk_prenotazione_stato CHECK (
                                  stato IN ('CONFERMATA', 'IN_CORSO', 'COMPLETATA', 'CANCELLATA')
                                  ),

    -- Foreign key
                              CONSTRAINT fk_prenotazione_camera
                                  FOREIGN KEY (camera_id) REFERENCES camera(id)
);

-- Indici per ricerche frequenti
CREATE INDEX idx_prenotazione_camera ON prenotazione(camera_id);
CREATE INDEX idx_prenotazione_date ON prenotazione(data_checkin, data_checkout);
CREATE INDEX idx_prenotazione_stato ON prenotazione(stato);