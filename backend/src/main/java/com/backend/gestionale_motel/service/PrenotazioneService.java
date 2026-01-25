package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.PrenotazioneDTO;
import com.backend.gestionale_motel.entity.Camera;
import com.backend.gestionale_motel.entity.Prenotazione;
import com.backend.gestionale_motel.entity.StatoPrenotazione;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.CameraRepository;
import com.backend.gestionale_motel.repository.PagamentoRepository;
import com.backend.gestionale_motel.repository.PrenotazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrenotazioneService {

    private final PrenotazioneRepository prenotazioneRepository;
    private final CameraRepository cameraRepository;
    private final PagamentoRepository pagamentoRepository;
    private final TariffaService tariffaService;
    private final ConfigurazioneService configurazioneService;

    public List<PrenotazioneDTO> findAll() {
        return prenotazioneRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PrenotazioneDTO findById(Long id) {
        Prenotazione prenotazione = prenotazioneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", id));
        return toDTO(prenotazione);
    }

    public List<PrenotazioneDTO> findArriviOggi() {
        LocalDate oggi = LocalDate.now();
        return prenotazioneRepository.findArriviDelGiorno(oggi).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PrenotazioneDTO> findPartenzeOggi() {
        LocalDate oggi = LocalDate.now();
        return prenotazioneRepository.findPartenzeDelGiorno(oggi).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PrenotazioneDTO> findAttive() {
        LocalDate oggi = LocalDate.now();
        return prenotazioneRepository.findPrenotazioniAttive(oggi).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Verifica se una camera è disponibile nel periodo specificato
     * controllando che non ci siano sovrapposizioni con altre prenotazioni
     */
    public boolean verificaDisponibilita(Long cameraId, LocalDate checkIn, LocalDate checkOut) {
        Camera camera = cameraRepository.findById(cameraId)
                .orElseThrow(() -> new ResourceNotFoundException("Camera", cameraId));

        return !prenotazioneRepository.existsSovrapposizione(camera, checkIn, checkOut);
    }

    /**
     * Calcola il saldo dovuto: prezzo totale - totale pagato
     */
    public BigDecimal calcolaSaldoDovuto(Long id) {
        Prenotazione prenotazione = prenotazioneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", id));

        BigDecimal prezzoTotale = prenotazione.getPrezzoTotale();
        BigDecimal totalePagato = pagamentoRepository.sumImportoByPrenotazione(prenotazione);

        return prezzoTotale.subtract(totalePagato);
    }

    @Transactional
    public PrenotazioneDTO create(PrenotazioneDTO dto) {
        Camera camera = cameraRepository.findById(dto.getCameraId())
                .orElseThrow(() -> new ResourceNotFoundException("Camera", dto.getCameraId()));

        // Validazione 1: checkOut deve essere dopo checkIn
        if (!dto.getDataCheckout().isAfter(dto.getDataCheckin())) {
            throw new IllegalArgumentException("La data di check-out deve essere successiva alla data di check-in");
        }

        // Validazione 2: durata minima e massima dalla configurazione
        long durataNotti = java.time.temporal.ChronoUnit.DAYS.between(dto.getDataCheckin(), dto.getDataCheckout());
        var configurazione = configurazioneService.get();

        if (durataNotti < configurazione.getDurataMinima()) {
            throw new IllegalArgumentException(
                String.format("La durata del soggiorno (%d notti) è inferiore al minimo consentito (%d notti)",
                    durataNotti, configurazione.getDurataMinima())
            );
        }

        if (durataNotti > configurazione.getDurataMassima()) {
            throw new IllegalArgumentException(
                String.format("La durata del soggiorno (%d notti) supera il massimo consentito (%d notti)",
                    durataNotti, configurazione.getDurataMassima())
            );
        }

        // Verifica disponibilità
        if (prenotazioneRepository.existsSovrapposizione(camera, dto.getDataCheckin(), dto.getDataCheckout())) {
            throw new IllegalStateException("Camera non disponibile nel periodo specificato");
        }

        // Calcola il prezzo totale usando TariffaService
        BigDecimal prezzoTotale = tariffaService.calcolaPrezzoSoggiorno(
                camera.getTipologia().getId(),
                dto.getDataCheckin(),
                dto.getDataCheckout()
        );

        Prenotazione prenotazione = Prenotazione.builder()
                .camera(camera)
                .dataCheckin(dto.getDataCheckin())
                .dataCheckout(dto.getDataCheckout())
                .stato(StatoPrenotazione.CONFERMATA)
                .prezzoTotale(prezzoTotale)
                .attivo(true)
                .build();

        Prenotazione saved = prenotazioneRepository.save(prenotazione);
        return toDTO(saved);
    }

    @Transactional
    public PrenotazioneDTO cambiaStato(Long id, StatoPrenotazione nuovoStato) {
        Prenotazione prenotazione = prenotazioneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", id));

        StatoPrenotazione statoCorrente = prenotazione.getStato();

        // Validazione transizioni di stato ammesse
        if (!isTransizioneValida(statoCorrente, nuovoStato)) {
            throw new IllegalStateException(
                String.format("Transizione non ammessa: da %s a %s", statoCorrente, nuovoStato)
            );
        }

        prenotazione.setStato(nuovoStato);
        Prenotazione updated = prenotazioneRepository.save(prenotazione);
        return toDTO(updated);
    }

    /**
     * Valida le transizioni di stato ammesse per una prenotazione
     *
     * Transizioni valide:
     * - CONFERMATA -> IN_CORSO, CANCELLATA
     * - IN_CORSO -> COMPLETATA, CANCELLATA
     * - COMPLETATA -> (nessuna transizione)
     * - CANCELLATA -> (nessuna transizione)
     */
    private boolean isTransizioneValida(StatoPrenotazione da, StatoPrenotazione a) {
        if (da == a) {
            return true; // Stesso stato è sempre valido
        }

        return switch (da) {
            case CONFERMATA -> a == StatoPrenotazione.IN_CORSO || a == StatoPrenotazione.CANCELLATA;
            case IN_CORSO -> a == StatoPrenotazione.COMPLETATA || a == StatoPrenotazione.CANCELLATA;
            case COMPLETATA, CANCELLATA -> false; // Stati finali, nessuna transizione
        };
    }

    private PrenotazioneDTO toDTO(Prenotazione entity) {
        return PrenotazioneDTO.builder()
                .id(entity.getId())
                .cameraId(entity.getCamera().getId())
                .cameraNumero(entity.getCamera().getNumero())
                .dataCheckin(entity.getDataCheckin())
                .dataCheckout(entity.getDataCheckout())
                .stato(entity.getStato())
                .prezzoTotale(entity.getPrezzoTotale())
                .build();
    }
}

