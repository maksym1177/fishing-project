package com.example.kursova.controller;

import com.example.kursova.model.Booking;
import com.example.kursova.model.Location;
import com.example.kursova.model.User;
import com.example.kursova.repository.BookingRepository;
import com.example.kursova.repository.LocationRepository;
import com.example.kursova.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/register")
    public String register(@RequestParam String regName,
                           @RequestParam String regEmail,
                           @RequestParam String regPassword) {
        if (userRepository.findByEmail(regEmail) != null) {
            return "error_email_taken";
        }
        User user = new User();
        user.setUsername(regName);
        user.setEmail(regEmail);
        user.setAdmin(false);
        user.setDiscount(5);
        user.setPassword(passwordEncoder.encode(regPassword));
        userRepository.save(user);
        return "success_reg";
    }


    @PostMapping("/login")
    public String login(@RequestParam String loginEmail,
                        @RequestParam String loginPassword,
                        HttpSession session) {
        User user = userRepository.findByEmail(loginEmail);
        if (user != null && passwordEncoder.matches(loginPassword, user.getPassword())) {
            session.setAttribute("user", user.getEmail());
            session.setAttribute("userName", user.getUsername());
            session.setAttribute("isAdmin", user.isAdmin());
            return user.isAdmin() ? "success_admin" : "success_user";
        }
        return "fail";
    }


    @GetMapping("/user/get-profile")
    public User getProfile(HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email == null) return null;
        return userRepository.findByEmail(email);
    }


    @PostMapping("/user/update-profile")
    public String updateProfile(@RequestParam String newName,
                                @RequestParam String newPhone,
                                HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email == null) return "error_auth";

        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setUsername(newName);
            user.setPhone(newPhone);
            userRepository.save(user);
            session.setAttribute("userName", newName);
            return "success_update";
        }
        return "error_user_not_found";
    }



    @GetMapping("/check-auth")
    public Map<String, Object> checkAuth(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Object userEmail = session.getAttribute("user");
        if (userEmail != null) {
            response.put("authenticated", true);
            response.put("email", userEmail);
            response.put("name", session.getAttribute("userName"));
            response.put("isAdmin", session.getAttribute("isAdmin"));
        } else {
            response.put("authenticated", false);
        }
        return response;
    }

    @GetMapping("/logout")
    public ModelAndView logout(HttpSession session) {
        session.invalidate();
        return new ModelAndView("redirect:/index.html");
    }
    @GetMapping("/user/my-bookings")
    public List<Booking> getMyBookings(HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email == null) return null;

        User user = userRepository.findByEmail(email);
        if (user == null) return null;

        return bookingRepository.findByUser(user);
    }
    @Transactional
    @DeleteMapping("/bookings/cancel/{id}")
    public String cancelBooking(@PathVariable Integer id, HttpSession session) {
        String currentUserEmail = (String) session.getAttribute("user");
        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");

        if (currentUserEmail == null) return "error_auth";

        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) return "error_not_found";

        boolean isOwner = (booking.getUser() != null && booking.getUser().getEmail().equals(currentUserEmail));

        if (isOwner || Boolean.TRUE.equals(isAdmin)) {

            bookingRepository.deleteBookingById(id);
            bookingRepository.flush();
            return "success_deleted";
        }

        return "error_no_permission";
    }

    @RestController
    @RequestMapping("/api/admin")
    public class AdminController {

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private LocationRepository locationRepository;

        @GetMapping("/bookings/active")
        public ResponseEntity<?> getActiveBookings(HttpSession session) {
            Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
            if (Boolean.TRUE.equals(isAdmin)) {
                List<Booking> allBookings = bookingRepository.findAll();
                return ResponseEntity.ok(allBookings);
            }
            return ResponseEntity.status(403).body("Доступ заборонено");
        }
        @PostMapping("/bookings/toggle-pay")
        public ResponseEntity<?> togglePaymentStatus(@RequestParam Integer id, @RequestParam Boolean isPaid, HttpSession session) {
            if (!Boolean.TRUE.equals(session.getAttribute("isAdmin"))) {
                return ResponseEntity.status(403).build();
            }

            Optional<Booking> bookingOpt = bookingRepository.findById(id);
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                booking.setIspaid(isPaid);
                bookingRepository.save(booking);
                return ResponseEntity.ok("success");
            }
            return ResponseEntity.status(404).body("Booking not found");
        }
        @PostMapping("/add-location")
        public String addLocation(@RequestParam String type,
                                  @RequestParam Integer capacity,
                                  @RequestParam Double pricePerDay,
                                  @RequestParam String locationNumber,
                                  @RequestParam(required = false) String imageUrl,
                                  @RequestParam(required = false) String note,
                                  HttpSession session) {

            Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
            if (!Boolean.TRUE.equals(isAdmin)) {
                return "error_no_permission";
            }

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

        private boolean checkIfAdmin(Integer id) {
            return userRepository.findById(id)
                    .map(User::isAdmin)
                    .orElse(false);
        }
    }
    @GetMapping("/locations/by-type")
    public List<Location> getLocationsByType(@RequestParam String type, @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        return locationRepository.findByType(type).stream()
                .filter(loc -> !bookingRepository.existsByLocationAndDate(loc, localDate))
                .collect(Collectors.toList());
    }

    @PostMapping("/create-booking")
    public String createBooking(@RequestParam Integer locationId, @RequestParam String date,
                                @RequestParam(required = false) String guestName,
                                @RequestParam(required = false) String guestEmail,
                                @RequestParam(required = false) String guestPhone, HttpSession session) {
        Location loc = locationRepository.findById(locationId).orElse(null);
        LocalDate d = LocalDate.parse(date);
        if (loc == null || d.isBefore(LocalDate.now()) || bookingRepository.existsByLocationAndDate(loc, d))
            return "error";

        Booking b = new Booking();
        b.setLocation(loc);
        b.setDate(d);
        b.setIspaid(false);

        String email = (String) session.getAttribute("user");
        if (email != null) {
            User u = userRepository.findByEmail(email);
            b.setUser(u);
            b.setGuestName(u.getUsername());
            b.setGuestEmail(u.getEmail());
            b.setGuestPhone(u.getPhone());
        } else {
            b.setGuestName(guestName);
            b.setGuestEmail(guestEmail);
            b.setGuestPhone(guestPhone);
        }
        bookingRepository.save(b);
        return "success_booking";
    }

    @GetMapping("/user/details")
    public ResponseEntity<?> getUserDetails(HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email == null) return ResponseEntity.status(401).build();
        User u = userRepository.findByEmail(email);
        Map<String, String> data = new HashMap<>();
        data.put("name", u.getUsername());
        data.put("email", u.getEmail());
        data.put("phone", u.getPhone());
        return ResponseEntity.ok(data);
    }
    @PostMapping("/user/update-discount")
    public String updateDiscount(@RequestParam Integer discount, HttpSession session) {
        String email = (String) session.getAttribute("user");
        if (email == null) return "error_auth";

        User user = userRepository.findByEmail(email);
        if (user != null) {
            if (discount > user.getDiscount()) {
                user.setDiscount(discount);
                userRepository.save(user);
                return "success_discount_updated";
            }
            return "no_change";
        }
        return "error_user_not_found";
    }


}
