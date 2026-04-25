package com.example.kursova.repository;

import com.example.kursova.model.Booking;
import com.example.kursova.model.Location;
import com.example.kursova.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUser(User user);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.location.type = :type AND b.date = :date")
    long countByLocationTypeAndDate(@Param("type") String type, @Param("date") LocalDate date);

    List<Booking> findAllByDateAfterOrderByDateAsc(LocalDate date);

    @Modifying
    @Transactional
    @Query("DELETE FROM Booking b WHERE b.id = :id")
    void deleteBookingById(@Param("id") Integer id);

}
