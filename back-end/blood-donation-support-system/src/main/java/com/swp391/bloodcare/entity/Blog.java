package com.swp391.bloodcare.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Blog {
    @Column(name = "blog_id")
    @Id
    private String blogId;
    @Column(name = "content",nullable = false)
    private String content;
    @Column(name = "post_date",nullable = false)
    private Date postDate;
    @Column(name = "conponent",nullable = false)
    private String conponent;
    @Column(name = "tag_name")
    private String tagName;
    @ManyToOne()
    @JoinColumn(name = "account_id")
    private Account account;


    public Blog() {
    }

    public Blog(String content, Date postDate, String conponent, String tagName) {
        this.content = content;
        this.postDate = postDate;
        this.conponent = conponent;
        this.tagName = tagName;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getBlogId() {
        return blogId;
    }

    public void setBlogId(String blogId) {
        this.blogId = blogId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
    }

    public String getConponent() {
        return conponent;
    }

    public void setConponent(String conponent) {
        this.conponent = conponent;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    @Override
    public String toString() {
        return "Blog{" +
                "blogId=" + blogId +
                ", content='" + content + '\'' +
                ", postDate=" + postDate +
                ", conponent='" + conponent + '\'' +
                ", tagName='" + tagName + '\'' +
                '}';
    }
}
