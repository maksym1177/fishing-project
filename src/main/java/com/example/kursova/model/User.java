package com.example.kursova.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "users")
public class User implements Serializable {


    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String username;

    private String password;

    @Column(unique = true)
    private String email;

    @Column(name = "is_admin")
    private boolean admin = false;

    @Column(name = "phone")
    private String phone;
    @Column(name = "discount")
    private int discount = 0;



    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public int getDiscount() { return discount; }
    public void setDiscount(int discount) { this.discount = discount; }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }
}
