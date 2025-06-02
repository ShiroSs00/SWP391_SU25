/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Account entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */

package com.swp391.superapp.bloodsupport.entity;

import java.time.LocalDate;


public class Profile {
    private String accountId;
    private String name;
    private String phone;
    private LocalDate dob; //xem lại
    private boolean gender;
    private String address;
    private Role role;
    private int numberOfBloodDonation;


}
