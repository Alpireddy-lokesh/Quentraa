package com.quentraa.security;

import com.quentraa.model.User;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {

    private final String secret;
    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        return "jwt-token-for-" + user.getId();
    }

    public UUID extractUserId(String token) {
        return UUID.randomUUID();
    }

    public boolean isValid(String token) {
        return token != null && !token.isBlank();
    }
}