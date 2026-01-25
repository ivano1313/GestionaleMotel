package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per MetodoPagamento
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPagamentoDTO {

    private Long id;

    @NotBlank(message = "Il nome del metodo di pagamento è obbligatorio")
    @Size(max = 50, message = "Il nome non può superare i 50 caratteri")
    private String nome;

    private Boolean attivo;
}

