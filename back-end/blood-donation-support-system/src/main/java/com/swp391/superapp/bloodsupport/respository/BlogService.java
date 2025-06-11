package com.swp391.superapp.bloodsupport.respository;

import com.swp391.superapp.bloodsupport.entity.Blog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BlogService {
    @Autowired
    private BlogService blogService;
    public Blog createBlog(Blog blog) {
        return blogService.createBlog(blog);
    }
    public Blog updateBlog(Blog blog) {
        return blogService.updateBlog(blog);
    }
    public Blog deleteBlog(Blog blog) {
        return blogService.deleteBlog(blog);
    }
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }
    public Blog getBlogByName(String name) {
        return blogService.getBlogByName(name);
    }

}
