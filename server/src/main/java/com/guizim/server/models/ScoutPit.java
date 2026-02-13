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
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = ScoutPit.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class ScoutPit {

    public static final String TABLE_NAME = "scout_pit";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private User user;

    @Column(name = "team", unique = true, nullable = false)
    @NotNull(message = "O time é obrigatório")
    private Long team;

    @Column(name = "robot_name", length = 50, nullable = false)
    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 50)
    private String robotName;

    @Column(name = "drivetrain", length = 50, nullable = false)
    @NotBlank(message = "A drivetrain é obrigatória")
    @Size(min = 2, max = 50)
    private String driveTrain;

    @Column(name = "shooter", length = 50, nullable = false)
    @NotBlank(message = "O shooter é obrigatório")
    @Size(min = 2, max = 50)
    private String shooter;

    @Column(name = "intake", length = 50, nullable = false)
    @NotBlank(message = "O intake é obrigatório")
    @Size(min = 2, max = 50)
    private String intake;

    @Column(name = "trench_or_bump", length = 50, nullable = false)
    @NotBlank(message = "O trench ou bump é obrigatório")
    @Size(min = 2, max = 50)
    private String trenchOrBump;

    @Column(name = "auto_left", nullable = false)
    @NotNull(message = "O auto left é obrigatório")
    private Long autoLeft;

    @Column(name = "auto_center", nullable = false)
    @NotNull(message = "O auto center é obrigatório")
    private Long autoCenter;

    @Column(name = "auto_right", nullable = false)
    @NotNull(message = "O auto right é obrigatório")
    private Long autoRight;

    @Column(name = "tower_level", length = 50, nullable = false)
    @NotBlank(message = "O tower level é obrigatório")
    @Size(min = 2, max = 50)
    private String tower;

    @Column(name = "time_cycles", nullable = false)
    @NotNull(message = "O tempo dos ciclos é obrigatório")
    private Double timeCycles;

    @Column(name = "cycles", nullable = false)
    @NotNull(message = "O número de ciclos é obrigatório")
    private Long cycles;

    @Column(name = "notes", length = 255, nullable = true)
    private String notes;

}
