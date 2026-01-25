package com.backend.gestionale_motel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO per un singolo giorno del planning
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanningGiornoDTO {

    private LocalDate data;
    private int arriviPrevisti;
    private int partenzePreviste;
    private int camereOccupate;
    private List<PrenotazioneDTO> prenotazioni;
}

