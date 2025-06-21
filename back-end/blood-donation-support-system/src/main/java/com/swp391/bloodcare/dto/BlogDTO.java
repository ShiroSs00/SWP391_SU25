package com.swp391.bloodcare.dto;


import com.swp391.bloodcare.entity.Blog;
import com.swp391.bloodcare.service.AccountService;

import java.util.Date;

public class BlogDTO {
    private String blogId;
    private String content;
    private Date postDate;
    private String conponent;
    private String tagName;
    private String accountId;

    public BlogDTO() {}

    public BlogDTO(String blogId, String content, Date postDate, String conponent, String tagName, String accountId) {
        this.blogId = blogId;
        this.content = content;
        this.postDate = postDate;
        this.conponent = conponent;
        this.tagName = tagName;
        this.accountId = accountId;
    }

    public static BlogDTO toDTO(Blog blog) {
        return new BlogDTO(
                blog.getBlogId(),
                blog.getContent(),
                blog.getPostDate(),
                blog.getConponent(),
                blog.getTagName(),
                blog.getAccount() != null ? blog.getAccount().getAccountId() : null
        );
    }

    public static Blog toEntity(BlogDTO dto) {
        Blog blog = new Blog();
        blog.setBlogId(dto.getBlogId());
        blog.setContent(dto.getContent());
        blog.setPostDate(dto.getPostDate());
        blog.setConponent(dto.getConponent());
        blog.setTagName(dto.getTagName());
        return blog;
    }
    // Getters & Setters

    public String getBlogId() { return blogId; }
    public void setBlogId(String blogId) { this.blogId = blogId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Date getPostDate() { return postDate; }
    public void setPostDate(Date postDate) { this.postDate = postDate; }

    public String getConponent() { return conponent; }
    public void setConponent(String conponent) { this.conponent = conponent; }

    public String getTagName() { return tagName; }
    public void setTagName(String tagName) { this.tagName = tagName; }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    @Override
    public String toString() {
        return "BlogDTO{" +
                "blogId='" + blogId + '\'' +
                ", content='" + content + '\'' +
                ", postDate=" + postDate +
                ", conponent='" + conponent + '\'' +
                ", tagName='" + tagName + '\'' +
                ", accountId='" + accountId + '\'' +
                '}';
    }

}
