package com.swp391.bloodcare.repository;

import com.swp391.bloodcare.entity.BloodRequest;
import com.swp391.bloodcare.entity.WaitingList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface WaitingListRepository extends JpaRepository<WaitingList, String> {

    //Tìm theo trạng thái
    List<WaitingList> findByStatus(WaitingList.StatusEnum status);

    //Tìm theo blood request id
    List<WaitingList> findByBloodRequest(BloodRequest bloodRequest);

    //Tìm theo blood bag id
    List<WaitingList> findByBloodBag_BagId(String bloodBagId);

    //Tìm theo thời gian match
    List<WaitingList> findByMatchDateBetween(Date startDate, Date endDate);

    //Tìm những waiting list chưa có bloodbag
    List<WaitingList> findByBloodBagIsNull();

    //Tìm theo trạng thái và sắp xếp theo ngày match
    List<WaitingList> findByStatusOrderByMatchDateAsc(WaitingList.StatusEnum status);

    //Đếm số lượng theo trạng thái
    long countByStatus(WaitingList.StatusEnum status);

}
