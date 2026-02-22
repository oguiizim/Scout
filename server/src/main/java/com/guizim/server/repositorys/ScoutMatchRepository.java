package com.guizim.server.repositorys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.ScoutMatch;

@Repository
public interface ScoutMatchRepository extends JpaRepository<ScoutMatch, Long> {
    List<ScoutMatch> findAllByUser_id(Long id);

    List<ScoutMatch> findAllByUser_idAndTeam(Long userId, Long teamNumber);

    Optional<ScoutMatch> findByTeamAndMatchNumberAndUser_id(Long team, Long matchNumber, Long id);

    List<ScoutMatch> findAllByMatchNumberAndUser_id(Long matchNumber, Long id);

    //

    List<ScoutMatch> findAllByWorkspace_Id(Long workspaceId);

    List<ScoutMatch> findAllByWorkspace_IdAndTeam(Long workspaceId, Long teamNumber);

    List<ScoutMatch> findAllByWorkspace_IdAndMatchNumber(Long workspaceId, Long matchNumber);

    Optional<ScoutMatch> findByWorkspace_IdAndTeamAndMatchNumber(Long workspaceId, Long teamNumber, Long matchNumber);
}
