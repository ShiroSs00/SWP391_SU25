package com.swp391.bloodcare.repository;
import com.swp391.bloodcare.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    Optional<Blog> findBlogByBlogId(String blogId);

    boolean existsBlogsByBlogId(String blogId);
}
