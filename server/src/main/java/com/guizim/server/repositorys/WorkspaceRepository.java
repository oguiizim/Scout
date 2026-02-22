package com.guizim.server.repositorys;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.Workspace;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    Optional<Workspace> findByShareCode(String shareCode);
    Optional<Workspace> findById(Long id);
    boolean existsByShareCode(String shareCode);
}
