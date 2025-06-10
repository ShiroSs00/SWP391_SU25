package com.swp391.superapp.bloodsupport.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Blog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int blogId;
    @Column(name = "content",nullable = false)
    private String content;
    @Column(name = "postDate",nullable = false)
    private Date postDate;
    @Column(name = "conponent",nullable = false)
    private String conponent;
    @Column(name = "tagName")
    private String tagName;
    @ManyToOne()
    @JoinColumn(name = "AccountId")
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

    public int getBlogId() {
        return blogId;
    }

    public void setBlogId(int blogId) {
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
