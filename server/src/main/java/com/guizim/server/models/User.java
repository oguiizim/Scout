package com.guizim.server.models;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guizim.server.models.enums.ProfileEnum;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = User.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class User {

    public static final String TABLE_NAME = "user";

    public interface CreateUser {

    }

    public interface UpdateUser {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @Column(name = "user_team", nullable = false)
    @NotBlank(groups = CreateUser.class, message = "O time é obrigatório")
    private Long team;

    @Column(name = "username", length = 40, nullable = false, unique = true)
    @NotBlank(groups = CreateUser.class, message = "O usuário é obrigatório")
    @Size(groups = CreateUser.class, min = 2, max = 100, message = "O usuário deve ter entre 2 e 100 caracteres")
    private String username;

    @Column(name = "password", length = 100, nullable = false)
    @NotBlank(groups = CreateUser.class, message = "A senha é obrigatória")
    @Size(groups = CreateUser.class, min = 6, max = 100, message = "A senha deve ter entre 6 e 100 caracteres")
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @CollectionTable(name = "user_profile")
    @Column(name = "profile", nullable = false)
    private Set<Integer> profiles = new HashSet<>();

    public Set<ProfileEnum> getProfiles() {
        return this.profiles.stream().map(x -> ProfileEnum.toEnum(x)).collect(Collectors.toSet());
    }

    public void addProfile(ProfileEnum profileEnum) {
        this.profiles.add(profileEnum.getCode());
    }
}
