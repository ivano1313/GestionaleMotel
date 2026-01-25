-- V8__fix_tipo_documento_codici.sql
-- Correzione sigle per compatibilità Portale Alloggiati Questura

UPDATE tipo_documento SET sigla = 'IDENT' WHERE sigla = 'CI';
UPDATE tipo_documento SET sigla = 'PASOR' WHERE sigla = 'PA';
UPDATE tipo_documento SET sigla = 'PATEN' WHERE sigla = 'PT';

DELETE FROM tipo_documento WHERE sigla = 'AM';