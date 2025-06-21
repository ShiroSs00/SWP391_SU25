package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.BlogDTO;
import com.swp391.bloodcare.entity.Blog;
import com.swp391.bloodcare.repository.BlogRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final AccountService accountService;

    public BlogService(BlogRepository blogRepository, AccountService accountService) {
        this.blogRepository = blogRepository;
        this.accountService = accountService;
    }


    public BlogDTO getBlogById(String blogId) {
        Blog blog = blogRepository.findBlogByBlogId(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog với ID: " + blogId));
        return BlogDTO.toDTO(blog);
    }

    public List<BlogDTO> getAllBlogs() {
        return blogRepository.findAll().stream()
                .map(BlogDTO::toDTO)
                .toList();
    }

    public BlogDTO updateBlog(String blogId, BlogDTO dto) {
        Blog blog = blogRepository.findBlogByBlogId(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog để cập nhật"));

        if (dto.getContent() != null && !dto.getContent().isBlank())
            blog.setContent(dto.getContent());

        if (dto.getConponent() != null && !dto.getConponent().isBlank())
            blog.setConponent(dto.getConponent());

        if (dto.getTagName() != null)
            blog.setTagName(dto.getTagName());

        blog.setPostDate(new Date());
        return BlogDTO.toDTO(blogRepository.save(blog));
    }

    public BlogDTO deleteBlog(String blogId) {
        Blog blog = blogRepository.findBlogByBlogId(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Blog để xoá"));
        blogRepository.delete(blog);
        return BlogDTO.toDTO(blog);
    }

    public BlogDTO createBlogByUserName(BlogDTO dto, String userName) {
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new IllegalArgumentException("Nội dung blog không được để trống");
        }
        if (dto.getConponent() == null || dto.getConponent().isBlank()) {
            throw new IllegalArgumentException("Tên component không được để trống");
        }

        Blog blog = BlogDTO.toEntity(dto);
        blog.setBlogId(generateUniqueBlogId());
        blog.setPostDate(new Date());

        blog.setAccount(accountService.findAccountByUserName(userName));

        return BlogDTO.toDTO(blogRepository.save(blog));
    }


    private String generateUniqueBlogId() {
        String blogId;
        do {
            String time = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            int random = new Random().nextInt(900) + 100;
            blogId = "BL-" + time + "-" + random;
        } while (blogRepository.existsBlogsByBlogId(blogId));
        return blogId;
    }

    @Transactional
    public Map<String, Object> deleteMultipleBlogsSafe(List<String> ids) {
        List<String> deleted = new ArrayList<>();
        Map<String, String> errors = new HashMap<>();

        for (String id : ids) {
            try {
                Blog blog = blogRepository.findBlogByBlogId(id)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy blog với ID: " + id));
                blogRepository.delete(blog);
                deleted.add(id);
            } catch (EntityNotFoundException e) {
                errors.put(id, "Không tìm thấy blog");
            } catch (Exception e) {
                errors.put(id, "Lỗi không xác định: " + e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deleted", deleted);
        result.put("errors", errors);
        return result;
    }





}
