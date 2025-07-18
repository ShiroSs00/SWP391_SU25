package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.BlogDTO;
import com.swp391.bloodcare.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<?>> createBlog(
            @ModelAttribute @Valid BlogDTO dto,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            field -> Optional.ofNullable(field.getDefaultMessage()).orElse("Lỗi không xác định"),
                            (e1, e2) -> e1
                    ));
            String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
            dto.setBlogId(accountId);

            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Dữ liệu không hợp lệ", null, errors)
            );
        }

        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        BlogDTO created = blogService.createBlogByUserName(dto, accountId, thumbnail);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(true, "Tạo blog thành công", created));
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
