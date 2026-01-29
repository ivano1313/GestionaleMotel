package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO per aggregazione incassi per metodo di pagamento
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncassoPerMetodoDTO {

    private Long metodoId;
    private String metodoNome;
    private BigDecimal totale;
    private int numeroPagamenti;
}
