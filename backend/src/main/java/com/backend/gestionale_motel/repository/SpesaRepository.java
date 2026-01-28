package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.CategoriaSpesa;
import com.backend.gestionale_motel.entity.Spesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SpesaRepository extends JpaRepository<Spesa, Long> {

    /**
     * Trova tutte le spese attive ordinate per data discendente
     * @return lista di spese attive
     */
    List<Spesa> findByAttivoTrueOrderByDataSpesaDesc();

    /**
     * Trova le spese per categoria (solo attive)
     * @param categoria la categoria
     * @return lista di spese della categoria
     */
    List<Spesa> findByCategoriaAndAttivoTrueOrderByDataSpesaDesc(CategoriaSpesa categoria);

    /**
     * Trova le spese in un intervallo di date (solo attive)
     * @param da data inizio
     * @param a data fine
     * @return lista di spese nel periodo
     */
    List<Spesa> findByDataSpesaBetweenAndAttivoTrueOrderByDataSpesaDesc(LocalDate da, LocalDate a);

    /**
     * Trova le spese per categoria in un intervallo di date (solo attive)
     * @param categoria la categoria
     * @param da data inizio
     * @param a data fine
     * @return lista di spese
     */
    List<Spesa> findByCategoriaAndDataSpesaBetweenAndAttivoTrueOrderByDataSpesaDesc(
            CategoriaSpesa categoria, LocalDate da, LocalDate a);

    /**
     * Calcola il totale delle spese in un periodo (solo attive)
     * @param da data inizio
     * @param a data fine
     * @return somma degli importi
     */
    @Query("SELECT COALESCE(SUM(s.importo), 0) FROM Spesa s WHERE s.dataSpesa BETWEEN :da AND :a AND s.attivo = true")
    BigDecimal sumImportoByPeriodo(@Param("da") LocalDate da, @Param("a") LocalDate a);

    /**
     * Calcola il totale delle spese per categoria in un periodo (solo attive)
     * @param categoria la categoria
     * @param da data inizio
     * @param a data fine
     * @return somma degli importi
     */
    @Query("SELECT COALESCE(SUM(s.importo), 0) FROM Spesa s WHERE s.categoria = :categoria AND s.dataSpesa BETWEEN :da AND :a AND s.attivo = true")
    BigDecimal sumImportoByCategoriaAndPeriodo(@Param("categoria") CategoriaSpesa categoria, @Param("da") LocalDate da, @Param("a") LocalDate a);
}
