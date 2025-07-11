package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.BloodRequestRepository;
import com.swp391.bloodcare.repository.ComponentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;


/* An siêu nhân vip pro
Các chức năng:
+ Tạo đơn máu
+ Lấy dánh sách theo account
+ Cập nhật trạng thái đơn
+ Lấy đơn khẩn cấp
 */

@Service
@Transactional
public class  BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ComponentRepository componentRepository;

    @Autowired
    private BloodRepository bloodRepository;


    // tạo đơn xin máu
    public BloodRequest createBloodRequest(@Valid BloodRequestDTO bloodRequestDTO, String accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + accountId));

        validateBloodRequest(bloodRequestDTO, account);

        BloodRequest br = new BloodRequest();

        br.setIdBloodRequest(generateBloodRequestId());
        br.setAccount(account);
        //Lấy thông tin máu
        Blood blood = bloodRepository.findByBloodCode(bloodRequestDTO.getBloodCode()).orElseThrow(()-> new RuntimeException("Không tìm thấy loại máu: " + bloodRequestDTO.getBloodCode()));
        br.setBloodCode(blood);

        //Lấy thành phần
        Component component = componentRepository.findById(bloodRequestDTO.getComponentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thành phần máu với ID: " + bloodRequestDTO.getComponentId()));
        br.setComponent(component);

        br.setRequestDate(bloodRequestDTO.getRequestDate());
        BloodBag.Volume volumeEnum = BloodBag.Volume.fromInt(bloodRequestDTO.getVolume());
        br.setVolume(volumeEnum);

        br.setEmergency(bloodRequestDTO.isEmergency());
        br.setStatus(BloodRequest.statusBloodRequest.PENDING);
        br.setRequestCreationDate(LocalDate.now());

        BloodRequest savedRequest = bloodRequestRepository.save(br);

        return savedRequest;
    }

    public BloodRequestResponseDTO convertToResponseDTO(BloodRequest request) {
        BloodRequestResponseDTO dto = new BloodRequestResponseDTO();
        dto.setIdBloodRequest(request.getIdBloodRequest());
        dto.setRequesterName(request.getAccount().getProfile().getName()); // Tên người đăng ký
        dto.setBloodType(request.getBloodCode().getBloodCode()); // Assuming Blood has getBloodType()
        dto.setComponent(request.getComponent().getType());
        dto.setEmergency(request.isEmergency());
        dto.setStatus(request.getStatus());
        // Thể tích (nếu là enum Volume)
        dto.setVolume(request.getVolume() != null ? request.getVolume().getMl() : null);
        dto.setRequestDate(request.getRequestDate());
        dto.setRequestCreationDate(request.getRequestCreationDate());
        return dto;
    }

    // Lấy tất cả đơn xin máu (cho admin hoặc staff)
    public List<BloodRequestResponseDTO> getAllBloodRequests() {
        return bloodRequestRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // Lấy danh sách theo account
    public List<BloodRequestResponseDTO> getBloodRequestsByAccount(String accountId){
        return bloodRequestRepository.findByAccount_AccountId(accountId).stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    // Lấy đánh sách theo Id
    public Optional<BloodRequestResponseDTO> getBloodRequestById(String id){
        return bloodRequestRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    //Cập nhật trạng thái đơn
    public BloodRequestResponseDTO updateStatus(String id, String nStatus){
        BloodRequest request = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu: " + id));
        String oldStatus = request.getStatus();
        request.setStatus(nStatus);
        BloodRequest saved = bloodRequestRepository.save(request);
        return convertToResponseDTO(saved);
    }

    //Lấy danh sách đơn cấp cứu
    public List<BloodRequestResponseDTO> getEmergencyRequests() {
        return bloodRequestRepository.findByIsEmergencyTrue()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    //Generate Id theo format BR-[Ngày tạo]-[3 số random]
    private String generateBloodRequestId(){

        LocalDate now = LocalDate.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int random = new Random().nextInt(900) + 100;
        return "BR-" + dateStr + random;

    }

    //Validate dữ liệu vào
    private void validateBloodRequest(BloodRequestDTO dto, Account account) {

       if(account.getProfile() == null ||
       account.getProfile().getName() == null){
           throw new IllegalArgumentException("Tên người đăng ký không được để trống. Vui lòng cập nhật thông tin profile trước khi tạo đơn.");
       }

       if(dto.getRequestDate().isBefore(LocalDate.now())){
           throw new IllegalArgumentException("Ngày tạo đã qua");
       }


       //giới hạn đơn trong ngày (tránh spam)
       long todayRequestCount = bloodRequestRepository.countByRequestCreationDate(LocalDate.now());
       if(todayRequestCount > 100){
           throw new RuntimeException("Hệ thống đã đạt giới hạn đơn xin máu trong ngày");

       }
    }

    public BloodRequestResponseDTO updateBloodRequest(String id, @Valid BloodRequestDTO dto) {
        BloodRequest exit = bloodRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu với ID: " + id));

        if(!exit.getStatus().equals(BloodRequest.statusBloodRequest.PENDING.name())){
            throw new IllegalStateException("Chỉ có thể chỉnh sửa đơn khi trạng thái là PENDING.");
        }

        // Nếu có requestDate mới
        if (dto.getRequestDate() != null) {
            if (dto.getRequestDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Ngày nhận không hợp lệ.");
            }
            exit.setRequestDate(dto.getRequestDate());
        }

        if (dto.getVolume() != null) {
            exit.setVolume(BloodBag.Volume.fromInt(dto.getVolume()));
        }

        if (dto.getBloodCode() != null) {
            Blood blood = bloodRepository.findByBloodCode(dto.getBloodCode())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại máu: " + dto.getBloodCode()));
            exit.setBloodCode(blood);
        }

        if (dto.getComponentId() != null) {
            Component component = componentRepository.findById(dto.getComponentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thành phần máu với ID: " + dto.getComponentId()));
            exit.setComponent(component);
        }
        exit.setEmergency(dto.isEmergency());

        BloodRequest updated = bloodRequestRepository.save(exit);
        return convertToResponseDTO(updated);
    }
}
