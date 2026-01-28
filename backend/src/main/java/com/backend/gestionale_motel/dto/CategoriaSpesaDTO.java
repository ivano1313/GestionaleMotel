package com.backend.gestionale_motel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaSpesaDTO {

    private Long id;

    @NotBlank(message = "Il nome della categoria è obbligatorio")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    private String nome;

    @Size(max = 255, message = "La descrizione non può superare i 255 caratteri")
    private String descrizione;

    private Boolean attivo;
}
