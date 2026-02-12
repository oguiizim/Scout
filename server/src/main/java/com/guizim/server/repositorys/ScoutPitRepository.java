package com.guizim.server.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.ScoutPit;

@Repository
public interface ScoutPitRepository extends JpaRepository<ScoutPit, Long>{
    List<ScoutPit> findByTeam(Long team);
}
