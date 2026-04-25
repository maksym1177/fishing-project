package com.example.kursova.controller;

import com.example.kursova.model.Location;
import com.example.kursova.model.User;
import com.example.kursova.repository.BookingRepository;
import com.example.kursova.repository.LocationRepository;
import com.example.kursova.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock private UserRepository userRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private LocationRepository locationRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void testRegisterSuccess() throws Exception {
        when(userRepository.findByEmail("new@test.com")).thenReturn(null);

        mockMvc.perform(post("/api/register")
                        .param("regName", "Ivan")
                        .param("regEmail", "new@test.com")
                        .param("regPassword", "12345"))
                .andExpect(status().isOk())
                .andExpect(content().string("success_reg"));

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterEmailTaken() throws Exception {
        when(userRepository.findByEmail("exist@test.com")).thenReturn(new User());

        mockMvc.perform(post("/api/register")
                        .param("regName", "Ivan")
                        .param("regEmail", "exist@test.com")
                        .param("regPassword", "12345"))
                .andExpect(status().isOk())
                .andExpect(content().string("error_email_taken"));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginUserSuccess() throws Exception {
        User user = new User();
        user.setEmail("user@test.com");
        user.setPassword("hashed_pass");
        user.setAdmin(false);

        when(userRepository.findByEmail("user@test.com")).thenReturn(user);
        when(passwordEncoder.matches("raw_pass", "hashed_pass")).thenReturn(true);

        mockMvc.perform(post("/api/login")
                        .param("loginEmail", "user@test.com")
                        .param("loginPassword", "raw_pass"))
                .andExpect(status().isOk())
                .andExpect(content().string("success_user"));
    }

    @Test
    void testUpdateProfileSuccess() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("user", "user@test.com");

        User user = new User();
        user.setEmail("user@test.com");

        when(userRepository.findByEmail("user@test.com")).thenReturn(user);

        mockMvc.perform(post("/api/user/update-profile")
                        .session(session)
                        .param("newName", "NewName")
                        .param("newPhone", "0991234567"))
                .andExpect(status().isOk())
                .andExpect(content().string("success_update"));

        verify(userRepository).save(user);
    }


}