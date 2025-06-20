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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String roleName = account.getRole().getRole().toUpperCase(); // Ví dụ: ADMIN, STAFF

        return new User(
                account.getUserName(),
                account.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName)) // Rất quan trọng!
        );
    }
}
