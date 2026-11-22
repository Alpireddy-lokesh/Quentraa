package com.quentraa.service;

import com.quentraa.enums.TokenStatus;
import com.quentraa.model.Branch;
import com.quentraa.model.Token;
import com.quentraa.repository.TokenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QueueServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private QueueEventService queueEventService;

    @InjectMocks
    private QueueService queueService;

    private Token waitingToken(UUID branchId) {
        Token token = new Token();
        token.setId(UUID.randomUUID());
        token.setTokenNumber("A-001");
        token.setStatus(TokenStatus.WAITING);
        token.setCreatedAt(Instant.now());
        Branch branch = new Branch();
        branch.setId(branchId);
        token.setBranch(branch);
        return token;
    }

    @Test
    void callNext_shouldReturnEarliestWaitingTokenAndMarkItCalled() {
        // Given
        UUID branchId = UUID.randomUUID();
        Token waiting = waitingToken(branchId);

        when(tokenRepository.findByBranchIdAndStatusOrderByCreatedAtAsc(branchId, TokenStatus.WAITING))
                .thenReturn(List.of(waiting));
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token result = queueService.callNext(branchId);

        // Then
        assertNotNull(result);
        assertEquals(TokenStatus.CALLED, result.getStatus());
        assertNotNull(result.getCalledAt());
        verify(queueEventService).publishTokenUpdate(eq(branchId.toString()), eq(result));
    }

    @Test
    void callNext_whenNoWaitingTokens_shouldReturnNull() {
        // Given
        UUID branchId = UUID.randomUUID();
        when(tokenRepository.findByBranchIdAndStatusOrderByCreatedAtAsc(branchId, TokenStatus.WAITING))
                .thenReturn(List.of());

        // When
        Token result = queueService.callNext(branchId);

        // Then
        assertNull(result);
        verifyNoInteractions(queueEventService);
    }

    @Test
    void startServing_shouldMarkTokenServing() {
        // Given
        UUID branchId = UUID.randomUUID();
        Token token = waitingToken(branchId);
        token.setStatus(TokenStatus.CALLED);
        token.setCalledAt(Instant.now());
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token result = queueService.startServing(token);

        // Then
        assertEquals(TokenStatus.SERVING, result.getStatus());
        assertNotNull(result.getServingAt());
        verify(queueEventService).publishTokenUpdate(eq(branchId.toString()), eq(result));
    }

    @Test
    void complete_shouldMarkTokenCompleted() {
        // Given
        UUID branchId = UUID.randomUUID();
        Token token = waitingToken(branchId);
        token.setStatus(TokenStatus.SERVING);
        token.setServingAt(Instant.now());
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token result = queueService.complete(token);

        // Then
        assertEquals(TokenStatus.COMPLETED, result.getStatus());
        assertNotNull(result.getCompletedAt());
        verify(queueEventService).publishTokenUpdate(eq(branchId.toString()), eq(result));
    }

    @Test
    void skip_shouldMarkTokenSkipped() {
        // Given
        UUID branchId = UUID.randomUUID();
        Token token = waitingToken(branchId);
        token.setStatus(TokenStatus.WAITING);
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token result = queueService.skip(token);

        // Then
        assertEquals(TokenStatus.SKIPPED, result.getStatus());
        verify(queueEventService).publishTokenUpdate(eq(branchId.toString()), eq(result));
    }

    @Test
    void cancel_shouldMarkTokenCancelled() {
        // Given
        UUID branchId = UUID.randomUUID();
        Token token = waitingToken(branchId);
        token.setStatus(TokenStatus.CALLED);
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token result = queueService.cancel(token);

        // Then
        assertEquals(TokenStatus.CANCELLED, result.getStatus());
        verify(queueEventService).publishTokenUpdate(eq(branchId.toString()), eq(result));
    }

    @Test
    void recall_shouldReturnTokenToWaiting() {
        // Given
        UUID branchId = UUID.randomUUID();
        Token token = waitingToken(branchId);
        token.setStatus(TokenStatus.SERVING);
        token.setCalledAt(Instant.now());
        token.setServingAt(Instant.now());
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token result = queueService.recall(token);

        // Then
        assertEquals(TokenStatus.WAITING, result.getStatus());
        assertNull(result.getCalledAt());
        assertNull(result.getServingAt());
        verify(queueEventService).publishTokenUpdate(eq(branchId.toString()), eq(result));
    }

    @Test
    void countWaiting_shouldReturnCountFromRepository() {
        // Given
        UUID branchId = UUID.randomUUID();
        when(tokenRepository.countWaiting(branchId)).thenReturn(5L);

        // When
        long count = queueService.countWaiting(branchId);

        // Then
        assertEquals(5L, count);
    }
}
