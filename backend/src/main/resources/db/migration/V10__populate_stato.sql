-- V10__populate_stato.sql
-- Popolamento stati principali (espandibile con CSV ufficiale)

INSERT INTO stato (codice, nome) VALUES
-- Italia (obbligatorio)
('100000100', 'ITALIA'),

-- Europa occidentale
('100000201', 'FRANCIA'),
('100000212', 'GERMANIA'),
('100000221', 'REGNO UNITO'),
('100000238', 'SPAGNA'),
('100000227', 'SVIZZERA'),
('100000206', 'AUSTRIA'),
('100000214', 'PAESI BASSI'),
('100000209', 'BELGIO'),

-- Europa orientale
('100000232', 'ROMANIA'),
('100000248', 'ALBANIA'),
('100000252', 'UCRAINA'),
('100000235', 'POLONIA'),

-- Americhe
('100000536', 'STATI UNITI D''AMERICA'),
('100000602', 'BRASILE'),
('100000604', 'ARGENTINA'),

-- Asia/Africa
('100000720', 'CINA'),
('100000404', 'MAROCCO'),
('100000330', 'INDIA'),
('100000732', 'GIAPPONE');