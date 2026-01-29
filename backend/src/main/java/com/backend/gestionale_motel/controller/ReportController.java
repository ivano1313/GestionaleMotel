package com.backend.gestionale_motel.controller;

import com.backend.gestionale_motel.dto.BilancioDTO;
import com.backend.gestionale_motel.dto.ReportIncassiDTO;
import com.backend.gestionale_motel.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Controller REST per i report
 */
@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /**
     * Recupera il report degli incassi per un periodo specificato
     * @param da data di inizio periodo (formato ISO: yyyy-MM-dd). Default: primo giorno del mese corrente
     * @param a data di fine periodo (formato ISO: yyyy-MM-dd). Default: oggi
     * @return report con totale incassi, breakdown per metodo e lista pagamenti
     */
    @GetMapping("/incassi")
    public ResponseEntity<ReportIncassiDTO> getReportIncassi(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate da,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate a) {

        // Default: primo giorno del mese corrente
        LocalDate dataDa = (da != null) ? da : LocalDate.now().withDayOfMonth(1);

        // Default: oggi
        LocalDate dataA = (a != null) ? a : LocalDate.now();

        ReportIncassiDTO report = reportService.getReportIncassi(dataDa, dataA);
        return ResponseEntity.ok(report);
    }

    /**
     * Recupera il bilancio entrate/uscite per un periodo specificato
     * @param da data di inizio periodo (formato ISO: yyyy-MM-dd). Default: primo giorno del mese corrente
     * @param a data di fine periodo (formato ISO: yyyy-MM-dd). Default: oggi
     * @return bilancio con totale entrate, uscite, saldo e breakdown
     */
    @GetMapping("/bilancio")
    public ResponseEntity<BilancioDTO> getBilancio(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate da,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate a) {

        // Default: primo giorno del mese corrente
        LocalDate dataDa = (da != null) ? da : LocalDate.now().withDayOfMonth(1);

        // Default: oggi
        LocalDate dataA = (a != null) ? a : LocalDate.now();

        BilancioDTO bilancio = reportService.getBilancio(dataDa, dataA);
        return ResponseEntity.ok(bilancio);
    }
}
