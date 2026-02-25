package com.guizim.server.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.guizim.server.models.ScoutPit;
import com.guizim.server.services.ScoutPitService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/scoutpit")
@Validated
public class ScoutPitController {
    @Autowired
    private ScoutPitService scoutPitService;

    // CREATE
    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ScoutPit obj) {
        this.scoutPitService.create(obj);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{team}")
                .buildAndExpand(obj.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ScoutPit> findById(@PathVariable Long id) {
        ScoutPit obj = this.scoutPitService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    // READ BY TEAM (principal endpoint do Pit)
    @GetMapping("/team/{teamNumber}")
    public ResponseEntity<ScoutPit> findByTeam(@PathVariable Long teamNumber) {
        ScoutPit obj = this.scoutPitService.findByTeam(teamNumber);
        return ResponseEntity.ok().body(obj);
    }

    // UPDATE
    @PutMapping("/{team}")
    public ResponseEntity<Void> update(@Valid @RequestBody ScoutPit obj, @PathVariable Long team) {
        obj.setTeam(team);
        this.scoutPitService.update(obj);
        return ResponseEntity.noContent().build();
    }

    // DELETE
    @DeleteMapping("/{team}")
    public ResponseEntity<Void> delete(@PathVariable Long team) {
        this.scoutPitService.delete(team);
        return ResponseEntity.noContent().build();
    }

}
