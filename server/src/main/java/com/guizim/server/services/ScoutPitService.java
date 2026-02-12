package com.guizim.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.guizim.server.models.ScoutPit;
import com.guizim.server.repositorys.ScoutPitRepository;
import com.guizim.server.services.exceptions.ObjectNotFoundException;

@Service
public class ScoutPitService {

    @Autowired
    private ScoutPitRepository scoutPitRepository;

    @Transactional
    public ScoutPit create(ScoutPit obj) {
        obj.setId(null);
        return this.scoutPitRepository.save(obj);
    }

    public ScoutPit findByTeam(Long team) {
        ScoutPit pit = this.scoutPitRepository.findByTeam(team)
                .orElseThrow(() -> new ObjectNotFoundException("ScoutPit não encontrado! Time: " + team));
        return pit;
    }
}
