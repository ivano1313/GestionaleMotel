package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Comune;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository per l'entity Comune
 * Tabella lookup per i comuni italiani
 */
@Repository
public interface ComuneRepository extends JpaRepository<Comune, Long> {

    /**
     * Ricerca comuni per nome (ricerca parziale)
     * @param nome il nome da cercare
     * @return lista di comuni con nome contenente la stringa
     */
    List<Comune> findByNomeContaining(String nome);

    /**
     * Trova tutti i comuni di una provincia
     * @param provincia la sigla della provincia
     * @return lista di comuni della provincia
     */
    List<Comune> findByProvincia(String provincia);
}

