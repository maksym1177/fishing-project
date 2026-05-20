package com.example.kursova.controller;

import com.example.kursova.model.Booking;
import com.example.kursova.model.Location;
import com.example.kursova.repository.BookingRepository;
import com.example.kursova.repository.LocationRepository;
import com.example.kursova.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LocationRepository locationRepository;

    @GetMapping("/bookings/active")
    public ResponseEntity<?> getActiveBookings(HttpSession session) {
        if (Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
            return ResponseEntity.ok(bookingRepository.findAll());
        }
        return ResponseEntity.status(403).body("Доступ заборонено");
    }

    @PostMapping("/bookings/toggle-pay")
    public ResponseEntity<?> togglePaymentStatus(@RequestParam Integer id, @RequestParam Boolean isPaid, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) return ResponseEntity.status(403).build();
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setIspaid(isPaid);
            bookingRepository.save(booking);
            return ResponseEntity.ok(Collections.singletonMap("status", "success"));
        }
        return ResponseEntity.status(404).body("Booking not found");
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id, HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) return ResponseEntity.status(403).build();
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.ok(Collections.singletonMap("status", "success"));
        }
        return ResponseEntity.status(404).body("Booking not found");
    }

    @PostMapping("/add-location")
    public String addLocation(@RequestParam String type, @RequestParam Integer capacity,
                              @RequestParam Double pricePerDay, @RequestParam String locationNumber,
                              @RequestParam(required = false) String imageUrl, @RequestParam(required = false) String note,
                              HttpSession session) {
        if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) return "error_no_permission";
        Location newLocation = new Location();
        newLocation.setType(type);
        newLocation.setCapacity(capacity);
        newLocation.setPricePerDay(pricePerDay);
        newLocation.setLocationNumber(locationNumber);
        newLocation.setImageUrl(imageUrl);
        newLocation.setNote(note);
        locationRepository.save(newLocation);
        return "success_add";
    }
}