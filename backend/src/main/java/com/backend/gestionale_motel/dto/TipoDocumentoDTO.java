package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per TipoDocumento (tabella lookup)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoDocumentoDTO {

    private Long id;
    private String sigla;
    private String descrizione;
    private Boolean attivo;
}
