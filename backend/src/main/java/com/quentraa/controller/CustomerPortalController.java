package com.quentraa.controller;

import com.quentraa.model.Token;
import com.quentraa.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
public class CustomerPortalController {

    private final TokenService tokenService;

    public CustomerPortalController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    /** Customer joins a queue. */
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
}