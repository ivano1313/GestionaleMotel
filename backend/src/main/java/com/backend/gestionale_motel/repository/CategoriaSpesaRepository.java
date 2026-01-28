package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.CategoriaSpesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaSpesaRepository extends JpaRepository<CategoriaSpesa, Long> {

    /**
     * Filtra le categorie per stato attivo
     * @param attivo lo stato attivo
     * @return lista di categorie con lo stato specificato
     */
    List<CategoriaSpesa> findByAttivo(boolean attivo);

    /**
     * Ricerca una categoria per nome
     * @param nome il nome della categoria
     * @return Optional contenente la categoria se trovata
     */
    Optional<CategoriaSpesa> findByNome(String nome);
}
