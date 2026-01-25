package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.DashboardDTO;
import com.backend.gestionale_motel.dto.PlanningDTO;
import com.backend.gestionale_motel.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Controller REST per la dashboard e il planning
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashBoardController {

    private final DashboardService dashboardService;

    /**
     * Recupera le statistiche aggregate per la dashboard principale
     * Include:
     * - Contatori: arrivi oggi, partenze oggi, camere occupate/disponibili/da pulire
     * - Finanziari: incassi di oggi
     * - Liste dettagliate: arrivi e partenze del giorno
     * @return i dati della dashboard con statistiche in tempo reale
     */
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard() {
        DashboardDTO dashboard = dashboardService.getDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Recupera il planning delle prenotazioni per un periodo specificato
     * Utile per visualizzare la situazione prenotazioni in formato calendario
     * @param da data di inizio periodo (formato ISO: yyyy-MM-dd). Default: oggi
     * @param a data di fine periodo (formato ISO: yyyy-MM-dd). Default: oggi + 7 giorni
     * @return il planning con dati giornalieri (arrivi, partenze, camere occupate)
     */
    @GetMapping("/planning")
    public ResponseEntity<PlanningDTO> getPlanning(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate da,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate a) {

        // Se non specificato, usa oggi come data inizio
        LocalDate dataDa = (da != null) ? da : LocalDate.now();

        // Se non specificato, usa oggi + 7 giorni come data fine
        LocalDate dataA = (a != null) ? a : LocalDate.now().plusDays(7);

        PlanningDTO planning = dashboardService.getPlanning(dataDa, dataA);
        return ResponseEntity.ok(planning);
    }
}
