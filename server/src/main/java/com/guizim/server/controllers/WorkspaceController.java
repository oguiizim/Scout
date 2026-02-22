package com.guizim.server.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.guizim.server.models.Workspace;
import com.guizim.server.models.WorkspaceMember;
import com.guizim.server.services.WorkspaceService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/workspaces")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    /**
     * Retorna o workspace ativo do usuário.
     * Se não existir, cria o workspace pessoal e retorna.
     */
    @GetMapping("/active")
    public ResponseEntity<Workspace> getActiveOrCreatePersonal() {
        Workspace ws = workspaceService.getActiveWorkspaceOrCreatePersonal();
        return ResponseEntity.ok(ws);
    }

    /**
     * Cria um workspace e já define como ativo (conforme seu service).
     */
    @PostMapping
    public ResponseEntity<Workspace> create(@Valid @RequestBody CreateWorkspaceRequest body) {
        Workspace ws = workspaceService.create(body.name());

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(ws.getId())
                .toUri();

        return ResponseEntity.created(uri).body(ws);
    }

    /**
     * Lista workspaces do usuário (pelo seu service retorna WorkspaceMember).
     * Isso é bom porque já traz o role do usuário naquele workspace.
     */
    @GetMapping("/me")
    public ResponseEntity<List<WorkspaceMember>> listMine() {
        List<WorkspaceMember> list = workspaceService.listMyWorkspaces();
        return ResponseEntity.ok(list);
    }

    /**
     * Entra em um workspace pelo shareCode.
     * Se setActive=true, também seta como ativo.
     */
    @PostMapping("/join")
    public ResponseEntity<WorkspaceMember> joinByCode(@Valid @RequestBody JoinWorkspaceRequest body) {
        WorkspaceMember member = workspaceService.joinByCode(body.shareCode(), body.setActive());

        // não tem um id único garantido no seu controller aqui (pode ter),
        // então eu retorno 200 OK com o objeto.
        return ResponseEntity.ok(member);
    }

    /**
     * Define o workspace ativo (usuário precisa ser membro).
     */
    @PutMapping("/active")
    public ResponseEntity<Void> setActive(@Valid @RequestBody SetActiveWorkspaceRequest body) {
        workspaceService.setActiveWorkspace(body.workspaceId());
        return ResponseEntity.noContent().build();
    }

    // ===== DTOs (scaláveis e simples) =====

    public static record CreateWorkspaceRequest(
            @NotBlank(message = "name é obrigatório") String name) {
    }

    public static record JoinWorkspaceRequest(
            @NotBlank(message = "shareCode é obrigatório") String shareCode,
            boolean setActive) {
    }

    public static record SetActiveWorkspaceRequest(
            @NotNull(message = "workspaceId é obrigatório") Long workspaceId) {
    }
}