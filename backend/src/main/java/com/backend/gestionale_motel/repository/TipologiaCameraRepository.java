package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.TipologiaCamera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity TipologiaCamera
 */
@Repository
public interface TipologiaCameraRepository extends JpaRepository<TipologiaCamera, Long> {

    /**
     * Filtra le tipologie per stato attivo
     * @param attivo lo stato attivo
     * @return lista di tipologie con lo stato specificato
     */
    List<TipologiaCamera> findByAttivo(boolean attivo);

    /**
     * Ricerca una tipologia per nome
     * @param nome il nome della tipologia
     * @return Optional contenente la tipologia se trovata
     */
    Optional<TipologiaCamera> findByNome(String nome);

    /**
     * Verifica se esiste una tipologia con il nome specificato
     * @param nome il nome da verificare
     * @return true se esiste, false altrimenti
     */
    boolean existsByNome(String nome);
}

