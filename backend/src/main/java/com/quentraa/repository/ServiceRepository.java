package com.quentraa.repository;

import com.quentraa.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ServiceRepository extends JpaRepository<Service, UUID> {
    List<Service> findByDepartmentId(UUID departmentId);
    List<Service> findByDepartmentIdAndActiveTrue(UUID departmentId);
}
