package com.swp391.bloodcare.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Map<String, String> errors;

    // Constructor không có errors (mặc định null)
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = null;
    }

    // Constructor có lỗi, dùng khi validation fail (data có thể là null)
    public ApiResponse(boolean success, String message, T data, Map<String, String> errors) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }


}
