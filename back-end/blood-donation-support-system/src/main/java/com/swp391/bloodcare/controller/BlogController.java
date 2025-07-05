package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.BlogDTO;
import com.swp391.bloodcare.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
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

    @GetMapping("/latest")
    public ResponseEntity<List<BlogDTO>> getLatestBlogs() {
        List<BlogDTO> latestBlogs = blogService.getLatestBlogs();
        return ResponseEntity.ok(latestBlogs);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBlog(@Valid @RequestBody BlogDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }
        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(201).body(blogService.createBlogByUserName(dto, accountId));
    }




    @GetMapping("/get_all")
        public ResponseEntity<List<BlogDTO>> getAll() {
            return ResponseEntity.ok(blogService.getAllBlogs());
        }

        @GetMapping("/get_by_id/{id}")
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
