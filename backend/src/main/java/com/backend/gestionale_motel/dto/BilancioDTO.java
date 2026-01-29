package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO per il bilancio entrate/uscite
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BilancioDTO {

    private LocalDate dataDa;
    private LocalDate dataA;

    private BigDecimal totaleEntrate;
    private BigDecimal totaleUscite;
    private BigDecimal saldo;

    private List<IncassoPerMetodoDTO> entratePerMetodo;
    private List<UscitaPerCategoriaDTO> uscitePerCategoria;
}
