package com.cincygolf.finder.web;

import com.cincygolf.finder.model.CourseResult;
import com.cincygolf.finder.model.CourseType;
import com.cincygolf.finder.model.Difficulty;
import com.cincygolf.finder.service.CourseSearchCriteria;
import com.cincygolf.finder.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    public List<CourseResult> search(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "50") double radius,
            @RequestParam(required = false) Set<Difficulty> difficulty,
            @RequestParam(required = false) Set<Integer> price,
            @RequestParam(required = false) Set<CourseType> type,
            @RequestParam(required = false) Integer minHoles,
            @RequestParam(defaultValue = "DISTANCE") CourseSearchCriteria.SortOption sort) {
        CourseSearchCriteria criteria = new CourseSearchCriteria(
                q,
                radius,
                difficulty == null ? Set.of() : difficulty,
                price == null ? Set.of() : price,
                type == null ? Set.of() : type,
                minHoles,
                sort);
        return courseService.search(criteria);
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseResult> byId(@PathVariable String id) {
        return courseService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Filter option metadata for the frontend. */
    @GetMapping("/meta")
    public Map<String, Object> meta() {
        return Map.of(
                "center", Map.of(
                        "latitude", CourseService.CINCINNATI_LAT,
                        "longitude", CourseService.CINCINNATI_LNG,
                        "label", "Downtown Cincinnati, OH"),
                "maxRadiusMiles", 50,
                "difficulties", Arrays.stream(Difficulty.values())
                        .map(d -> Map.of("value", d.name(), "label", d.getLabel()))
                        .toList(),
                "types", Arrays.stream(CourseType.values())
                        .map(t -> Map.of("value", t.name(), "label", t.getLabel()))
                        .toList(),
                "priceLevels", List.of(
                        Map.of("value", 1, "label", "$ — under $30"),
                        Map.of("value", 2, "label", "$$ — $30–50"),
                        Map.of("value", 3, "label", "$$$ — $50–80"),
                        Map.of("value", 4, "label", "$$$$ — $80+ / private")));
    }
}
