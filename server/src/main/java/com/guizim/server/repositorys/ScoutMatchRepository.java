package com.guizim.server.repositorys;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.ScoutMatch;

@Repository
public interface ScoutMatchRepository extends JpaRepository<ScoutMatch, Long>{
    List<ScoutMatch> findByUser_Id(Long id);
}
