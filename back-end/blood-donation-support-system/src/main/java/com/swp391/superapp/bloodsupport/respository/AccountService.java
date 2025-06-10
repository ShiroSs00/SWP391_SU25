package com.swp391.superapp.bloodsupport.respository;


import com.swp391.superapp.bloodsupport.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountService extends JpaRepository<Account, String> {


}
