package com.example.kursova.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name ="\"Booking\"")
public class Booking implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "guest_name")
    private String guestName;

    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "guest_phone")
    private String guestPhone;
    @Column(name = "price")
    private Integer price;

    @Column(name = "ispaid")
    private Boolean ispaid;

    public Booking() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getGuestPhone() { return guestPhone; }
    public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public Boolean getIspaid() { return ispaid; }
    public void setIspaid(Boolean ispaid) { this.ispaid = ispaid; }
}