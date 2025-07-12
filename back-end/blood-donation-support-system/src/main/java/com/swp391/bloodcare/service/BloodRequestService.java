package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
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

    @Autowired
    private BloodService bloodService;

    @Autowired
    private BloodBagRepository bloodBagRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BloodCompatibilityService bloodCompatibilityService;

    @Autowired
    private NotificationService notificationService;


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

    //Admin - Staff thông qua
    @Transactional
    public BloodRequestResponseDTO approve(String requestId, String accountId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu với ID: " + requestId));

        if(!request.getStatus().equals(BloodRequest.statusBloodRequest.PENDING)) {
            throw new IllegalStateException("Chỉ có thể xử lý đơn khi trạng thái là PENDING.");
        }
        //tìm túi máu phù hợp
        Optional<BloodBag> suitableBloodBag = findSuitableBloodBag(request);
        if(suitableBloodBag.isPresent()) {
            BloodBag bag = suitableBloodBag.get();
            request.setBloodBag(bag);
            request.setStatus(BloodRequest.statusBloodRequest.APPROVE);
            request.setProcessedBy(accountId);
            request.setProcessedDate(LocalDate.now());

            bag.setStatus(BloodBag.Status.USED);
            bloodBagRepository.save(bag);

            sendApprovalNotification(request);

            BloodRequest savedRequest = bloodRequestRepository.save(request);
            return convertToResponseDTO(savedRequest);
        } else {
            throw new RuntimeException("Không tìm thấy túi máu phù hợp cho đơn yêu cầu này.");
        }
    }

    /**
     * Admin reject đơn xin máu
     * @param requestId ID đơn xin máu
     * @param adminId ID admin xử lý
     * @param rejectionReason Lý do từ chối
     * @return BloodRequestResponseDTO
     */
    @Transactional
    public BloodRequestResponseDTO reject(String requestId, String adminId, String rejectionReason) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu với ID: " + requestId));

        if (!request.getStatus().equals(BloodRequest.statusBloodRequest.PENDING)) {
            throw new IllegalStateException("Chỉ có thể xử lý đơn khi trạng thái là PENDING.");
        }

        // Cập nhật trạng thái đơn
        request.setStatus(BloodRequest.statusBloodRequest.REJECT);
        request.setProcessedBy(adminId);
        request.setProcessedDate(LocalDate.now());
        request.setRejectionReason(rejectionReason);

        // Tìm kiếm người hiến máu tiềm năng gần khu vực
        findAndNotifyPotentialDonors(request);

        BloodRequest savedRequest = bloodRequestRepository.save(request);
        return convertToResponseDTO(savedRequest);
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


    // Bảng tương thích máu - ai có thể hiến cho ai
    private static final Map<String, List<String>> BLOOD_COMPATIBILITY = new HashMap<>();

    static {
        // Nhóm máu O- có thể hiến cho tất cả
        BLOOD_COMPATIBILITY.put("O-", Arrays.asList("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"));
        // Nhóm máu O+ có thể hiến cho O+, A+, B+, AB+
        BLOOD_COMPATIBILITY.put("O+", Arrays.asList("O+", "A+", "B+", "AB+"));
        // Nhóm máu A- có thể hiến cho A+, A-, AB+, AB-
        BLOOD_COMPATIBILITY.put("A-", Arrays.asList("A+", "A-", "AB+", "AB-"));
        // Nhóm máu A+ có thể hiến cho A+, AB+
        BLOOD_COMPATIBILITY.put("A+", Arrays.asList("A+", "AB+"));
        // Nhóm máu B- có thể hiến cho B+, B-, AB+, AB-
        BLOOD_COMPATIBILITY.put("B-", Arrays.asList("B+", "B-", "AB+", "AB-"));
        // Nhóm máu B+ có thể hiến cho B+, AB+
        BLOOD_COMPATIBILITY.put("B+", Arrays.asList("B+", "AB+"));
        // Nhóm máu AB- có thể hiến cho AB+, AB-
        BLOOD_COMPATIBILITY.put("AB-", Arrays.asList("AB+", "AB-"));
        // Nhóm máu AB+ chỉ có thể hiến cho AB+
        BLOOD_COMPATIBILITY.put("AB+", Arrays.asList("AB+"));
    }

    /**
     * Kiểm tra xem loại máu nào có thể hiến cho nhau
     * @param donorBloodCode Nhóm máu của người hiến
     * @param recipientBloodCode Nhóm máu của người nhận
     * @return true nếu tương thích
     */
    public boolean isBloodCompatible(String donorBloodCode, String recipientBloodCode) {
        return bloodCompatibilityService.isCompatible(donorBloodCode, recipientBloodCode);
    }

    /**
     * Lấy danh sách nhóm máu có thể hiến cho nhóm máu cụ thể
     * @param recipientBloodCode Nhóm máu người nhận
     * @return Danh sách nhóm máu có thể hiến
     */
    public List<String> getCompatibleDonorBloodTypes(String recipientBloodCode) {
        return bloodCompatibilityService.getCompatibleDonors(recipientBloodCode);
    }

    /**
     * Tìm túi máu phù hợp
     * @param request Đơn xin máu
     * @return Optional<BloodBag>
     */
    private Optional<BloodBag> findSuitableBloodBag(BloodRequest request) {
        String requestedBloodCode = request.getBloodCode().getBloodCode();
        String requestedComponent = request.getComponent().getType();
        BloodBag.Volume requestedVolume = request.getVolume();

        // Tìm túi máu có cùng nhóm máu, thành phần và thể tích
        return bloodBagRepository.findByBloodCode_BloodCodeAndComponent_TypeAndVolumeAndStatus(
                requestedBloodCode,
                requestedComponent,
                requestedVolume,
                BloodBag.Status.VALID
        ).stream().findFirst();
    }

    /**
     * Gửi thông báo khi đơn được approve
     * @param request Đơn xin máu
     */
    private void sendApprovalNotification(BloodRequest request) {
        notificationService.sendApprovalNotification(request);
    }

    /**
     * Tìm và thông báo đến những người hiến máu tiềm năng
     * @param request Đơn xin máu bị reject
     */
    private void findAndNotifyPotentialDonors(BloodRequest request) {
        String requestedBloodCode = request.getBloodCode().getBloodCode();
        // Lấy danh sách nhóm máu có thể hiến
        List<String> compatibleBloodTypes = getCompatibleDonorBloodTypes(requestedBloodCode);

        Address address = request.getAccount().getProfile().getAddress();
        Double lat = address.getLatitude();
        Double lng = address.getLongitude();
        if (lat == null || lng == null) {
            throw new IllegalStateException("Không có thông tin tọa độ người nhận máu.");
        }
        double searchRadiusKm = 20.0;

        // Tìm các account có nhóm máu tương thích và gần khu vực
        List<Account> potentialDonors = accountRepository.findNearbyCompatibleDonorsByLatLng(
                lat, lng, searchRadiusKm, compatibleBloodTypes
        );
        // Gửi thông báo đến những người hiến máu tiềm năng
        notificationService.sendBloodRequestNotification(request, potentialDonors);

        // Gửi thông báo từ chối đến người yêu cầu
        notificationService.sendRejectionNotification(request);
    }

}
