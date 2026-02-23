package com.guizim.server.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.ScoutPit;
import com.guizim.server.models.User;
import com.guizim.server.models.Workspace;
import com.guizim.server.repositorys.ScoutPitRepository;
import com.guizim.server.security.UserSpringSecurity;
import com.guizim.server.services.exceptions.AuthorizationException;
import com.guizim.server.services.exceptions.DataBindingViolationException;
import com.guizim.server.services.exceptions.ObjectNotFoundException;

@Service
public class ScoutPitService {

    @Autowired
    private ScoutPitRepository scoutPitRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private WorkspaceService workspaceService;

    private User loggedUser() {
        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS))
            throw new AuthorizationException("Acesso negado!");
        return this.userService.findById(userSS.getId());
    }

    private Workspace activeWorkspace() {
        return workspaceService.getActiveWorkspaceOrCreatePersonal();
    }

    @Transactional
    public ScoutPit create(ScoutPit obj) {
        User user = loggedUser();
        Workspace ws = activeWorkspace();

        obj.setId(null);
        obj.setUser(user); // auditoria: quem criou
        obj.setWorkspace(ws); // visibilidade/compartilhamento

        return this.scoutPitRepository.save(obj);
    }

    @Transactional
    public ScoutPit update(ScoutPit obj) {
        ScoutPit newObj = findByTeam(obj.getTeam());

        // não deixa trocar workspace/user
        newObj.setDriveTrain(obj.getDriveTrain());
        newObj.setRobotName(obj.getRobotName());
        // coloque aqui os outros campos do pit que você tiver

        return this.scoutPitRepository.save(newObj);
    }

    public void delete(Long team) {
        ScoutPit obj = findByTeam(team);
        try {
            this.scoutPitRepository.deleteById(obj.getId());
        } catch (Exception e) {
            throw new DataBindingViolationException("Não é possível excluir pois há entidades relacionadas!");
        }
    }

    public ScoutPit findByTeam(Long team) {
        loggedUser();
        Workspace ws = activeWorkspace();

        return this.scoutPitRepository.findByWorkspace_IdAndTeam(ws.getId(), team)
                .orElseThrow(() -> new ObjectNotFoundException(
                        "ScoutPit não encontrado! Time: " + team + ", Workspace: " + ws.getId()));
    }

    public ScoutPit findById(Long id) {
        loggedUser();
        Workspace ws = activeWorkspace();

        ScoutPit pit = this.scoutPitRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutPit não encontrado! Id: " + id));

        // regra simples: só acessa se for do workspace ativo
        if (!pit.getWorkspace().getId().equals(ws.getId())) {
            throw new AuthorizationException("Acesso negado!");
        }

        return pit;
    }
}