package com.swp391.bloodcare.controller;

import com.swp391.bloodcare.dto.ApiResponse;
import com.swp391.bloodcare.dto.WaitingListResponseDTO;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.WaitingList;
import com.swp391.bloodcare.service.WaitingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/waiting-list")
@CrossOrigin(origins = "*")
public class WaitingListController {

    @Autowired
    private WaitingListService waitingListService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WaitingListResponseDTO>>> getAllWaitingList() {
        try {
            List<WaitingListResponseDTO> wLists = waitingListService.getAllWaitingList();
            ApiResponse<List<WaitingListResponseDTO>> response = new ApiResponse<>(
                    true,
                    "Lấy danh sách chờ thành công",
                    wLists
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<List<WaitingListResponseDTO>> response = new ApiResponse<>(
                    false,
                    "Lỗi khi lấy danh sách chờ: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //Hiển thị waiting list theo trạng thái
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<WaitingListResponseDTO>>> getAllWaitingListByStatus(@PathVariable String status) {
        try {
            WaitingList.StatusEnum statusEnum = WaitingList.StatusEnum.valueOf(status.toUpperCase());

            List<WaitingListResponseDTO> list = waitingListService.getWaitingListByStatus(statusEnum);

            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách theo trạng thái thành công", list));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Trạng thái không hợp lệ: " + status, null));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi lấy danh sách chờ: " + e.getMessage(), null));
        }
    }

    //lấy wls theo Id
    @GetMapping("/{waitListId}")
    public ResponseEntity<ApiResponse<WaitingListResponseDTO>> getWaitingListById(@PathVariable String waitListId) {
        try {
            WaitingListResponseDTO dto = waitingListService.getWaitingListById(waitListId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin thành công", dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    //Gắn túi máu cho wl
    @PutMapping("/{waitListId}/assign-blood-bag")
    public ResponseEntity<ApiResponse<WaitingListResponseDTO>> assignBloodBag(String waitingListId, BloodBag bloodBag) {
        try {
            WaitingListResponseDTO updateWL = waitingListService.assignBloodBag(waitingListId, bloodBag.getBagId());
            ApiResponse<WaitingListResponseDTO> response = new ApiResponse<>(
                    true,
                    "Gắn tui máu thành công",
                    updateWL
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            ApiResponse<WaitingListResponseDTO> response = new ApiResponse<>(
                    false,
                    "Lỗi khi gán túi máu: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //cập nhật trạng thái wl
    @PutMapping("/{waitListId}/status")
    public ResponseEntity<ApiResponse<WaitingListResponseDTO>> updateStatus(
            @PathVariable String waitListId,
            @RequestBody Map<String, String> request
    ) {
        try {
            String statusStr = request.get("status");
            WaitingList.StatusEnum newStatus = WaitingList.StatusEnum.valueOf(statusStr.toUpperCase());

            WaitingListResponseDTO updated = waitingListService.updateWaitingListStatus(waitListId, newStatus);

            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái thành công", updated));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Trạng thái không hợp lệ", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse<>(false, "Lỗi khi cập nhật trạng thái: " + e.getMessage(), null));
        }
    }
}

