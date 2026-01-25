package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.TariffaDTO;
import com.backend.gestionale_motel.entity.PeriodoTariffario;
import com.backend.gestionale_motel.entity.Tariffa;
import com.backend.gestionale_motel.entity.TipologiaCamera;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.PeriodoTariffarioRepository;
import com.backend.gestionale_motel.repository.TariffaRepository;
import com.backend.gestionale_motel.repository.TipologiaCameraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TariffaService {

    private final TariffaRepository tariffaRepository;
    private final TipologiaCameraRepository tipologiaCameraRepository;
    private final PeriodoTariffarioRepository periodoTariffarioRepository;

    public List<TariffaDTO> findAll() {
        return tariffaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TariffaDTO findById(Long id) {
        Tariffa tariffa = tariffaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tariffa", id));
        return toDTO(tariffa);
    }

    public TariffaDTO findByTipologiaAndPeriodo(Long tipologiaId, Long periodoId) {
        TipologiaCamera tipologia = tipologiaCameraRepository.findById(tipologiaId)
                .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", tipologiaId));
        PeriodoTariffario periodo = periodoTariffarioRepository.findById(periodoId)
                .orElseThrow(() -> new ResourceNotFoundException("PeriodoTariffario", periodoId));

        Tariffa tariffa = tariffaRepository.findByTipologiaAndPeriodo(tipologia, periodo)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Tariffa non trovata per tipologia " + tipologiaId + " e periodo " + periodoId));

        return toDTO(tariffa);
    }

    /**
     * Calcola il prezzo totale del soggiorno iterando giorno per giorno
     * e trovando la tariffa corretta per ogni periodo tariffario
     */
    public BigDecimal calcolaPrezzoSoggiorno(Long tipologiaId, LocalDate checkIn, LocalDate checkOut) {
        TipologiaCamera tipologia = tipologiaCameraRepository.findById(tipologiaId)
                .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", tipologiaId));

        BigDecimal totale = BigDecimal.ZERO;
        LocalDate currentDate = checkIn;

        // Itera giorno per giorno dal check-in al check-out (escluso)
        while (currentDate.isBefore(checkOut)) {
            final LocalDate dataCorrente = currentDate; // Variabile final per lambda

            // Trova il periodo tariffario per questa data
            PeriodoTariffario periodo = periodoTariffarioRepository.findPeriodoPerData(dataCorrente)
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Nessun periodo tariffario trovato per la data: " + dataCorrente));

            // Trova la tariffa per questa tipologia e periodo
            Tariffa tariffa = tariffaRepository.findByTipologiaAndPeriodo(tipologia, periodo)
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Tariffa non trovata per tipologia " + tipologiaId +
                        " e periodo " + periodo.getId() + " nella data " + dataCorrente));

            // Aggiungi il prezzo di questa notte al totale
            totale = totale.add(tariffa.getPrezzo());

            // Passa al giorno successivo
            currentDate = currentDate.plusDays(1);
        }

        return totale;
    }

    @Transactional
    public TariffaDTO create(TariffaDTO dto) {
        TipologiaCamera tipologia = tipologiaCameraRepository.findById(dto.getTipologiaId())
                .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", dto.getTipologiaId()));
        PeriodoTariffario periodo = periodoTariffarioRepository.findById(dto.getPeriodoId())
                .orElseThrow(() -> new ResourceNotFoundException("PeriodoTariffario", dto.getPeriodoId()));

        Tariffa tariffa = Tariffa.builder()
                .tipologia(tipologia)
                .periodo(periodo)
                .prezzo(dto.getPrezzoPerNotte())
                .attivo(true)
                .build();

        Tariffa saved = tariffaRepository.save(tariffa);
        return toDTO(saved);
    }

    @Transactional
    public TariffaDTO update(Long id, TariffaDTO dto) {
        Tariffa tariffa = tariffaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tariffa", id));

        if (dto.getTipologiaId() != null) {
            TipologiaCamera tipologia = tipologiaCameraRepository.findById(dto.getTipologiaId())
                    .orElseThrow(() -> new ResourceNotFoundException("TipologiaCamera", dto.getTipologiaId()));
            tariffa.setTipologia(tipologia);
        }

        if (dto.getPeriodoId() != null) {
            PeriodoTariffario periodo = periodoTariffarioRepository.findById(dto.getPeriodoId())
                    .orElseThrow(() -> new ResourceNotFoundException("PeriodoTariffario", dto.getPeriodoId()));
            tariffa.setPeriodo(periodo);
        }

        tariffa.setPrezzo(dto.getPrezzoPerNotte());

        Tariffa updated = tariffaRepository.save(tariffa);
        return toDTO(updated);
    }

    @Transactional
    public void delete(Long id) {
        Tariffa tariffa = tariffaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tariffa", id));
        tariffaRepository.delete(tariffa);
    }

    private TariffaDTO toDTO(Tariffa entity) {
        return TariffaDTO.builder()
                .id(entity.getId())
                .tipologiaId(entity.getTipologia().getId())
                .tipologiaNome(entity.getTipologia().getNome())
                .periodoId(entity.getPeriodo().getId())
                .periodoNome(entity.getPeriodo().getNome())
                .prezzoPerNotte(entity.getPrezzo())
                .build();
    }
}

