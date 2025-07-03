package com.swp391.bloodcare.dto;


import com.swp391.bloodcare.entity.Blog;
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
    private String content;
    private Date postDate;
    private String tagName;
    private String accountId;

    public static BlogDTO toDTO(Blog blog) {
        return new BlogDTO(
                blog.getBlogId(),
                blog.getContent(),
                blog.getPostDate(),
                blog.getTagName(),
                blog.getAccount() != null ? blog.getAccount().getAccountId() : null
        );
    }

    public static Blog toEntity(BlogDTO dto) {
        Blog blog = new Blog();
        blog.setBlogId(dto.getBlogId());
        blog.setContent(dto.getContent());
        blog.setPostDate(dto.getPostDate());
        blog.setTagName(dto.getTagName());
        return blog;
    }

}
