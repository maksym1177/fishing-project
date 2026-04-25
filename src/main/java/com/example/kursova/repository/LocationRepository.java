package com.example.kursova.repository;

import com.example.kursova.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    List<Location> findByType(String type);
}