package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO per pagamento nel report incassi
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoReportDTO {

    private Long id;
    private LocalDateTime data;
    private BigDecimal importo;
    private String metodo;
    private String camera;
}
