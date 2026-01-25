package com.backend.gestionale_motel.service;

import com.backend.gestionale_motel.dto.DashboardDTO;
import com.backend.gestionale_motel.dto.PlanningDTO;
import com.backend.gestionale_motel.dto.PlanningGiornoDTO;
import com.backend.gestionale_motel.dto.PrenotazioneDTO;
import com.backend.gestionale_motel.entity.Camera;
import com.backend.gestionale_motel.entity.Prenotazione;
import com.backend.gestionale_motel.entity.StatoPulizia;
import com.backend.gestionale_motel.repository.CameraRepository;
import com.backend.gestionale_motel.repository.PagamentoRepository;
import com.backend.gestionale_motel.repository.PrenotazioneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PrenotazioneRepository prenotazioneRepository;
    private final CameraRepository cameraRepository;
    private final PagamentoRepository pagamentoRepository;

    /**
     * Restituisce i dati aggregati per la dashboard principale
     */
    public DashboardDTO getDashboard() {
        LocalDate oggi = LocalDate.now();
        LocalDateTime inizioGiorno = oggi.atStartOfDay();
        LocalDateTime fineGiorno = oggi.plusDays(1).atStartOfDay();

        // Arrivi e partenze
        List<Prenotazione> arriviDelGiorno = prenotazioneRepository.findArriviDelGiorno(oggi);
        List<Prenotazione> partenzeDelGiorno = prenotazioneRepository.findPartenzeDelGiorno(oggi);

        // Camere occupate e disponibili
        List<Prenotazione> prenotazioniAttive = prenotazioneRepository.findPrenotazioniAttive(oggi);
        int camereOccupate = prenotazioniAttive.size();

        List<Camera> tutteLeCamere = cameraRepository.findAll();
        int camereDisponibili = (int) tutteLeCamere.stream()
                .filter(Camera::getAttivo)
                .count() - camereOccupate;

        // Camere da pulire
        int camereDaPulire = cameraRepository.findByStatoPulizia(StatoPulizia.DA_PULIRE).size();

        // Incassi di oggi
        BigDecimal incassiOggi = pagamentoRepository.findByDataPagamentoBetween(inizioGiorno, fineGiorno).stream()
                .map(p -> p.getImporto())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardDTO.builder()
                .arriviOggi(arriviDelGiorno.size())
                .partenzeOggi(partenzeDelGiorno.size())
                .camereOccupate(camereOccupate)
                .camereDisponibili(camereDisponibili)
                .camereDaPulire(camereDaPulire)
                .incassiOggi(incassiOggi)
                .arriviDelGiorno(arriviDelGiorno.stream().map(this::toPrenotazioneDTO).collect(Collectors.toList()))
                .partenzeDelGiorno(partenzeDelGiorno.stream().map(this::toPrenotazioneDTO).collect(Collectors.toList()))
                .build();
    }

    /**
     * Restituisce il planning delle prenotazioni per un periodo specificato
     */
    public PlanningDTO getPlanning(LocalDate da, LocalDate a) {
        List<PlanningGiornoDTO> giorni = new ArrayList<>();

        LocalDate currentDate = da;
        while (!currentDate.isAfter(a)) {
            PlanningGiornoDTO giorno = getPlanningGiorno(currentDate);
            giorni.add(giorno);
            currentDate = currentDate.plusDays(1);
        }

        return PlanningDTO.builder()
                .dataDa(da)
                .dataA(a)
                .giorni(giorni)
                .build();
    }

    /**
     * Crea il planning per un singolo giorno
     */
    private PlanningGiornoDTO getPlanningGiorno(LocalDate data) {
        List<Prenotazione> arriviPrevisti = prenotazioneRepository.findArriviDelGiorno(data);
        List<Prenotazione> partenzePreviste = prenotazioneRepository.findPartenzeDelGiorno(data);
        List<Prenotazione> prenotazioniAttive = prenotazioneRepository.findPrenotazioniAttive(data);

        return PlanningGiornoDTO.builder()
                .data(data)
                .arriviPrevisti(arriviPrevisti.size())
                .partenzePreviste(partenzePreviste.size())
                .camereOccupate(prenotazioniAttive.size())
                .prenotazioni(prenotazioniAttive.stream()
                        .map(this::toPrenotazioneDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    /**
     * Converte una Prenotazione entity in PrenotazioneDTO
     */
    private PrenotazioneDTO toPrenotazioneDTO(Prenotazione entity) {
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

