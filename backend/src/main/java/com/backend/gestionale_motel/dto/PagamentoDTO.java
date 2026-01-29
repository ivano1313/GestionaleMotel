package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.backend.gestionale_motel.entity.TipoPagamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO per Pagamento
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoDTO {

    private Long id;

    @NotNull(message = "La prenotazione è obbligatoria")
    private Long prenotazioneId;

    @NotNull(message = "Il metodo di pagamento è obbligatorio")
    private Long metodoPagamentoId;

    private String metodoPagamentoNome;

    @NotNull(message = "L'importo è obbligatorio")
    @DecimalMin(value = "0.01", message = "L'importo deve essere maggiore di zero")
    private BigDecimal importo;

    private LocalDateTime dataPagamento;

    private TipoPagamento tipoPagamento;
}

