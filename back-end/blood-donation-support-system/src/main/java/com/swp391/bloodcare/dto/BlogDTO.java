package com.swp391.bloodcare.dto;


import com.swp391.bloodcare.entity.Blog;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "image")
    @Pattern(
            regexp = "^(http|https)://.*\\.(jpg|jpeg|png|gif)$",
            message = "Ảnh phải là link hợp lệ và kết thúc bằng .jpg, .jpeg, .png hoặc .gif"
    )
    private String img;

    private String accountId;

    public static BlogDTO toDTO(Blog blog) {
        return new BlogDTO(
                blog.getBlogId(),
                blog.getContent(),
                blog.getPostDate(),
                blog.getTagName(),
                blog.getImg(),
                blog.getAccount() != null ? blog.getAccount().getAccountId() : null
        );
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
