package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import com.swp391.bloodcare.entity.BloodRequest;
import com.swp391.bloodcare.service.BloodRequestService;
import jakarta.persistence.EntityNotFoundException;
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
    @GetMapping("/confirm")
    public ResponseEntity<String> confirmDonation(@RequestParam String token) {
        bloodRequestService.confirmDonation(token);
        return ResponseEntity.ok("Xác nhận thành công!");
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

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<BloodRequestResponseDTO>> updateBloodRequest(
            @PathVariable String id,
            @Valid @RequestBody BloodRequestDTO dto) {
        try {
            BloodRequestResponseDTO updated = bloodRequestService.updateBloodRequest(id, dto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật đơn thành công", updated));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>(false, "Lỗi hệ thống", null));
        }
    }

    @PutMapping("/{requestId}/approve")
    public ResponseEntity<ApiResponse<BloodRequestResponseDTO>> approveRequest(
            @PathVariable String requestId, Authentication authentication) {
        try {
            String account = authentication.getName();
            BloodRequestResponseDTO response = bloodRequestService.approve(requestId, account);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đơn xin máu đã được duyệt.", response));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<ApiResponse<BloodRequestResponseDTO>> rejectRequest(
            @PathVariable String requestId,
            Authentication authentication,
            @RequestBody BloodRequestResponseDTO reason) {
        try {
            String account = authentication.getName();
            BloodRequestResponseDTO response = bloodRequestService.reject(requestId, account, reason.getRejectionReason());
            return ResponseEntity.ok(new ApiResponse<>(true, "Đã từ chối đơn và gửi thông báo.", response));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    // Kiểm tra tương thích máu
    @GetMapping("/blood-compatibility")
    public ResponseEntity<Boolean> checkBloodCompatibility(
            @RequestParam String donorBloodCode,
            @RequestParam String recipientBloodCode) {
        boolean isCompatible = bloodRequestService.isBloodCompatible(donorBloodCode, recipientBloodCode);
        return ResponseEntity.ok(isCompatible);
    }

    @GetMapping("/compatible-donors/{recipientBloodCode}")
    public ResponseEntity<List<String>> getCompatibleDonors(@PathVariable String recipientBloodCode) {
        List<String> compatibleDonors = bloodRequestService.getCompatibleDonorBloodTypes(recipientBloodCode);
        return ResponseEntity.ok(compatibleDonors);
    }

    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelBloodRequest(
            @PathVariable String requestId,
            Authentication authentication) {
        try {
            String accountId = authentication.getName();
            bloodRequestService.cancelRequest(requestId, accountId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Huỷ đơn xin máu thành công", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }



}
