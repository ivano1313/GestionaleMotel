package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO per il planning delle prenotazioni
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanningDTO {

    private LocalDate dataDa;
    private LocalDate dataA;
    private List<PlanningGiornoDTO> giorni;
}

