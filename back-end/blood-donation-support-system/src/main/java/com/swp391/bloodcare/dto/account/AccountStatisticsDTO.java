package com.swp391.bloodcare.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountStatisticsDTO {
    private Long totalAccounts;
    private Long activeAccounts;
    private Long inactiveAccounts;

}
