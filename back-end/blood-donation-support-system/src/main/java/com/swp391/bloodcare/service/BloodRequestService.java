package com.swp391.bloodcare.service;

import com.swp391.bloodcare.dto.request.BloodRequestDTO;
import com.swp391.bloodcare.dto.request.BloodRequestResponseDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import com.swp391.bloodcare.entity.*;
import com.swp391.bloodcare.repository.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final AccountRepository accountRepository;
    private final ProfileRepository profileRepository;
    private final EmailNotifier emailNotifier;
    private final ComponentRepository componentRepository;
    private final BloodRepository bloodRepository;
    private final BloodBagRepository bloodBagRepository;
    private final BloodCompatibilityService bloodCompatibilityService;
    private final NotificationService notificationService;

    @Value("${app.confirmation.base-url}")
    private String confirmationBaseUrl;

    private static final String SECRET_KEY = "ThisIsASecretKeyWithMoreThan32Characters!";

    private final Map<String, Set<String>> confirmedMap = new HashMap<>();

    public BloodRequestService(
            BloodRequestRepository bloodRequestRepository,
            AccountRepository accountRepository,
            ProfileRepository profileRepository,
            EmailNotifier emailNotifier,
            ComponentRepository componentRepository,
            BloodRepository bloodRepository,
            BloodBagRepository bloodBagRepository,
            BloodCompatibilityService bloodCompatibilityService,
            NotificationService notificationService) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.accountRepository = accountRepository;
        this.profileRepository = profileRepository;
        this.emailNotifier = emailNotifier;
        this.componentRepository = componentRepository;
        this.bloodRepository = bloodRepository;
        this.bloodBagRepository = bloodBagRepository;
        this.bloodCompatibilityService = bloodCompatibilityService;
        this.notificationService = notificationService;
    }

    public List<Profile> matchTopDonors(BloodRequest request, int start, int limit) {
        return profileRepository.findAll().stream()
                .filter(p -> p.getAccount().getIsActive())
                .filter(this::isEligibleToDonate)
                .filter(p -> bloodCompatibilityService.isCompatible(p.getBloodCode().getBloodCode(), request.getBloodCode().getBloodCode()))
                .sorted(Comparator.comparingDouble(p -> distance(request, p)))
                .skip(start).limit(limit)
                .toList();
    }

    private boolean isEligibleToDonate(Profile profile) {
        return profile.getRestDate() == null || profile.getRestDate().isBefore(LocalDate.now());
    }

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void retryMatchAndNotifyAll() {
        List<BloodRequest> pendingRequests = bloodRequestRepository.findByStatus(BloodRequest.statusBloodRequest.PENDING);
        for (BloodRequest request : pendingRequests) {
            if (ChronoUnit.DAYS.between(request.getRequestCreationDate(), LocalDate.now()) % 2 != 0) continue;
            int confirmed = getConfirmedCount(request.getIdBloodRequest());
            if (confirmed >= 3) continue;

            Optional<BloodBag> available = findSuitableBloodBag(request, 10);
            if (available.isPresent()) {
                notifyRequesterToPickup(request);
                request.setStatus(BloodRequest.statusBloodRequest.APPROVE);
                bloodRequestRepository.save(request);
                continue;
            }

            int batch = confirmedMap.getOrDefault(request.getIdBloodRequest(), new HashSet<>()).size() / 20;
            sendBatchEmails(request, (batch + 1) * 20, 20);
        }
    }

    private void notifyRequesterToPickup(BloodRequest request) {
        emailNotifier.sendHtml(
                request.getAccount().getEmail(),
                "[CÓ MÁU SẴN] Mời bạn đến nhận máu",
                """
                        <p>🩸 Hệ thống đã tìm thấy đủ số lượng máu phù hợp (≥10 túi) tại ngân hàng máu.</p>
                        <p>Vui lòng đến nhận máu tại bệnh viện trong thời gian sớm nhất.</p>
                        <p>❤️ Cảm ơn bạn đã sử dụng hệ thống.</p>
                        """
        );
    }

    private Optional<BloodBag> findSuitableBloodBag(BloodRequest request, int minQuantity) {
        String bloodCode = request.getBloodCode().getBloodCode();
        String component = request.getComponent().getType();
        BloodBag.Volume volume = request.getVolume();

        List<BloodBag> bags = bloodBagRepository.findByBloodCode_BloodCodeAndComponent_TypeAndVolumeAndStatus(
                bloodCode, component, volume, BloodBag.Status.VALID
        );
        return bags.size() >= minQuantity ? Optional.of(bags.getFirst()) : Optional.empty();
    }

    private void sendBatchEmails(BloodRequest request, int offset, int limit) {
        List<Profile> donors = matchTopDonors(request, offset, limit);
        for (Profile profile : donors) {
            String email = profile.getAccount().getEmail();
            if (email == null || email.isBlank()) continue;

            String token = generateConfirmationToken(request.getIdBloodRequest(), profile.getProfileId());
            String link = confirmationBaseUrl + "?token=" + token;

            emailNotifier.sendHtml(
                    email,
                    "[KHẨN CẤP] Yêu cầu hỗ trợ hiến máu",
                    buildEmailBody(request, link)
            );
        }
    }

    private String buildEmailBody(BloodRequest request, String link) {
        return String.format("""
                        <p>🩸 Xin chào,</p>
                        <p>Một người gần bạn đang cần hỗ trợ hiến máu:</p>
                        <ul>
                            <li>Nhóm máu: %s (%s)</li>
                            <li>Lượng máu: %d ml</li>
                            <li>Ngày mong muốn: %s</li>
                        </ul>
                        <p><a href='%s'>Xác nhận hiến máu</a></p>
                        <p>❤️ Cảm ơn bạn vì tinh thần nhân ái.</p>
                        """,
                request.getBloodCode().getBloodType(),
                request.getBloodCode().getRh(),
                request.getVolume().getMl(),
                request.getRequestDate(),
                link);
    }

    private String generateConfirmationToken(String requestId, String profileId) {
        Instant now = Instant.now();
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject("blood-confirmation")
                .claim("requestId", requestId)
                .claim("profileId", profileId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(3, ChronoUnit.DAYS)))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public void confirmDonation(String token) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();

        String requestId = claims.get("requestId", String.class);
        String profileId = claims.get("profileId", String.class);

        BloodRequest request = getByIdRaw(requestId);
        if (request.getStatus().equals(BloodRequest.statusBloodRequest.APPROVE)) {
            throw new RuntimeException("Đơn đã thông qua hoặc không còn hiệu lực.");
        }

        confirmedMap.putIfAbsent(requestId, new HashSet<>());
        Set<String> confirmedSet = confirmedMap.get(requestId);
        if (confirmedSet.contains(profileId)) {
            throw new RuntimeException("Bạn đã xác nhận rồi.");
        }

        confirmedSet.add(profileId);
        if (confirmedSet.size() >= 3) {
            request.setStatus(BloodRequest.statusBloodRequest.APPROVE);
            bloodRequestRepository.save(request);
            notifyRequesterWithConfirmedDonors(request, confirmedSet);
        }
    }

    private void notifyRequesterWithConfirmedDonors(BloodRequest request, Set<String> profileIds) {
        List<Long> longIds = profileIds.stream().map(Long::parseLong).toList();
        List<Profile> donors = profileRepository.findAllById(longIds);

        String donorListHtml = donors.stream()
                .map(d -> String.format("""
                                <li><b>%s</b> - %s - %s<br/>Nhóm máu: %s (%s)<br/>Địa chỉ: %s</li>
                                """,
                        d.getName(),
                        d.getPhone(),
                        d.getAccount().getEmail(),
                        d.getBloodCode().getBloodType(),
                        d.getBloodCode().getRh(),
                        d.getAddress().toString()))
                .collect(Collectors.joining());

        emailNotifier.sendHtml(
                request.getAccount().getEmail(),
                "[THÀNH CÔNG] Đã có người xác nhận hiến máu",
                String.format("""
                        <p>🩸 Đơn yêu cầu máu của bạn đã có đủ người xác nhận:</p>
                        <ul>%s</ul>
                        <p>Vui lòng chủ động liên hệ để sắp xếp việc tiếp nhận máu.</p>
                        <p>❤️ Cảm ơn bạn đã sử dụng hệ thống.</p>
                        """, donorListHtml)
        );
    }

    private int getConfirmedCount(String requestId) {
        return confirmedMap.getOrDefault(requestId, new HashSet<>()).size();
    }

    private BloodRequest getByIdRaw(String id) {
        return bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn với ID: " + id));
    }

    private double distance(BloodRequest request, Profile profile) {
        try {
            Address from = request.getAccount().getProfile().getAddress();
            Address to = profile.getAddress();
            if (from == null || to == null || from.getLatitude() == null || to.getLatitude() == null)
                return Double.MAX_VALUE;
            return haversine(from.getLatitude(), from.getLongitude(), to.getLatitude(), to.getLongitude());
        } catch (Exception e) {
            return Double.MAX_VALUE;
        }
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // tạo đơn xin máu
    public BloodRequest createBloodRequest(@Valid BloodRequestDTO bloodRequestDTO, String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản: " + accountId));
        if (!account.getProfile().isCanRequestBlood()) {
            throw new IllegalStateException("Bạn đã hủy đơn nhiều lần và bị tạm khóa quyền đăng ký nhận máu");
        }

        if (bloodRequestRepository.existsPendingRequestByAccountId(accountId)) {
            throw new IllegalStateException("Bạn đã có một đơn xin máu đang chờ xử lý. Vui lòng huỷ hoặc đợi xử lý trước khi tạo đơn mới.");
        }

        validateBloodRequest(bloodRequestDTO, account);

        Blood blood = bloodRepository.findByBloodCode(bloodRequestDTO.getBloodCode())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại máu: " + bloodRequestDTO.getBloodCode()));

        BloodRequest br = new BloodRequest();
        br.setIdBloodRequest(generateBloodRequestId());
        br.setAccount(account);
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

        return bloodRequestRepository.save(br);
    }

    public BloodRequestResponseDTO convertToResponseDTO(BloodRequest request) {
        BloodRequestResponseDTO dto = new BloodRequestResponseDTO();
        dto.setIdBloodRequest(request.getIdBloodRequest());
        dto.setRequesterName(request.getAccount().getProfile().getName());
        dto.setRequesterPhone(request.getAccount().getProfile().getPhone());
        dto.setRequesterEmail(request.getAccount().getEmail());
        dto.setRequesterAddress(request.getAccount().getProfile().getAddress().toString());

        dto.setRequestDate(request.getRequestDate());
        dto.setBloodType(request.getBloodCode().getBloodCode());
        dto.setComponent(request.getComponent().getType());
        dto.setEmergency(request.isEmergency());
        dto.setStatus(request.getStatus());
        dto.setVolume(request.getVolume() != null ? request.getVolume().getMl() : null);
        dto.setRequestDate(request.getRequestDate());
        dto.setRequestCreationDate(request.getRequestCreationDate());

        dto.setRejectionReason(request.getRejectionReason());
        dto.setProcessedBy(request.getProcessedBy());
        dto.setProcessedDate(request.getProcessedDate());
        if (request.getBloodBag() != null)
            dto.setBloodBagId(request.getBloodBag().getBagId());
        return dto;
    }


    public List<BloodRequestResponseDTO> getAllBloodRequests() {
        return bloodRequestRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BloodRequestResponseDTO> getBloodRequestsByAccount(String accountId) {
        return bloodRequestRepository.findByAccount_AccountId(accountId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<BloodRequestResponseDTO> getBloodRequestById(String id) {
        return bloodRequestRepository.findById(id).map(this::convertToResponseDTO);
    }


    //Admin - Staff thông qua
    @Transactional
    public BloodRequestResponseDTO approve(String requestId, String accountId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu với ID: " + requestId));

        if (!request.getStatus().equals(BloodRequest.statusBloodRequest.PENDING)) {
            throw new IllegalStateException("Chỉ có thể xử lý đơn khi trạng thái là PENDING.");
        }
        //tìm túi máu phù hợp
        Optional<BloodBag> suitableBloodBag = findSuitableBloodBag(request);
        if (suitableBloodBag.isPresent()) {
            BloodBag bag = suitableBloodBag.get();
            request.setBloodBag(bag);
            request.setStatus(BloodRequest.statusBloodRequest.APPROVE);
            request.setProcessedBy(accountId);
            request.setProcessedDate(LocalDate.now());

            bag.setStatus(BloodBag.Status.USED);
            bloodBagRepository.save(bag);

            sendApprovalNotification(request);
            sendDonorNotification(bag);
            BloodRequest savedRequest = bloodRequestRepository.save(request);
            return convertToResponseDTO(savedRequest);
        } else {
            throw new RuntimeException("Không tìm thấy túi máu phù hợp cho đơn yêu cầu này.");
        }
    }

    /**
     * Admin reject đơn xin máu
     *
     * @param requestId       ID đơn xin máu
     * @param adminId         ID admin xử lý
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
        return bloodRequestRepository.findByIsEmergencyTrue().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private String generateBloodRequestId() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int random = new Random().nextInt(900) + 100;
        return "BR-" + dateStr + random;
    }

    private void validateBloodRequest(BloodRequestDTO dto, Account account) {
        if (account.getProfile() == null || account.getProfile().getName() == null) {
            throw new IllegalArgumentException("Tên người đăng ký không được để trống. Vui lòng cập nhật thông tin profile.");
        }

        if (dto.getRequestDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Ngày yêu cầu đã qua.");
        }

        long todayCount = bloodRequestRepository.countByRequestCreationDate(LocalDate.now());
        if (todayCount > 100) {
            throw new RuntimeException("Hệ thống đã đạt giới hạn đơn xin máu trong ngày.");
        }
    }

    public BloodRequestResponseDTO updateBloodRequest(String id, @Valid BloodRequestDTO dto) {
        BloodRequest exit = bloodRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn xin máu với ID: " + id));

        if (!exit.getStatus().equals(BloodRequest.statusBloodRequest.PENDING)) {
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


    /**
     * Kiểm tra xem loại máu nào có thể hiến cho nhau
     *
     * @param donorBloodCode     Nhóm máu của người hiến
     * @param recipientBloodCode Nhóm máu của người nhận
     * @return true nếu tương thích
     */
    public boolean isBloodCompatible(String donorBloodCode, String recipientBloodCode) {
        return bloodCompatibilityService.isCompatible(donorBloodCode, recipientBloodCode);
    }

    /**
     * Lấy danh sách nhóm máu có thể hiến cho nhóm máu cụ thể
     *
     * @param recipientBloodCode Nhóm máu người nhận
     * @return Danh sách nhóm máu có thể hiến
     */
    public List<String> getCompatibleDonorBloodTypes(String recipientBloodCode) {
        return bloodCompatibilityService.getCompatibleDonors(recipientBloodCode);
    }

    /**
     * Tìm túi máu phù hợp
     *
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
     *
     * @param request Đơn xin máu
     */
    private void sendApprovalNotification(BloodRequest request) {
        notificationService.sendApprovalNotification(request);
    }

    public void sendDonorNotification(BloodBag bag){
        notificationService.sendDonorNotification(bag);
    }

    /**
     * Tìm và thông báo đến những người hiến máu tiềm năng
     *
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
        List<Account> potentialDonors = accountRepository.findNearbyCompatibleDonors(
                lat, lng, searchRadiusKm, compatibleBloodTypes, request.getAccount().getAccountId()
        );
        System.out.println("Số người hiến phù hợp tìm thấy: " + potentialDonors.size());
        System.out.println("Danh sách blood type tương thích: " + compatibleBloodTypes);
        System.out.println("Tọa độ: lat=" + lat + ", lng=" + lng);

        // Gửi thông báo đến những người hiến máu tiềm năng
        for (Account donor : potentialDonors) {
            String email = donor.getEmail();
            if (email == null || email.isBlank()) continue;

            String profileId = donor.getProfile().getProfileId();
            String token = generateConfirmationToken(request.getIdBloodRequest(), profileId);
            String link = confirmationBaseUrl + "?token=" + token;

            notificationService.sendBloodRequestNotification(request, potentialDonors, link);

            // Gửi thông báo từ chối đến người yêu cầu
            notificationService.sendRejectionNotification(request);
        }
    }

    // CANCEL đơn

    @Transactional
    public void cancelRequest(String requestId, String accountId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy đơn nhận máu"));

        if (request.getStatus() != BloodRequest.statusBloodRequest.PENDING) {
            throw new IllegalStateException("Chỉ được hủy đơn ở trạng thái đang chờ");
        }

        if (!request.getAccount().getAccountId().equals(accountId)) {
            throw new SecurityException("Bạn không có quyền hủy đơn này");
        }

        // Cập nhật trạng thái đơn
        request.setStatus(BloodRequest.statusBloodRequest.CANCELLED);
        bloodRequestRepository.save(request);

        // Cập nhật profile
        Profile profile = request.getAccount().getProfile();
        profile.setCancelCount(profile.getCancelCount() + 1);

        if (profile.getCancelCount() >= 3) {
            profile.setCanRequestBlood(false); // Khóa quyền tạo đơn
        }

        profileRepository.save(profile);
    }

    @Scheduled(cron = "0 0 0 * * ?", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void resetCancelRestrictions() {
        List<Profile> profiles = profileRepository.findAll();

        for (Profile profile : profiles) {
            if (!profile.isCanRequestBlood()) {
                profile.setCancelCount(0);
                profile.setCanRequestBlood(true);
            }
        }
        profileRepository.saveAll(profiles);
    }


}