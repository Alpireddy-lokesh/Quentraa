package com.quentraa.repository;

import com.quentraa.enums.TokenStatus;
import com.quentraa.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TokenRepository extends JpaRepository<Token, UUID> {

    List<Token> findByBranchIdAndStatus(UUID branchId, TokenStatus status);

    List<Token> findByServiceIdAndStatus(UUID serviceId, TokenStatus status);

    Optional<Token> findByBranchIdAndTokenNumber(UUID branchId, String tokenNumber);

    /** Pessimistic lock for safe "call next" operations. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Token t where t.id = :id")
    Optional<Token> findByIdForUpdate(@Param("id") UUID id);

    /** Count waiting tokens ahead of a given token (by creation time) for position calc. */
    @Query("select count(t) from Token t where t.service.id = :serviceId and t.status = 'WAITING' and t.createdAt < :createdAt")
    long countWaitingAhead(@Param("serviceId") UUID serviceId, @Param("createdAt") java.time.Instant createdAt);
}
