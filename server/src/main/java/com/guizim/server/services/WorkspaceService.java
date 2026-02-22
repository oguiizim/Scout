package com.guizim.server.services;

import java.security.SecureRandom;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.User;
import com.guizim.server.models.Workspace;
import com.guizim.server.models.WorkspaceMember;
import com.guizim.server.models.enums.WorkspaceRole;
import com.guizim.server.repositorys.UserRepository;
import com.guizim.server.repositorys.WorkspaceMemberRepository;
import com.guizim.server.repositorys.WorkspaceRepository;
import com.guizim.server.security.UserSpringSecurity;
import com.guizim.server.services.exceptions.AuthorizationException;
import com.guizim.server.services.exceptions.ObjectNotFoundException;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private static final SecureRandom RNG = new SecureRandom();
    private static final String ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private User getLoggedUser() {
        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS)) {
            throw new AuthorizationException("Acesso negado!");
        }
        return this.userService.findById(userSS.getId());
    }

    private String newShareCode(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++)
            sb.append(ALPHANUM.charAt(RNG.nextInt(ALPHANUM.length())));
        return sb.toString();
    }

    private String generateUniqueShareCode() {
        for (int i = 0; i < 10; i++) {
            String code = newShareCode(12);
            if (!workspaceRepository.existsByShareCode(code))
                return code;
        }
        throw new RuntimeException("Não foi possível gerar shareCode único.");
    }

    /**
     * Retorna o workspace ativo do usuário, criando o pessoal se ainda não existir
     */
    @Transactional
    public Workspace getActiveWorkspaceOrCreatePersonal() {
        User user = getLoggedUser();

        Workspace activeId = user.getActive_workspace_id();

        if (activeId != null) {
            return workspaceRepository.findById(activeId.getId())
                    .orElseThrow(() -> new ObjectNotFoundException(
                            "Workspace ativo não encontrado! Id:" + activeId.getId()));
        }

        // cria workspace pessoal
        Workspace ws = new Workspace();
        ws.setName("Equipe " + user.getTeam());
        ws.setOwner(user); // se o owner no Workspace é User
        ws.setShareCode(generateUniqueShareCode());
        ws = workspaceRepository.save(ws);

        WorkspaceMember ownerMember = new WorkspaceMember();
        ownerMember.setWorkspace(ws);
        ownerMember.setUser(user);
        ownerMember.setRole(WorkspaceRole.OWNER);
        workspaceMemberRepository.save(ownerMember);

        user.setActive_workspace_id(ws);
        userRepository.save(user);

        return ws;
    }

    @Transactional
    public Workspace create(String name) {
        User user = getLoggedUser();

        Workspace ws = new Workspace();
        ws.setName(name);
        ws.setOwner(user);
        ws.setShareCode(generateUniqueShareCode());
        ws = workspaceRepository.save(ws);

        WorkspaceMember ownerMember = new WorkspaceMember();
        ownerMember.setWorkspace(ws);
        ownerMember.setUser(user);
        ownerMember.setRole(WorkspaceRole.OWNER);
        workspaceMemberRepository.save(ownerMember);

        user.setActive_workspace_id(ws);
        userRepository.save(user);

        return ws;
    }

    public List<WorkspaceMember> listMyWorkspaces() {
        User user = getLoggedUser();
        return workspaceMemberRepository.findAllByUser_Id(user.getId());
    }

    @Transactional
    public WorkspaceMember joinByCode(String shareCode, boolean setActive) {
        User user = getLoggedUser();

        Workspace ws = workspaceRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new ObjectNotFoundException("Código inválido."));

        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspace_IdAndUser_Id(ws.getId(), user.getId())
                .orElseGet(() -> {
                    WorkspaceMember m = new WorkspaceMember();
                    m.setWorkspace(ws);
                    m.setUser(user);
                    m.setRole(WorkspaceRole.MEMBER);
                    return workspaceMemberRepository.save(m);
                });

        if (setActive) {
            user.setActive_workspace_id(ws);
            userRepository.save(user);
        }

        return member;
    }

    @Transactional
    public void setActiveWorkspace(Long workspaceId) {
        User user = getLoggedUser();

        Optional<Workspace> ws = this.workspaceRepository.findById(workspaceId);

        workspaceMemberRepository.findByWorkspace_IdAndUser_Id(workspaceId, user.getId())
                .orElseThrow(() -> new AuthorizationException("Você não faz parte deste workspace."));

        workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ObjectNotFoundException("Workspace não encontrado! Id: " + workspaceId));

        user.setActive_workspace_id(ws.get());
        userRepository.save(user);
    }
}