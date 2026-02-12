package com.guizim.server.services;

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

    public ScoutMatch findById(Long id) {
        ScoutMatch match = this.scoutMatchRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutMatch não encontrado! Id: " + id));

        UserSpringSecurity userSS = UserService.authenticated();
        if (Objects.isNull(userSS) || !match.getUser().getId().equals(userSS.getId())) {
            throw new AuthorizationException("Acesso negado!");
        }

        return match;
    }
}
