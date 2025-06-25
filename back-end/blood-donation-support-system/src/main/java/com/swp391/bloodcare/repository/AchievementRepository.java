package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {
    Optional<Achievement> findByAchievementNameContainingIgnoreCase(String keyword);

}
