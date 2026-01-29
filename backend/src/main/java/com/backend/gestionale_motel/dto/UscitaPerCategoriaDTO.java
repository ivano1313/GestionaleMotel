package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO per aggregazione uscite per categoria spesa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UscitaPerCategoriaDTO {

    private Long categoriaId;
    private String categoriaNome;
    private BigDecimal totale;
    private int numeroSpese;
}
