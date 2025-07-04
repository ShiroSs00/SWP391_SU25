package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.BloodDTO;
import com.swp391.bloodcare.service.BloodService;
import com.swp391.bloodcare.service.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood")
@CrossOrigin(origins = "*")
public class BloodController {

    @Autowired
    private BloodService bloodService;

    @Autowired
    private ComponentService componentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BloodDTO>>> getAllBlood() {
        try {
            List<BloodDTO> bloodList = bloodService.findAllDTO();
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả máu thành công", bloodList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<BloodDTO>> createBlood(@RequestBody BloodDTO bloodDTO) {
        try{
            BloodDTO createdBlood = bloodService.createBlood(bloodDTO);
            return ResponseEntity.ok(new ApiResponse<>(true, "Tạo blood record thành công", createdBlood));
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }



    @GetMapping("/{bloodCode}")
    public ResponseEntity<ApiResponse<BloodDTO>> getByBloodCode(@PathVariable String bloodCode) {
        try {
            BloodDTO blood = bloodService.findByBloodCodeDTO(bloodCode);
            if (blood != null) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Tìm thấy blood record", blood));
            }
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Không tìm thấy blood record với code: " + bloodCode, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Lỗi khi tìm kiếm: " + e.getMessage(), null));

        }
    }

    @GetMapping("/rare")
    public ResponseEntity<ApiResponse<List<BloodDTO>>> getRareBlood(@RequestParam Boolean isRare) {
        try {
            List<BloodDTO> bloodList = bloodService.findRareBloodDTO(isRare);
            String message = isRare ? "Tìm thấy " + bloodList.size() + " loại máu hiếm"
                    : "Tìm thấy " + bloodList.size() + " loại máu thông thường";
            return ResponseEntity.ok(new ApiResponse<>(true, message,bloodList ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Lỗi khi tìm kiếm: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete/{bloodCode}")
    public ResponseEntity<?> deleteBlood(@PathVariable String bloodCode) {
        try {
            bloodService.deleteBlood(bloodCode);
            return ResponseEntity.ok("Đã xóa blood record: " + bloodCode);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa blood record: " + e.getMessage());
        }
    }
}
