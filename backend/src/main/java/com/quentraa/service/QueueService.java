package com.quentraa.service;

import com.quentraa.enums.TokenStatus;
import com.quentraa.model.Token;
import com.quentraa.repository.TokenRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Queue engine: state transitions, call next, complete, skip, recall. */
@Service
public class QueueService {

    @PersistenceContext
    private EntityManager entityManager;

    private final TokenRepository tokenRepository;

    public QueueService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /** Call the next waiting token for a service. Returns null if none. */
    @Transactional
    public Token callNext(UUID branchId, UUID serviceId) {
        List<Token> waiting = tokenRepository.findByBranchIdAndStatusOrderByCreatedAtAsc(
                branchId, TokenStatus.WAITING);
        if (waiting.isEmpty()) {
            return null;
        }
        Token token = waiting.get(0);
        token.setStatus(TokenStatus.CALLED);
        token.setCalledAt(Instant.now());
        return tokenRepository.save(token);
    }

    /** Mark token as SERVING. */
    @Transactional
    public Token startServing(Token token) {
        token.setStatus(TokenStatus.SERVING);
        token.setServingAt(Instant.now());
        return tokenRepository.save(token);
    }

    /** Mark token as COMPLETED. */
    @Transactional
    public Token complete(Token token) {
        token.setStatus(TokenStatus.COMPLETED);
        token.setCompletedAt(Instant.now());
        return tokenRepository.save(token);
    }

    /** Mark token as SKIPPED. */
    @Transactional
    public Token skip(Token token) {
        token.setStatus(TokenStatus.SKIPPED);
        return tokenRepository.save(token);
    }

    /** Mark token as CANCELLED. */
    @Transactional
    public Token cancel(Token token) {
        token.setStatus(TokenStatus.CANCELLED);
        return tokenRepository.save(token);
    }

    /** Recall a previously called/serving token back to WAITING. */
    @Transactional
    public Token recall(Token token) {
        token.setStatus(TokenStatus.WAITING);
        token.setCalledAt(null);
        token.setServingAt(null);
        return tokenRepository.save(token);
    }

    /** Count waiting tokens for a branch. */
    public long countWaiting(UUID branchId) {
        return tokenRepository.countWaiting(branchId);
    }
}