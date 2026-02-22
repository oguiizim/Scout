package com.guizim.server.repositorys;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guizim.server.models.WorkspaceMember;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {
    Optional<WorkspaceMember> findByWorkspace_IdAndUser_Id(Long workspaceId, Long userId);

    List<WorkspaceMember> findAllByUser_Id(Long id);

    List<WorkspaceMember> findAllByWorkspace_Id(Long workspaceId);

    void deleteByWorkspace_IdAndUser_Id(Long workspaceId, Long userId);
}
