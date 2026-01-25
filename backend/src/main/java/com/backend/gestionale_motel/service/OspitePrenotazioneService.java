package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.OspitePrenotazioneDTO;
import com.backend.gestionale_motel.entity.Ospite;
import com.backend.gestionale_motel.entity.OspitePrenotazione;
import com.backend.gestionale_motel.entity.Prenotazione;
import com.backend.gestionale_motel.exception.ResourceNotFoundException;
import com.backend.gestionale_motel.repository.OspitePrenotazioneRepository;
import com.backend.gestionale_motel.repository.OspiteRepository;
import com.backend.gestionale_motel.repository.PrenotazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OspitePrenotazioneService {

    private final OspitePrenotazioneRepository ospitePrenotazioneRepository;
    private final OspiteRepository ospiteRepository;
    private final PrenotazioneRepository prenotazioneRepository;


    public List<OspitePrenotazioneDTO> findByPrenotazione(Long prenotazioneId) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        return ospitePrenotazioneRepository.findByPrenotazione(prenotazione).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OspitePrenotazioneDTO addOspite(Long prenotazioneId, Long ospiteId, boolean titolare) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        Ospite ospite = ospiteRepository.findById(ospiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Ospite", ospiteId));

        // Se questo ospite deve essere il titolare, prima rimuovi il flag da tutti gli altri
        if (titolare) {
            List<OspitePrenotazione> ospiti = ospitePrenotazioneRepository.findByPrenotazione(prenotazione);
            ospiti.forEach(op -> op.setTitolare(false));
            ospitePrenotazioneRepository.saveAll(ospiti);
        }

        OspitePrenotazione ospitePrenotazione = OspitePrenotazione.builder()
                .ospite(ospite)
                .prenotazione(prenotazione)
                .titolare(titolare)
                .build();

        OspitePrenotazione saved = ospitePrenotazioneRepository.save(ospitePrenotazione);
        return toDTO(saved);
    }

    @Transactional
    public void removeOspite(Long prenotazioneId, Long ospiteId) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        Ospite ospite = ospiteRepository.findById(ospiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Ospite", ospiteId));

        List<OspitePrenotazione> relazioni = ospitePrenotazioneRepository.findByPrenotazione(prenotazione);

        relazioni.stream()
                .filter(op -> op.getOspite().getId().equals(ospiteId))
                .findFirst()
                .ifPresent(ospitePrenotazioneRepository::delete);
    }

    @Transactional
    public OspitePrenotazioneDTO setTitolare(Long prenotazioneId, Long ospiteId) {
        Prenotazione prenotazione = prenotazioneRepository.findById(prenotazioneId)
                .orElseThrow(() -> new ResourceNotFoundException("Prenotazione", prenotazioneId));

        List<OspitePrenotazione> relazioni = ospitePrenotazioneRepository.findByPrenotazione(prenotazione);

        // Rimuovi il flag titolare da tutti
        relazioni.forEach(op -> op.setTitolare(false));

        // Imposta come titolare solo l'ospite specificato
        OspitePrenotazione titolare = relazioni.stream()
                .filter(op -> op.getOspite().getId().equals(ospiteId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ospite non presente nella prenotazione", ospiteId));

        titolare.setTitolare(true);

        ospitePrenotazioneRepository.saveAll(relazioni);
        return toDTO(titolare);
    }

    private OspitePrenotazioneDTO toDTO(OspitePrenotazione entity) {
        return OspitePrenotazioneDTO.builder()
                .id(entity.getId())
                .prenotazioneId(entity.getPrenotazione().getId())
                .ospiteId(entity.getOspite().getId())
                .ospiteNome(entity.getOspite().getNome())
                .ospiteCognome(entity.getOspite().getCognome())
                .titolare(entity.getTitolare())
                .build();
    }

}

