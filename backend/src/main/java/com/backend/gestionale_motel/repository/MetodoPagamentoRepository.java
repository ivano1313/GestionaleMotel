package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.MetodoPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity MetodoPagamento
 */
@Repository
public interface MetodoPagamentoRepository extends JpaRepository<MetodoPagamento, Long> {

    /**
     * Filtra i metodi di pagamento per stato attivo
     * @param attivo lo stato attivo
     * @return lista di metodi di pagamento con lo stato specificato
     */
    List<MetodoPagamento> findByAttivo(boolean attivo);

    /**
     * Ricerca un metodo di pagamento per nome
     * @param nome il nome del metodo
     * @return Optional contenente il metodo se trovato
     */
    Optional<MetodoPagamento> findByNome(String nome);
}

