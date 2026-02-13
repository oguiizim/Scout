package com.guizim.server.services;

import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.ScoutMatch;
import com.guizim.server.models.User;
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

    @Transactional
    public ScoutMatch create(ScoutMatch obj) {
        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS)) {
            throw new AuthorizationException("Acesso negado!");
        }

        User user = this.userService.findById(userSS.getId());

        obj.setId(null);
        obj.setUser(user); // ✅ salva user_id no scout_match
        return this.scoutMatchRepository.save(obj);
    }

    @Transactional
    public ScoutMatch update(ScoutMatch obj) {
        ScoutMatch newObj = findById(obj.getId());
        newObj.setUser(newObj.getUser());

        newObj.setMatchNumber(obj.getMatchNumber());
        newObj.setTeam(obj.getTeam());
        newObj.setTeleCycles(obj.getTeleCycles());
        newObj.setAutoCycles(obj.getAutoCycles());

        return this.scoutMatchRepository.save(newObj);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        this.scoutMatchRepository.deleteById(id);
    }

    public ScoutMatch findById(Long id) {
        ScoutMatch match = this.scoutMatchRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutMatch não encontrado! Id: " + id));

        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS) || !match.getUser().getId().equals(userSS.getId()))
            throw new AuthorizationException("Acesso negado!");

        return match;
    }

    public List<ScoutMatch> findByTeam(Long team) {
        UserSpringSecurity userSS = UserService.authenticated();
        if (userSS == null)
            throw new AuthorizationException("Acesso negado!");

        return scoutMatchRepository.findAllByTeamAndUser_id(team, userSS.getId());
    }

    public ScoutMatch findByTeamAndMatch(Long team, Long matchNumber) {
        UserSpringSecurity userSS = UserService.authenticated();
        if (userSS == null)
            throw new AuthorizationException("Acesso negado!");

        return scoutMatchRepository
                .findByTeamAndMatchNumberAndUser_id(team, matchNumber, userSS.getId())
                .orElseThrow(() -> new ObjectNotFoundException(
                        "ScoutMatch não encontrado para este usuário."));
    }

    public List<ScoutMatch> findAllByUser_id(Long id) {
        UserSpringSecurity userSS = UserService.authenticated();
        if (userSS == null)
            throw new AuthorizationException("Acesso negado!");

        return scoutMatchRepository
                .findAllByUser_id(userSS.getId());
    }

    public List<ScoutMatch> findAllByMatchNumberAndUser_id(Long match) {
        UserSpringSecurity userSS = UserService.authenticated();
        if (userSS == null)
            throw new AuthorizationException("Acesso negado!");

        return scoutMatchRepository.findAllByMatchNumberAndUser_id(match, userSS.getId());
    }

}
