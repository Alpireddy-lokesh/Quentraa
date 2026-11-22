package com.quentraa.controller;

import com.quentraa.model.Token;
import com.quentraa.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/receptionist")
public class ReceptionistController {

    private final TokenService tokenService;

    public ReceptionistController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    /** Receptionist registers a visitor and gets a token. */
    @PostMapping("/register")
    public ResponseEntity<Token> registerVisitor(
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
}