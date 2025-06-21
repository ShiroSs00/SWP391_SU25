package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.entity.Blood;
import com.swp391.bloodcare.entity.BloodRequest;
import com.swp391.bloodcare.entity.Hospital;
import com.swp391.bloodcare.repository.AccountRepository;
import com.swp391.bloodcare.repository.BloodRepository;
import com.swp391.bloodcare.repository.BloodRequestRepository;
import com.swp391.bloodcare.repository.HospitalRepository;
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
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private BloodRepository bloodRepository;


    // tạo đơn xin máu
    public BloodRequest createBloodRequest(BloodRequestDTO bloodRequestDTO, String accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + accountId));

        validateBloodRequest(bloodRequestDTO, account);

        BloodRequest br = new BloodRequest();

        br.setIdBloodRequest(generateBloodRequestId());
        br.setAccount(account);
        Hospital hospital = hospitalRepository.findById(bloodRequestDTO.getHospitalName()).orElseThrow(()-> new RuntimeException("Không tìm thấy bệnh viện: " + bloodRequestDTO.getHospitalName()));

        Blood blood = bloodRepository.findByBloodCode(bloodRequestDTO.getBloodCode()).orElseThrow(()-> new RuntimeException("Không tìm thấy loại máu: " + bloodRequestDTO.getBloodCode()));
        br.setBloodCode(blood);

        br.setPatientName(bloodRequestDTO.getPatientName());
        br.setRequestDate(bloodRequestDTO.getRequestDate());
        br.setVolume(bloodRequestDTO.getVolume());
        br.setEmergency(bloodRequestDTO.isEmergency());
        br.setStatus("Đang xử lý");
        br.setRequestCreationDate(LocalDate.now());

        BloodRequest savedRequest = bloodRequestRepository.save(br);

        return savedRequest;
    }

    public BloodRequestResponseDTO convertToResponseDTO(BloodRequest request) {
        BloodRequestResponseDTO dto = new BloodRequestResponseDTO();
        dto.setIdBloodRequest(request.getIdBloodRequest());
        dto.setRequesterName(request.getAccount().getProfile().getName()); // Tên người đăng ký
        dto.setAccountName(request.getAccount().getProfile().getName()); // Tên tài khoản
        dto.setHospitalName(request.getAccount().getHospital().getHospitalName()); // Assuming Hospital has getName()
        dto.setPatientName(request.getPatientName());
        dto.setRequestDate(request.getRequestDate());
        dto.setBloodType(request.getBloodCode().getBloodCode()); // Assuming Blood has getBloodType()
        dto.setEmergency(request.isEmergency());
        dto.setStatus(request.getStatus());
        dto.setVolume(request.getVolume());
        dto.setRequestCreationDate(request.getRequestCreationDate());
        return dto;
    }


    // Lấy danh sách theo account
    public List<BloodRequestResponseDTO> getBloodRequestsByAccount(String accountId){
        return bloodRequestRepository.findByAccountId(accountId).stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    // Lấy đánh sách theo Id
    public Optional<BloodRequestResponseDTO> getBloodRequestById(String id){
        return bloodRequestRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    //Cập nhật trạng thái đơn
    public BloodRequest updateStatus(String id, String nStatus){
        BloodRequest request = bloodRequestRepository.findById(id).orElseThrow(()-> new RuntimeException("Không tìm thấy đơn xin máu: " + id));

        request.setStatus(nStatus);
        return bloodRequestRepository.save(request);
    }

    //Lấy danh sách đơn cấp cứu
    public List<BloodRequest> getEmergencyRequests(){
        return bloodRequestRepository.findByIsEmergencyTrue();
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
}
