package com.swp391.bloodcare.service;

import com.swp391.bloodcare.entity.Account;
import com.swp391.bloodcare.repository.AccountRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {


    private final AccountRepository accountRepository;

    public CustomUserDetailsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String accountId) throws UsernameNotFoundException {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + accountId));

        String roleName = account.getRole().getRole().toUpperCase(); // Ví dụ: ADMIN, STAFF

        return new User(
                account.getAccountId(), // trả accountId như là username
                account.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName)) // Rất quan trọng!
        );
    }
}
