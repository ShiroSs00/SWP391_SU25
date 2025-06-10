package com.swp391.superapp.bloodsupport.respository;


import com.swp391.superapp.bloodsupport.entity.Account;
import com.swp391.superapp.bloodsupport.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public  class AccountService {

    @Autowired
    AccountRepository accountRepositor;

    public List<Account> getAllAcount(String username){
        return accountRepositor.findAll();
    }
}
