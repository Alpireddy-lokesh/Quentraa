package com.quentraa.repository;

import com.quentraa.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    List<Department> findByBranchId(UUID branchId);
    List<Department> findByBranchIdAndActiveTrue(UUID branchId);
}
