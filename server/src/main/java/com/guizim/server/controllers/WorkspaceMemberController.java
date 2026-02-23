package com.guizim.server.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.guizim.server.models.WorkspaceMember;
import com.guizim.server.models.enums.WorkspaceRole;
import com.guizim.server.services.WorkspaceMemberService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/workspaces/{workspaceId}/members")
public class WorkspaceMemberController {

    @Autowired
    private WorkspaceMemberService workspaceMemberService;

    /**
     * Lista membros do workspace (usuário precisa ser membro).
     */
    @GetMapping
    public ResponseEntity<List<WorkspaceMember>> listMembers(@PathVariable Long workspaceId) {
        List<WorkspaceMember> list = workspaceMemberService.listMembers(workspaceId);
        return ResponseEntity.ok(list);
    }

    /**
     * Remove um membro do workspace (somente OWNER/ADMIN).
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long workspaceId,
            @PathVariable Long userId) {
        workspaceMemberService.removeMember(workspaceId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Altera role de um membro (somente OWNER/ADMIN).
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<WorkspaceMember> changeRole(
            @PathVariable Long workspaceId,
            @PathVariable Long userId,
            @Valid @RequestBody ChangeRoleRequest body) {
        WorkspaceMember updated = workspaceMemberService.changeRole(workspaceId, userId, body.role());
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{userId}/transfer-ownership")
    public ResponseEntity<WorkspaceMember> transferOwnership(
            @PathVariable Long workspaceId,
            @PathVariable Long userId) {
        WorkspaceMember updated = workspaceMemberService.transferOwnership(workspaceId, userId);
        return ResponseEntity.ok(updated);
    }

    // ===== DTO =====
    public static record ChangeRoleRequest(
            @NotNull(message = "role é obrigatório") WorkspaceRole role) {
    }
}