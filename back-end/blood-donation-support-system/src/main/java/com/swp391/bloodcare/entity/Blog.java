package com.swp391.bloodcare.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "ID bài viết không được để trống")
    private String blogId;

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(min = 5, max = 150, message = "Tiêu đề phải từ 5 đến 150 ký tự")
    private String title;


    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Nội dung không được để trống")
    @Size(min = 20, message = "Nội dung phải có ít nhất 20 ký tự")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "post_date", nullable = false)
    @NotNull(message = "Ngày đăng không được để null")
    private Date postDate;

    @Column(name = "tag_name")
    @Size(max = 100, message = "Tag tối đa 100 ký tự")
    private String tagName;


    @Column(name = "image")
    @Pattern(
            regexp = "^(/images/blog-thumbnails/.*\\.(jpg|jpeg|png|gif)|https?://.*)$",
            message = "Ảnh phải là link hợp lệ và kết thúc bằng .jpg, .jpeg, .png hoặc .gif"
    )
    private String img;




    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @NotNull(message = "Bài viết phải gắn với người đăng")
    private Account account;
}

