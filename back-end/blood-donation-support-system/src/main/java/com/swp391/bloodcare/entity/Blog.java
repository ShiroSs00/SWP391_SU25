package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "blog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "account")
public class Blog {

    @Id
    @Column(name = "blog_id")
    private String blogId;

    @Column(name = "content", nullable = false)
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "post_date", nullable = false)
    private Date postDate;

    @Column(name = "tag_name")
    private String tagName;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
}
