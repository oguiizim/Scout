package com.guizim.server.repositorys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.ScoutMatch;

@Repository
public interface ScoutMatchRepository extends JpaRepository<ScoutMatch, Long> {
    // List<ScoutMatch> findByUser_Id(Long id);
    List<ScoutMatch> findAllByUser_id(Long id);

    List<ScoutMatch> findAllByTeamAndUser_id(Long teamNumber, Long id);

    // para buscar por id com segurança
    Optional<ScoutMatch> findByTeamAndMatchNumberAndUser_id(Long team, Long matchNumber, Long id);

    List<ScoutMatch> findAllByMatchNumberAndUser_id(Long matchNumber, Long id);

}
