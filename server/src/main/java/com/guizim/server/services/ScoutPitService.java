package com.guizim.server.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.ScoutPit;
import com.guizim.server.models.User;
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

    @Transactional
    public ScoutPit create(ScoutPit obj) {
        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS)) {
            throw new AuthorizationException("Acesso negado!");
        }
        User user = this.userService.findById(userSS.getId());

        obj.setId(null);
        obj.setUser(user);
        return this.scoutPitRepository.save(obj);
    }

    @Transactional
    public ScoutPit update(ScoutPit obj) {
        ScoutPit newObj = findByTeam(obj.getTeam());
        newObj.setDriveTrain(obj.getDriveTrain());
        newObj.setRobotName(obj.getRobotName());
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
        UserSpringSecurity userSS = UserService.authenticated();
        if (userSS == null)
            throw new AuthorizationException("Acesso negado!");

        ScoutPit pit = this.scoutPitRepository.findByTeamAndUser_id(team, userSS.getId())
                .orElseThrow(() -> new ObjectNotFoundException(
                        "ScoutPit não encontrado! Time: " + team + ", Usuário: " + userSS.getId()));
        return pit;
    }

    public ScoutPit findById(Long id) {
        ScoutPit pit = this.scoutPitRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutPit não encontrado! Id: " + id));
        return pit;
    }
}
