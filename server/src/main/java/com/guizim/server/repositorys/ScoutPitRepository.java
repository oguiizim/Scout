package com.guizim.server.repositorys;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.ScoutPit;

@Repository
public interface ScoutPitRepository extends JpaRepository<ScoutPit, Long> {
    Optional<ScoutPit> findByTeam(Long team);

    Optional<ScoutPit> findByTeamAndUser_id(Long team, Long id);

    //

    Optional<ScoutPit> findByWorkspace_IdAndTeam(Long workspaceId, Long team);

    Optional<ScoutPit> findByWorkspace_IdAndTeamAndUser_Id(Long workspaceId, Long team, Long user_id);
}
