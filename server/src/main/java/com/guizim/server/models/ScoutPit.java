package com.guizim.server.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Column(name = "team", nullable = false)
    @NotNull(message = "O time é obrigatório")
    private Long team;

    @Column(name = "drivetrain", length = 50, nullable = false)
    @NotBlank(message = "A drivetrain é obrigatória")
    @Size(min = 2, max = 50)
    private String driveTrain;

    @Column(name = "robot_name", length = 50, nullable = false)
    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 50)
    private String robotName;
}
