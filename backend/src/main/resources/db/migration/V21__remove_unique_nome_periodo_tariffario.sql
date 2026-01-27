-- =============================================
-- V21: Rimuove vincolo UNIQUE su nome periodo_tariffario
-- Permette più periodi con lo stesso nome (es. più "Alta stagione" in un anno)
-- =============================================

ALTER TABLE periodo_tariffario DROP INDEX nome;
