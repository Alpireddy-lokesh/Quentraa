package com.quentraa.service;

import com.quentraa.enums.TokenStatus;
import com.quentraa.model.Branch;
import com.quentraa.model.Service;
import com.quentraa.model.Token;
import com.quentraa.repository.TokenRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private TokenService tokenService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        // EntityManager is @PersistenceContext (field-injected); @InjectMocks won't set it.
        ReflectionTestUtils.setField(tokenService, "entityManager", entityManager);
    }

    @Test
    void createToken_shouldGenerateUniqueTokenNumberAndSaveWaitingToken() {
        // Given
        UUID branchId = UUID.randomUUID();
        UUID serviceId = UUID.randomUUID();
        Branch branch = new Branch();
        branch.setId(branchId);
        branch.setName("Main Branch");
        Service service = new Service();
        service.setId(serviceId);
        service.setName("General Service");

        when(entityManager.getReference(Branch.class, branchId)).thenReturn(branch);
        when(entityManager.getReference(Service.class, serviceId)).thenReturn(service);
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> {
            Token t = inv.getArgument(0);
            t.setId(UUID.randomUUID());
            t.setCreatedAt(Instant.now());
            return t;
        });

        // When
        Token token = tokenService.createToken(branchId, serviceId, "John Doe", "+1-555-000-0000");

        // Then
        assertNotNull(token);
        assertEquals(TokenStatus.WAITING, token.getStatus());
        assertEquals(branch, token.getBranch());
        assertEquals(service, token.getService());
        assertEquals("John Doe", token.getVisitorName());
        assertNotNull(token.getTokenNumber());
        assertTrue(token.getTokenNumber().matches("MAI-GEN-\\d{3}"),
                "Token number format invalid: " + token.getTokenNumber());
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void createToken_withShortBranchName_shouldStillGenerateValidTokenNumber() {
        // Given
        UUID branchId = UUID.randomUUID();
        UUID serviceId = UUID.randomUUID();
        Branch branch = new Branch();
        branch.setId(branchId);
        branch.setName("IT"); // only 2 chars
        Service service = new Service();
        service.setId(serviceId);
        service.setName("Consulting");

        when(entityManager.getReference(Branch.class, branchId)).thenReturn(branch);
        when(entityManager.getReference(Service.class, serviceId)).thenReturn(service);
        when(tokenRepository.save(any(Token.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Token token = tokenService.createToken(branchId, serviceId, "Alice", "+1-555-000-0000");

        // Then
        assertNotNull(token.getTokenNumber());
        assertTrue(token.getTokenNumber().startsWith("IT-"));
    }
}
