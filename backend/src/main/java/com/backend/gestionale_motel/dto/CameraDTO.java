package com.backend.gestionale_motel.dto;

import com.backend.gestionale_motel.entity.StatoPulizia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO per Camera
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraDTO {

    private Long id;

    @NotBlank(message = "Il numero della camera è obbligatorio")
    @Size(max = 20, message = "Il numero non può superare i 20 caratteri")
    private String numero;

    private StatoPulizia statoPulizia;

    @NotNull(message = "La tipologia è obbligatoria")
    private Long tipologiaId;

    private String tipologiaNome;
}

