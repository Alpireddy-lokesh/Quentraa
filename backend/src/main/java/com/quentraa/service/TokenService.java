package com.quentraa.service;

import com.quentraa.enums.TokenStatus;
import com.quentraa.model.Branch;
import com.quentraa.model.Token;
import com.quentraa.repository.TokenRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/** Transactional: generates a unique token number and creates a WAITING token. */
@Service
public class TokenService {

    @PersistenceContext
    private EntityManager entityManager;

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Transactional
    public Token createToken(UUID branchId, UUID serviceId, String visitorName, String visitorPhone) {
        com.quentraa.model.Branch branch = entityManager.getReference(com.quentraa.model.Branch.class, branchId);
        com.quentraa.model.Service service = entityManager.getReference(com.quentraa.model.Service.class, serviceId);

        String tokenNumber = generateTokenNumber(branch, service);

        Token token = new Token();
        token.setBranch(branch);
        token.setService(service);
        token.setTokenNumber(tokenNumber);
        token.setStatus(TokenStatus.WAITING);
        token.setVisitorName(visitorName);
        token.setVisitorPhone(visitorPhone);
        token.setCreatedAt(Instant.now());

        return tokenRepository.save(token);
    }

    private String generateTokenNumber(com.quentraa.model.Branch branch, com.quentraa.model.Service service) {
        String branchInit = branch.getName() != null ? branch.getName().substring(0, Math.min(3, branch.getName().length())).toUpperCase() : "BRN";
        String serviceInit = service.getName() != null ? service.getName().substring(0, Math.min(3, service.getName().length())).toUpperCase() : "SVR";
        return branchInit + "-" + serviceInit + "-" + String.format("%03d", (int) (Math.random() * 900) + 100);
    }
}