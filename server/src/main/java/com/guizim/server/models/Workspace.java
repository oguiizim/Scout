package com.guizim.server.models;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = Workspace.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Workspace {
    public static final String TABLE_NAME = "workspace";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @Column(name = "name", length = 50, nullable = false)
    @NotBlank(message = "O nome é obrigatório!")
    @Size(min = 2, max = 50, message = "O nome deve ter entre 2 e 50 caracteres!")
    private String name;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    @NotNull(message = "O user Id é obrigatório!")
    private User owner;

    @Column(name = "share_code", length = 12, nullable = false, unique = true)
    @NotBlank(message = "O share code é obrigatório")
    @Size(min = 8, max = 12, message = "O share code deve ter entre 8 e 12 caracteres")
    private String shareCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant dates = Instant.now();
}
