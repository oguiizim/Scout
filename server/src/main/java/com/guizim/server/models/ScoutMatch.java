package com.guizim.server.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = ScoutMatch.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class ScoutMatch {

    public static final String TABLE_NAME = "scout_match";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, updatable = false)
    private Workspace workspace;

    @Column(name = "match_number", nullable = false)
    @NotNull(message = "A partida é obrigatória")
    private Long matchNumber;

    @Column(name = "team", nullable = false)
    @NotNull(message = "O time é obrigatório")
    private Long team;

    @Column(name = "auto_cycles", nullable = false)
    @NotNull(message = "Os ciclos são obrigatórios")
    private Long autoCycles;

    @Column(name = "tele_cycles", nullable = false)
    @NotNull(message = "Os ciclos são obrigatórios")
    private Long teleCycles;

    @Column(name = "position", nullable = false)
    @NotBlank(message = "A posição é obrigatória")
    private String position;

    @Column(name = "broke", nullable = false)
    @NotNull(message = "O status de quebra é obrigatório")
    private Boolean areBroke;

    @Column(name = "auto", nullable = false)
    @NotNull(message = "O status de auto é obrigatório")
    private Boolean autoWork;

    @Column(name = "tower_end", nullable = false)
    @NotBlank(message = "O status de torre é obrigatório")
    private String towerEnd;

    @Column(name = "tower_auto", nullable = false)
    @NotBlank(message = "O status de torre é obrigatório")
    private String towerAuto;

    @Column(name = "notes", columnDefinition = "TEXT", nullable = true)
    private String notes;
}
