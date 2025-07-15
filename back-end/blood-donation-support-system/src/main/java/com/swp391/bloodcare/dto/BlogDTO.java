package com.swp391.bloodcare.dto;


import com.swp391.bloodcare.entity.Blog;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogDTO {
    private String blogId;

    @NotBlank(message = "Nội dung blog không được để trống")
    @Size(min = 20, message = "Nội dung blog phải ít nhất 20 ký tự")
    private String content;

    private Date postDate;

    @Size(max = 100, message = "Tag không được vượt quá 100 ký tự")
    private String tagName;

    private String img;

    private String accountId;

    private MultipartFile thumbnail;

    public static BlogDTO toDTO(Blog blog) {
        return BlogDTO.builder()
                .blogId(blog.getBlogId())
                .content(blog.getContent())
                .postDate(blog.getPostDate())
                .tagName(blog.getTagName())
                .img(blog.getImg())
                .accountId(blog.getAccount() != null ? blog.getAccount().getAccountId() : null)
                .build();
    }

    public static Blog toEntity(BlogDTO dto) {
        Blog blog = new Blog();
        blog.setBlogId(dto.getBlogId());
        blog.setContent(dto.getContent());
        blog.setPostDate(dto.getPostDate());
        blog.setTagName(dto.getTagName());
        blog.setImg(dto.getImg());
        return blog;
    }


}
