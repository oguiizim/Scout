package com.guizim.server.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

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

import com.guizim.server.models.ScoutMatch;
import com.guizim.server.services.ScoutMatchService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/scoutmatch")
@Validated
public class ScoutMatchController {
    @Autowired
    private ScoutMatchService scoutMatchService;

    // CREATE
    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ScoutMatch obj) {
        this.scoutMatchService.create(obj);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(obj.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ScoutMatch> findById(@PathVariable Long id) {
        ScoutMatch obj = this.scoutMatchService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    // READ ALL BY USER_ID
    @GetMapping("/userid/{user_id}")
    public ResponseEntity<List<ScoutMatch>> findByUser_id(@PathVariable Long user_id) {
        List<ScoutMatch> obj = this.scoutMatchService.findAllByUser_id(user_id);
        return ResponseEntity.ok().body(obj);
    }

    // READ ALL BY TEAMNUMBER
    @GetMapping("/team/{team}")
    public ResponseEntity<List<ScoutMatch>> findByTeam(@PathVariable Long team) {
        List<ScoutMatch> obj = this.scoutMatchService.findByTeam(team);
        return ResponseEntity.ok().body(obj);
    }

    // READ ALL BY MATCHNUMBER
    @GetMapping("/match/{matchNumber}")
    public ResponseEntity<List<ScoutMatch>> findByMatch(@PathVariable Long matchNumber) {
        List<ScoutMatch> obj = this.scoutMatchService.findAllByMatchNumberAndUser_id(matchNumber);
        return ResponseEntity.ok().body(obj);
    }

    // READ ALL BY TEAMNUMBER AND MATCH
    @GetMapping("/team/{team}/{matchNumber}")
    public ResponseEntity<ScoutMatch> findByTeamAndMatch(
            @PathVariable Long team,
            @PathVariable Long matchNumber) {

        ScoutMatch obj = this.scoutMatchService.findByTeamAndMatch(team, matchNumber);
        return ResponseEntity.ok().body(obj);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@Valid @RequestBody ScoutMatch obj, @PathVariable Long id) {
        obj.setId(id);
        this.scoutMatchService.update(obj);
        return ResponseEntity.noContent().build();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.scoutMatchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
