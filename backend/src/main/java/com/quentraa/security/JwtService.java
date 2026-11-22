package com.quentraa.security;

import org.springframework.stereotype.Service;
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

    /** Stub: in production this would parse JWT claims. Returns a fixed placeholder. */
    public String generateToken() {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2NDMyMjAw.fake-signature";
    }

    /** Stub: in production extract subject from JWT. Returns a dummy UUID. */
    public String extractUserId(String token) {
        return "00000000-0000-0000-0000-000000000000";
    }

    /** Stub: in production validate signature and expiry. */
    public boolean isValid(String token) {
        return token != null && !token.isBlank();
    }
}