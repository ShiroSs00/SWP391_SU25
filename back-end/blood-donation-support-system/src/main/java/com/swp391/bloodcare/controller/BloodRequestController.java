package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import com.swp391.bloodcare.entity.BloodRequest;
import com.swp391.bloodcare.entity.Profile;
import com.swp391.bloodcare.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    //tạo đơn xin máu
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<BloodRequestResponseDTO>> createdBloodRequest(@Valid @RequestBody BloodRequestDTO dto, Authentication authentication) {
        try{
            String account = authentication.getName();
            BloodRequest createdRequest = bloodRequestService.createBloodRequest(dto, account);
            BloodRequestResponseDTO responseDTo = bloodRequestService.convertToResponseDTO(createdRequest);

            return ResponseEntity.ok(new ApiResponse<>(true,
                    "Tạo đơn xin máu thành công",
                    responseDTo));
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false,e.getMessage(),null
            ));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false,
                    "Có lỗi xảy ra khi tạo đơn xin máu: " + e.getMessage()
                    ,null
            ));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BloodRequestResponseDTO>>> getAllRequests() {
        List<BloodRequestResponseDTO> requests = bloodRequestService.getAllBloodRequests();
        return ResponseEntity.ok(new ApiResponse<>(true, "Danh sách đơn xin máu", requests));
    }

    // Lấy danh sách đơn của user hiện tại
    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<BloodRequestResponseDTO>>> getMyRequests(Authentication authentication) {
        try{

            String account = authentication.getName();
            List<BloodRequestResponseDTO> requests = bloodRequestService.getBloodRequestsByAccount(account);

            return ResponseEntity.ok(new ApiResponse<>(
                    true,"Lấy danh sách đơn thành công",
                    requests
            ));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false,
                    "Có lỗi xảy ra khi lấy danh sách đơn: " + e.getMessage(),
                    null
            ));
        }
    }

    // Lấy chi tiết đơn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BloodRequestResponseDTO>> getBloodRequestById(@PathVariable String id) {
        try {
            BloodRequestResponseDTO request = bloodRequestService.getBloodRequestById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu"));

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Lấy thông tin đơn thành công",
                    request
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(
                    false,
                    e.getMessage(),
                    null
            ));
        }
    }

    // Cập nhật trạng thái
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String,String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            BloodRequestResponseDTO responseDTO = bloodRequestService.updateStatus(id, newStatus);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật trạng thái thành công",
                    "data", responseDTO
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
    //Lấy danh sách đơn Emergency
    @GetMapping("/emergency")
    public ResponseEntity<?> getEmergencyRequests() {
        try {
            List<BloodRequestResponseDTO> emergencyRequests = bloodRequestService.getEmergencyRequests();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", emergencyRequests
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/match-top20/{id}")
    public ResponseEntity<List<Profile>> matchTop20Donors(@PathVariable String id) {
        BloodRequest request = bloodRequestService.getByIdRaw(id);
        return ResponseEntity.ok(bloodRequestService.matchTop20Donors(request));
    }

    @PostMapping("/send-mail/{id}")
    public ResponseEntity<String> sendUrgentMail(@PathVariable String id) {
        BloodRequest request = bloodRequestService.getByIdRaw(id);
        bloodRequestService.sendUrgentDonationRequest(request);
        return ResponseEntity.ok("Đã gửi mail cho 20 người phù hợp nhất.");
    }
}
