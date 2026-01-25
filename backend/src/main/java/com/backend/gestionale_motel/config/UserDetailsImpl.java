package com.backend.gestionale_motel.config;

import com.backend.gestionale_motel.entity.Ruolo;
import com.backend.gestionale_motel.entity.Utente;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Implementazione custom di UserDetails per Spring Security.
 *
 * Mappa l'entità Utente ai requisiti di Spring Security usando SOLO:
 * - id: Identificatore univoco immutabile
 * - username: Credenziale di login
 * - password: Password hashata (BCrypt)
 * - ruolo: Ruolo per autorizzazione
 * - attivo: Stato abilitazione account
 */
@Getter
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String username;
    private String password;
    private Ruolo ruolo;
    private Boolean attivo;

    /**
     * Factory method per creare UserDetailsImpl da entità Utente.
     *
     * @param utente Entità utente dal database
     * @return UserDetailsImpl per Spring Security
     */
    public static UserDetailsImpl build(Utente utente) {
        return new UserDetailsImpl(
            utente.getId(),
            utente.getUsername(),
            utente.getPassword(),
            utente.getRuolo(),
            utente.getAttivo()
        );
    }


    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Ritorna le authorities (ruoli) dell'utente.
     *
     * Spring Security richiede il prefisso "ROLE_" per i ruoli.
     * Es: Ruolo.ADMIN → "ROLE_ADMIN"
     *
     * @return Collection con il ruolo dell'utente
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + ruolo.name())
        );
    }

    /**
     * Indica se l'account è abilitato.
     *
     * @return true se attivo = true, false altrimenti
     */
    @Override
    public boolean isEnabled() {
        return attivo;
    }

    /**
     * Indica se l'account non è scaduto.
     *
     * Versione 1.0: Non gestiamo scadenza account.
     * Ritorna sempre true.
     *
     * @return true (account mai scaduto)
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indica se l'account non è bloccato.
     *
     * Versione 1.0: Non gestiamo blocco account.
     * Usiamo solo il campo 'attivo' per abilitare/disabilitare.
     * Ritorna sempre true.
     *
     * @return true (account mai bloccato)
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indica se le credenziali (password) non sono scadute.
     *
     * Versione 1.0: Non gestiamo scadenza password.
     * Ritorna sempre true.
     *
     * @return true (password mai scaduta)
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
