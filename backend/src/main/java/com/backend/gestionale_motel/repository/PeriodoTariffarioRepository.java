package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.PeriodoTariffario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity PeriodoTariffario
 */
@Repository
public interface PeriodoTariffarioRepository extends JpaRepository<PeriodoTariffario, Long> {

    /**
     * Filtra i periodi per stato attivo
     * @param attivo lo stato attivo
     * @return lista di periodi con lo stato specificato
     */
    List<PeriodoTariffario> findByAttivo(boolean attivo);

    /**
     * Trova i periodi con data inizio in un determinato range
     * @param da data di inizio range
     * @param a data di fine range
     * @return lista di periodi nel range specificato
     */
    List<PeriodoTariffario> findByDataInizioBetween(LocalDate da, LocalDate a);

    /**
     * Trova il periodo tariffario valido per una data specifica
     * @param data la data da verificare
     * @return Optional contenente il periodo se trovato
     */
    @Query("SELECT p FROM PeriodoTariffario p WHERE " +
           "p.attivo = true AND :data BETWEEN p.dataInizio AND p.dataFine")
    Optional<PeriodoTariffario> findPeriodoPerData(@Param("data") LocalDate data);
}

