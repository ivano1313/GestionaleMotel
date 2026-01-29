package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO per il report degli incassi per periodo
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportIncassiDTO {

    private LocalDate dataDa;
    private LocalDate dataA;
    private BigDecimal totaleIncassi;
    private List<IncassoPerMetodoDTO> incassiPerMetodo;
    private List<PagamentoReportDTO> pagamenti;
}
