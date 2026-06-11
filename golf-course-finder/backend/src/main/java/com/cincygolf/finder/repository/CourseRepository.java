package com.cincygolf.finder.repository;

import com.cincygolf.finder.model.GolfCourse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.Optional;

/**
 * In-memory repository backed by the bundled courses.json dataset.
 */
@Repository
public class CourseRepository {

    private final ObjectMapper objectMapper;
    private List<GolfCourse> courses = List.of();

    public CourseRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void load() {
        try (InputStream in = new ClassPathResource("data/courses.json").getInputStream()) {
            GolfCourse[] loaded = objectMapper.readValue(in, GolfCourse[].class);
            courses = List.of(loaded);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load course dataset", e);
        }
    }

    public List<GolfCourse> findAll() {
        return courses;
    }

    public Optional<GolfCourse> findById(String id) {
        return courses.stream().filter(c -> c.id().equals(id)).findFirst();
    }
}
