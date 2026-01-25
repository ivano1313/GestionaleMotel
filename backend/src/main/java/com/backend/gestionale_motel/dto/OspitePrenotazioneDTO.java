package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per OspitePrenotazione (relazione N:N)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OspitePrenotazioneDTO {

    private Long id;
    private Long prenotazioneId;
    private Long ospiteId;
    private String ospiteNome;
    private String ospiteCognome;
    private Boolean titolare;
}
