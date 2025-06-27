package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.WaitingListResponseDTO;
import com.swp391.bloodcare.entity.BloodBag;
import com.swp391.bloodcare.entity.BloodRequest;
import com.swp391.bloodcare.entity.WaitingList;
import com.swp391.bloodcare.repository.BloodBagRepository;
import com.swp391.bloodcare.repository.WaitingListRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


/*
Các chức năng xử lí
+ tạo waitling list
 */
@Service
@Transactional
public class WaitingListService {

    @Autowired
    private WaitingListRepository waitingListRepository;

    @Autowired
    private BloodBagRepository bloodBagRepository;

    //tạo waitling list
    public void createWaitingList(BloodRequest bloodRequest) {
        WaitingList wl = new WaitingList();
        wl.setWaitListId(generateWaitListId());
        wl.setBloodRequest(bloodRequest);
        wl.setBloodBag(null);
        wl.setMatchDate(new Date());
        wl.setStatus(WaitingList.StatusEnum.PENDING);
        wl.setNote("");
        waitingListRepository.save(wl);
    }

    //thêm blood bag vào waitling list
    public WaitingListResponseDTO assignBloodBag(String waitListId, String bloodBagId){
        WaitingList wl1 = waitingListRepository.findById(waitListId).orElseThrow(()-> new RuntimeException("Không tìm thấy waiting list: " + waitListId));

        BloodBag bloodBag = bloodBagRepository.findById(bloodBagId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy túi máu: " + bloodBagId));

        //kiểm tra túi máu đã sử dung chưa?
        if (bloodBag.getStatus() == BloodBag.statusBloodBag.USED) {
            throw new RuntimeException("Túi máu này đã được sử dụng");
        }

        if (!isBloodTypeCompatible(wl1.getBloodRequest(), bloodBag)) {
            throw new RuntimeException("Nhóm máu không tương thích!");
        }
        // cập nhật trạng thái túi máu
        bloodBag.setStatus(BloodBag.statusBloodBag.USED);
        bloodBagRepository.save(bloodBag);

        //cập nhật waiting list
        wl1.setBloodBag(bloodBag);
        wl1.setStatus(WaitingList.StatusEnum.APPROVED);
        wl1.setNote(wl1.getNote() + " - Đã gán túi máu: " + bloodBagId);

        waitingListRepository.save(wl1);
        return convertToResponseDTO(wl1);

    }

    //Hiển thị toàn bộ waitling list
    public List<WaitingListResponseDTO> getAllWaitingList() {
        return waitingListRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    //Hiển thị waitling list theo trạng thái
    public List<WaitingListResponseDTO> getWaitingListByStatus(WaitingList.StatusEnum status) {
        return waitingListRepository.findByStatus(status).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    //Cập nhật trạng thái waitling lists
    public WaitingListResponseDTO updateWaitingListStatus(String waitListId, WaitingList.StatusEnum newStatus) {
        WaitingList wl = waitingListRepository.findByWaitListId(waitListId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy waiting list: " + waitListId));

        WaitingList.StatusEnum oldStatus = wl.getStatus();
        wl.setStatus(newStatus);

        String statusNote = String.format(" - Trạng thái thay đổi từ %s sang %s", oldStatus, newStatus);
        wl.setNote((wl.getNote() != null ? wl.getNote() : "") + statusNote);

        waitingListRepository.save(wl);
        return convertToResponseDTO(wl);
    }

    //tìm waiting list theo id
    public WaitingListResponseDTO getWaitingListById(String waitListId) {
        WaitingList wl = waitingListRepository.findByWaitListId(waitListId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy waiting list: " + waitListId));
        return convertToResponseDTO(wl);
    }



    private String generateWaitListId(){
        String datePart = LocalDate.now().toString().replace("-", ""); // yyyyMMdd
        int randomNum = (int)(Math.random() * 900) + 100; // Tạo số từ 100 - 999
        return "WL-" + datePart + "-" + randomNum;
    }

    //Kiểm tra tương thích nhóm máu
    private boolean isBloodTypeCompatible(BloodRequest request, BloodBag bloodBag) {
        // Logic kiểm tra tương thích nhóm máu
        String requestBloodType = request.getBloodCode().getBloodCode();
        String bagBloodType = bloodBag.getAfterDonationBlood().getBlood().getBloodCode();

        // Ví dụ logic đơn giản - bạn có thể customize
        return requestBloodType.equals(bagBloodType);
    }

    public WaitingListResponseDTO convertToResponseDTO(WaitingList wl) {
        if(wl == null){
            return null;
        }

        WaitingListResponseDTO dto = new WaitingListResponseDTO();
        dto.setWaitListId(wl.getWaitListId());
        dto.setBloodRequestId(wl.getBloodRequest().getIdBloodRequest());
        dto.setPatientName(wl.getBloodRequest().getPatientName());
        dto.setBloodCode(wl.getBloodRequest().getBloodCode().getBloodCode());
        dto.setMatchDate(wl.getMatchDate());
        dto.setStatus(wl.getStatus().name());
        dto.setNote(wl.getNote());
        return dto;
    }
}
