package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.WaitingList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WaitingListRepository extends JpaRepository<WaitingList, Long>{
    Optional<WaitingList> findByWaitListId(String waitListId);
}
