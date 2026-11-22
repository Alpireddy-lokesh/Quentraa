package com.quentraa.controller;

import com.quentraa.model.Token;
import com.quentraa.service.QueueService;
import com.quentraa.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {

    private final TokenService tokenService;
    private final QueueService queueService;

    public TokenController(TokenService tokenService, QueueService queueService) {
        this.tokenService = tokenService;
        this.queueService = queueService;
    }

    /** Customer joins a queue (registers a visitor). */
    @PostMapping("/join")
    public ResponseEntity<Token> joinQueue(
            @RequestParam String branchId,
            @RequestParam String serviceId,
            @RequestParam String visitorName,
            @RequestParam String visitorPhone) {

        Token token = tokenService.createToken(
                UUID.fromString(branchId),
                UUID.fromString(serviceId),
                visitorName,
                visitorPhone
        );

        return ResponseEntity.ok(token);
    }

    /** Receptionist calls the next token for a branch. */
    @PostMapping("/{branchId}/call-next")
    public ResponseEntity<Token> callNext(@PathVariable String branchId) {
        Token token = queueService.callNext(UUID.fromString(branchId));
        if (token == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(token);
    }

    /** Counter marks token as serving. */
    @PostMapping("/{tokenId}/start-serving")
    public ResponseEntity<Token> startServing(@PathVariable String tokenId) {
        return ResponseEntity.status(501).build();
    }

    /** Counter marks token as completed. */
    @PostMapping("/{tokenId}/complete")
    public ResponseEntity<Token> complete(@PathVariable String tokenId) {
        return ResponseEntity.status(501).build();
    }

    /** Counter marks token as skipped. */
    @PostMapping("/{tokenId}/skip")
    public ResponseEntity<Token> skip(@PathVariable String tokenId) {
        return ResponseEntity.status(501).build();
    }
}