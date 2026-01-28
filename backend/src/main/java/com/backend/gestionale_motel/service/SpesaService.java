package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.SpesaDTO;
import com.backend.gestionale_motel.entity.CategoriaSpesa;
import com.backend.gestionale_motel.entity.Spesa;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.CategoriaSpesaRepository;
import com.backend.gestionale_motel.repository.SpesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpesaService {

    private final SpesaRepository spesaRepository;
    private final CategoriaSpesaRepository categoriaSpesaRepository;

    /**
     * Trova tutte le spese con filtri opzionali
     * @param categoriaId ID categoria (opzionale)
     * @param da data inizio (opzionale)
     * @param a data fine (opzionale)
     * @return lista di spese filtrate
     */
    public List<SpesaDTO> findAll(Long categoriaId, LocalDate da, LocalDate a) {
        List<Spesa> spese;

        if (categoriaId != null && da != null && a != null) {
            CategoriaSpesa categoria = categoriaSpesaRepository.findById(categoriaId)
                    .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", categoriaId));
            spese = spesaRepository.findByCategoriaAndDataSpesaBetweenAndAttivoTrueOrderByDataSpesaDesc(categoria, da, a);
        } else if (categoriaId != null) {
            CategoriaSpesa categoria = categoriaSpesaRepository.findById(categoriaId)
                    .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", categoriaId));
            spese = spesaRepository.findByCategoriaAndAttivoTrueOrderByDataSpesaDesc(categoria);
        } else if (da != null && a != null) {
            spese = spesaRepository.findByDataSpesaBetweenAndAttivoTrueOrderByDataSpesaDesc(da, a);
        } else {
            spese = spesaRepository.findByAttivoTrueOrderByDataSpesaDesc();
        }

        return spese.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SpesaDTO findById(Long id) {
        Spesa spesa = spesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spesa", id));
        return toDTO(spesa);
    }

    @Transactional
    public SpesaDTO create(SpesaDTO dto) {
        CategoriaSpesa categoria = categoriaSpesaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", dto.getCategoriaId()));

        Spesa spesa = Spesa.builder()
                .categoria(categoria)
                .descrizione(dto.getDescrizione())
                .importo(dto.getImporto())
                .dataSpesa(dto.getDataSpesa())
                .note(dto.getNote())
                .attivo(true)
                .build();

        Spesa saved = spesaRepository.save(spesa);
        return toDTO(saved);
    }

    @Transactional
    public SpesaDTO update(Long id, SpesaDTO dto) {
        Spesa spesa = spesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spesa", id));

        CategoriaSpesa categoria = categoriaSpesaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("CategoriaSpesa", dto.getCategoriaId()));

        spesa.setCategoria(categoria);
        spesa.setDescrizione(dto.getDescrizione());
        spesa.setImporto(dto.getImporto());
        spesa.setDataSpesa(dto.getDataSpesa());
        spesa.setNote(dto.getNote());

        Spesa updated = spesaRepository.save(spesa);
        return toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        Spesa spesa = spesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spesa", id));
        spesa.setAttivo(false);
        spesaRepository.save(spesa);
    }

    /**
     * Calcola il totale delle spese in un periodo
     * @param da data inizio
     * @param a data fine
     * @return somma degli importi
     */
    public BigDecimal getTotale(LocalDate da, LocalDate a) {
        return spesaRepository.sumImportoByPeriodo(da, a);
    }

    private SpesaDTO toDTO(Spesa entity) {
        return SpesaDTO.builder()
                .id(entity.getId())
                .categoriaId(entity.getCategoria().getId())
                .categoriaNome(entity.getCategoria().getNome())
                .descrizione(entity.getDescrizione())
                .importo(entity.getImporto())
                .dataSpesa(entity.getDataSpesa())
                .note(entity.getNote())
                .attivo(entity.getAttivo())
                .build();
    }
}
