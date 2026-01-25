-- V16__create_configurazione.sql
-- Parametri globali del sistema (una sola riga)

CREATE TABLE configurazione (
                                id BIGINT PRIMARY KEY,

    -- Orari standard
                                orario_checkin TIME NOT NULL,
                                orario_checkout TIME NOT NULL,

    -- Limiti durata soggiorno (in notti)
                                durata_minima INT NOT NULL,
                                durata_massima INT NOT NULL,

    -- CHECK: una sola riga ammessa
                                CONSTRAINT chk_configurazione_singleton CHECK (id = 1),

    -- CHECK: durate valide
                                CONSTRAINT chk_configurazione_durata_minima CHECK (durata_minima >= 1),
                                CONSTRAINT chk_configurazione_durata_massima CHECK (durata_massima >= durata_minima)
);

-- Inserimento valori di default
INSERT INTO configurazione (id, orario_checkin, orario_checkout, durata_minima, durata_massima)
VALUES (1, '14:00:00', '10:00:00', 1, 30);