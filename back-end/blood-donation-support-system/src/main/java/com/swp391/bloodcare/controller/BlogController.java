package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.BlogDTO;
import com.swp391.bloodcare.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<BlogDTO>>> getLatestBlogs() {
        List<BlogDTO> latestBlogs = blogService.getLatestBlogs();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy blog mới nhất thành công", latestBlogs));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createBlog(@Valid @RequestBody BlogDTO dto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            fieldError -> fieldError.getField(),
                            DefaultMessageSourceResolvable::getDefaultMessage,
                            (e1, e2) -> e1 // nếu trùng field, giữ lỗi đầu tiên
                    ));
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, errors)
            );
        }

        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        BlogDTO created = blogService.createBlogByUserName(dto, accountId);
        return ResponseEntity.status(201).body(new ApiResponse<>(true, "Tạo blog thành công", created));
    }

    @GetMapping("/getall")
    public ResponseEntity<ApiResponse<List<BlogDTO>>> getAll() {
        List<BlogDTO> allBlogs = blogService.getAllBlogs();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách blog thành công", allBlogs));
    }

    @GetMapping("/getbyid/{id}")
    public ResponseEntity<ApiResponse<BlogDTO>> getById(@PathVariable String id) {
        BlogDTO blog = blogService.getBlogById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy blog thành công", blog));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<BlogDTO>> update(@PathVariable String id, @RequestBody BlogDTO dto) {
        BlogDTO updated = blogService.updateBlog(id, dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật blog thành công", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<BlogDTO>> delete(@PathVariable String id) {
        BlogDTO deleted = blogService.deleteBlog(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "✅ Đã xóa blog thành công", deleted));
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteMultiple(@RequestBody List<String> ids) {
        Map<String, Object> result = blogService.deleteMultipleBlogsSafe(ids);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xử lý xóa danh sách blog", result));
    }
}
