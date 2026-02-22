package com.guizim.server.services;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.User;
import com.guizim.server.models.Workspace;
import com.guizim.server.models.WorkspaceMember;
import com.guizim.server.models.enums.WorkspaceRole;
import com.guizim.server.repositorys.WorkspaceMemberRepository;
import com.guizim.server.repositorys.WorkspaceRepository;
import com.guizim.server.security.UserSpringSecurity;
import com.guizim.server.services.exceptions.AuthorizationException;
import com.guizim.server.services.exceptions.ObjectNotFoundException;

@Service
public class WorkspaceMemberService {

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserService userService;

    private User getLoggedUser() {
        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS)) {
            throw new AuthorizationException("Acesso negado!");
        }
        return this.userService.findById(userSS.getId());
    }

    private WorkspaceMember requireAdminOrOwner(Long workspaceId, Long userId) {
        WorkspaceMember me = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, userId)
                .orElseThrow(() -> new AuthorizationException("Acesso negado!"));

        if (!(me.getRole() == WorkspaceRole.OWNER || me.getRole() == WorkspaceRole.ADMIN)) {
            throw new AuthorizationException("Somente OWNER/ADMIN pode executar esta ação.");
        }

        return me;
    }

    private WorkspaceMember requireOwner(Long workspaceId, Long userId) {
        WorkspaceMember me = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, userId)
                .orElseThrow(() -> new AuthorizationException("Acesso negado!"));

        if (me.getRole() != WorkspaceRole.OWNER) {
            throw new AuthorizationException("Somente o OWNER pode executar esta ação.");
        }
        return me;
    }

    public List<WorkspaceMember> listMembers(Long workspaceId) {
        User user = getLoggedUser();

        // precisa ser membro para listar
        workspaceMemberRepository.findByWorkspace_IdAndUser_Id(workspaceId, user.getId())
                .orElseThrow(() -> new AuthorizationException("Acesso negado!"));

        return workspaceMemberRepository.findAllByWorkspace_Id(workspaceId);
    }

    @Transactional
    public void removeMember(Long workspaceId, Long userIdToRemove) {
        User user = getLoggedUser();
        requireAdminOrOwner(workspaceId, user.getId());

        WorkspaceMember target = workspaceMemberRepository.findByWorkspace_IdAndUser_Id(workspaceId, userIdToRemove)
                .orElseThrow(() -> new ObjectNotFoundException("Usuário não é membro deste workspace."));

        // ? Nao permite a remoção do DONO
        if (target.getRole() == WorkspaceRole.OWNER) {
            throw new AuthorizationException(
                    "Não é possível remover o DONO. Transfira a propriedade antes de efetuar a ação!");
        }

        workspaceMemberRepository.deleteByWorkspace_IdAndUser_Id(workspaceId, userIdToRemove);
    }

    @Transactional
    public WorkspaceMember changeRole(Long workspaceId, Long targetUserId, WorkspaceRole newRole) {
        User user = getLoggedUser();
        requireAdminOrOwner(workspaceId, user.getId());

        WorkspaceMember target = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(workspaceId, targetUserId)
                .orElseThrow(() -> new ObjectNotFoundException("Membro não encontrado no workspace."));

        if (target.getRole() == WorkspaceRole.OWNER) {
            throw new AuthorizationException("Não é permitido remover o papel DONO diretamente.");
        }

        if (newRole == WorkspaceRole.OWNER) {
            throw new AuthorizationException(
                    "O workspace desejado ja possui um DONO. Use a transferência de propriedade");
        }

        target.setRole(newRole);
        return workspaceMemberRepository.save(target);
    }

    @Transactional
    public WorkspaceMember transferOwnership(Long workspaceId, Long newOwnerUserId) {
        User user = getLoggedUser();
        WorkspaceMember me = requireOwner(workspaceId, newOwnerUserId);

        if (user.getId().equals(newOwnerUserId)) {
            throw new AuthorizationException("Você já é o DONO");
        }

        WorkspaceMember newOwner = workspaceMemberRepository.findByWorkspace_IdAndUser_Id(workspaceId, newOwnerUserId)
                .orElseThrow(() -> new ObjectNotFoundException("O novo DONO precisa ser membro do workspace."));

        Workspace ws = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ObjectNotFoundException("Workspace não encontrado."));

        ws.setOwner(newOwner.getUser());
        workspaceRepository.save(ws);

        newOwner.setRole(WorkspaceRole.OWNER);
        workspaceMemberRepository.save(newOwner);

        me.setRole(WorkspaceRole.ADMIN);
        workspaceMemberRepository.save(me);

        return newOwner;
    }
}