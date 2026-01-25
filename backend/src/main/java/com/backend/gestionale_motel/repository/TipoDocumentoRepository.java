package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository per l'entity TipoDocumento
 * Tabella lookup per i tipi di documento
 */
@Repository
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Long> {

    /**
     * Ricerca un tipo documento per sigla
     * @param sigla la sigla del documento (es. CI, PS, PT)
     * @return Optional contenente il tipo documento se trovato
     */
    Optional<TipoDocumento> findBySigla(String sigla);
}

