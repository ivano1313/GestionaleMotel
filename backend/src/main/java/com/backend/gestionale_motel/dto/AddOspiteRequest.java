package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per la richiesta di aggiunta ospite a prenotazione
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddOspiteRequest {

    @NotNull(message = "L'identificativo dell'ospite è obbligatorio")
    private Long ospiteId;

    @Builder.Default
    private Boolean titolare = false;
}
