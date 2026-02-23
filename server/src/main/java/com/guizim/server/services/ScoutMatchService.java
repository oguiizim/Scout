package com.guizim.server.services;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.ScoutMatch;
import com.guizim.server.models.User;
import com.guizim.server.models.Workspace;
import com.guizim.server.repositorys.ScoutMatchRepository;
import com.guizim.server.security.UserSpringSecurity;
import com.guizim.server.services.exceptions.AuthorizationException;
import com.guizim.server.services.exceptions.ObjectNotFoundException;

@Service
public class ScoutMatchService {

    @Autowired
    private ScoutMatchRepository scoutMatchRepository;

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
    public ScoutMatch create(ScoutMatch obj) {
        User user = loggedUser();
        Workspace ws = activeWorkspace();

        obj.setId(null);
        obj.setUser(user); // mantém auditoria (criador)
        obj.setWorkspace(ws); // visibilidade/compartilhamento
        return this.scoutMatchRepository.save(obj);
    }

    @Transactional
    public ScoutMatch update(ScoutMatch obj) {
        ScoutMatch newObj = findById(obj.getId());

        // não deixa mudar user/workspace aqui
        newObj.setMatchNumber(obj.getMatchNumber());
        newObj.setTeam(obj.getTeam());
        newObj.setTeleCycles(obj.getTeleCycles());
        newObj.setAutoCycles(obj.getAutoCycles());
        newObj.setPosition(obj.getPosition());
        newObj.setAreBroke(obj.getAreBroke());
        newObj.setAutoWork(obj.getAutoWork());
        newObj.setTowerEnd(obj.getTowerEnd());
        newObj.setTowerAuto(obj.getTowerAuto());
        newObj.setNotes(obj.getNotes());

        return this.scoutMatchRepository.save(newObj);
    }

    @Transactional
    public void delete(Long id) {
        ScoutMatch m = findById(id);
        this.scoutMatchRepository.deleteById(m.getId());
    }

    public ScoutMatch findById(Long id) {
        loggedUser(); // garante que tá logado
        Workspace ws = activeWorkspace();

        ScoutMatch match = this.scoutMatchRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutMatch não encontrado! Id: " + id));

        // Regra simples (não quebra nada): só acessa se está no workspace ativo
        if (!match.getWorkspace().getId().equals(ws.getId())) {
            throw new AuthorizationException("Acesso negado!");
        }

        return match;
    }

    public List<ScoutMatch> findByTeam(Long team) {
        loggedUser();
        Workspace ws = activeWorkspace();
        return scoutMatchRepository.findAllByWorkspace_IdAndTeam(ws.getId(), team);
    }

    public ScoutMatch findByTeamAndMatch(Long team, Long matchNumber) {
        loggedUser();
        Workspace ws = activeWorkspace();

        return scoutMatchRepository
                .findByWorkspace_IdAndTeamAndMatchNumber(ws.getId(), team, matchNumber)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutMatch não encontrado neste workspace."));
    }

    public List<ScoutMatch> findAllFromLoggedUser() {
        loggedUser();
        Workspace ws = activeWorkspace();
        return scoutMatchRepository.findAllByWorkspace_Id(ws.getId());
    }

    public List<ScoutMatch> findAllFromLoggedUserByTeam(Long teamNumber) {
        loggedUser();
        Workspace ws = activeWorkspace();
        return scoutMatchRepository.findAllByWorkspace_IdAndTeam(ws.getId(), teamNumber);
    }

    public List<ScoutMatch> findAllByMatchNumber(Long matchNumber) {
        loggedUser();
        Workspace ws = activeWorkspace();
        return scoutMatchRepository.findAllByWorkspace_IdAndMatchNumber(ws.getId(), matchNumber);
    }
}