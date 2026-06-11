package com.cincygolf.finder.service;

import com.cincygolf.finder.model.CourseResult;
import com.cincygolf.finder.model.GolfCourse;
import com.cincygolf.finder.repository.CourseRepository;
import com.cincygolf.finder.util.GeoUtil;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class CourseService {

    /** Fountain Square, downtown Cincinnati — origin for radius searches. */
    public static final double CINCINNATI_LAT = 39.1031;
    public static final double CINCINNATI_LNG = -84.5120;

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public List<CourseResult> search(CourseSearchCriteria criteria) {
        return repository.findAll().stream()
                .map(this::withDistance)
                .filter(r -> r.distanceMiles() <= criteria.maxDistanceMiles())
                .filter(r -> matchesQuery(r.course(), criteria.query()))
                .filter(r -> criteria.difficulties().isEmpty()
                        || criteria.difficulties().contains(r.course().difficulty()))
                .filter(r -> criteria.priceLevels().isEmpty()
                        || criteria.priceLevels().contains(r.course().priceLevel()))
                .filter(r -> criteria.types().isEmpty()
                        || criteria.types().contains(r.course().type()))
                .filter(r -> criteria.minHoles() == null
                        || r.course().holes() >= criteria.minHoles())
                .sorted(comparatorFor(criteria.sort()))
                .toList();
    }

    public Optional<CourseResult> findById(String id) {
        return repository.findById(id).map(this::withDistance);
    }

    private CourseResult withDistance(GolfCourse course) {
        double distance = GeoUtil.haversineMiles(
                CINCINNATI_LAT, CINCINNATI_LNG, course.latitude(), course.longitude());
        return new CourseResult(course, Math.round(distance * 10.0) / 10.0);
    }

    private boolean matchesQuery(GolfCourse course, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        String q = query.toLowerCase(Locale.ROOT);
        return contains(course.name(), q)
                || contains(course.city(), q)
                || contains(course.zip(), q)
                || contains(course.designer(), q)
                || contains(course.description(), q);
    }

    private boolean contains(String value, String q) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(q);
    }

    private Comparator<CourseResult> comparatorFor(CourseSearchCriteria.SortOption sort) {
        Comparator<CourseResult> byDistance = Comparator.comparingDouble(CourseResult::distanceMiles);
        return switch (sort) {
            case NAME -> Comparator.comparing(r -> r.course().name(), String.CASE_INSENSITIVE_ORDER);
            case PRICE_ASC -> Comparator.<CourseResult>comparingInt(r -> r.course().priceLevel())
                    .thenComparing(byDistance);
            case PRICE_DESC -> Comparator.<CourseResult>comparingInt(r -> r.course().priceLevel())
                    .reversed().thenComparing(byDistance);
            case DIFFICULTY -> Comparator.<CourseResult, Integer>comparing(
                    r -> r.course().difficulty().ordinal()).thenComparing(byDistance);
            case DISTANCE -> byDistance;
        };
    }
}
