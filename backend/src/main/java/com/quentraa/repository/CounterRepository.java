package com.quentraa.repository;

import com.quentraa.model.Counter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CounterRepository extends JpaRepository<Counter, UUID> {
    List<Counter> findByBranchId(UUID branchId);
    List<Counter> findByBranchIdAndActiveTrue(UUID branchId);
    List<Counter> findByServiceId(UUID serviceId);
}
