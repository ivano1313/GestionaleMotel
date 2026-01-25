package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per Stato (tabella lookup)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatoDTO {

    private Long id;
    private String codice;
    private String nome;
}
