package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BlogDTO;
import com.swp391.bloodcare.service.BlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")

public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping("/create")
    public ResponseEntity<BlogDTO> createBlog(@RequestBody BlogDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        BlogDTO blog =  blogService.createBlogByUserName( dto, username);
        return ResponseEntity.status(201).body(blog);
    }



    @GetMapping("/getall")
        public ResponseEntity<List<BlogDTO>> getAll() {
            return ResponseEntity.ok(blogService.getAllBlogs());
        }

        @GetMapping("/getbyid/{id}")
        public ResponseEntity<BlogDTO> getById(@PathVariable String id) {
            return ResponseEntity.ok(blogService.getBlogById(id));
        }

        @PutMapping("/update/{id}")
        public ResponseEntity<BlogDTO> update(@PathVariable String id, @RequestBody BlogDTO dto) {
            return ResponseEntity.ok(blogService.updateBlog(id, dto));
        }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        BlogDTO deleted = blogService.deleteBlog(id);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "✅ Đã xóa blog thành công",
                "data", deleted
        ));
    }


    @DeleteMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultiple(@RequestBody List<String> ids) {
        Map<String, Object> result = blogService.deleteMultipleBlogsSafe(ids);
        return ResponseEntity.ok(Map.of(
                "status", "partial-success",
                "message", "Đã xử lý xóa danh sách blog",
                "data", result
        ));
    }
}
