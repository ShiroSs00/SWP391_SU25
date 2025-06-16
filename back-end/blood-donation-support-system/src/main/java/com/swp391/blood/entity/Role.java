/* File: Account.java
 * Author: SE184889 - Nguyễn Trần Việt An (AnNTV)
 * Created on: 02-06-2025
 * Purpose: Pepresnets the Role entity used for user authentication and profile manage
 *
 * Change Log:
 * [02-06-2025] - Created by: AnNTV
 */
package com.swp391.blood.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @Column(name ="role_name")
    private String role;

    @Column(name ="description")
    private String description;

    @OneToMany(mappedBy = "role")
    private List<Account> accounts = new ArrayList<>();

    public Role() {
    }

    public Role( String role, String description) {

        this.role = role;
        this.description = description;
    }



    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role= role;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Role{" +
                "role='" + role + '\'' +
                ", description='" + description ;
    }
}
