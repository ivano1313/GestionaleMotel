package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.PeriodoTariffario;
import com.backend.gestionale_motel.entity.Tariffa;
import com.backend.gestionale_motel.entity.TipologiaCamera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity Tariffa
 */
@Repository
public interface TariffaRepository extends JpaRepository<Tariffa, Long> {

    /**
     * Trova la tariffa per una specifica tipologia e periodo
     * @param tipologia la tipologia di camera
     * @param periodo il periodo tariffario
     * @return Optional contenente la tariffa se trovata
     */
    Optional<Tariffa> findByTipologiaAndPeriodo(TipologiaCamera tipologia, PeriodoTariffario periodo);

    /**
     * Trova tutte le tariffe per una tipologia
     * @param tipologia la tipologia di camera
     * @return lista di tariffe per la tipologia
     */
    List<Tariffa> findByTipologia(TipologiaCamera tipologia);

    /**
     * Trova tutte le tariffe per un periodo
     * @param periodo il periodo tariffario
     * @return lista di tariffe per il periodo
     */
    List<Tariffa> findByPeriodo(PeriodoTariffario periodo);
}

