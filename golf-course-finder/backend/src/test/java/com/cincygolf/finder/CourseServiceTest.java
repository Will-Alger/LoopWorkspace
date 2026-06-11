package com.cincygolf.finder;

import com.cincygolf.finder.model.CourseResult;
import com.cincygolf.finder.model.CourseType;
import com.cincygolf.finder.model.Difficulty;
import com.cincygolf.finder.service.CourseSearchCriteria;
import com.cincygolf.finder.service.CourseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CourseServiceTest {

    @Autowired
    private CourseService courseService;

    private CourseSearchCriteria criteria(String q, double radius, Set<Difficulty> difficulties,
                                          Set<Integer> prices, Set<CourseType> types, Integer minHoles,
                                          CourseSearchCriteria.SortOption sort) {
        return new CourseSearchCriteria(q, radius, difficulties, prices, types, minHoles, sort);
    }

    @Test
    void returnsAllCoursesWithinDefaultRadiusSortedByDistance() {
        List<CourseResult> results = courseService.search(criteria(
                null, 50, Set.of(), Set.of(), Set.of(), null,
                CourseSearchCriteria.SortOption.DISTANCE));

        assertThat(results).hasSizeGreaterThan(30);
        assertThat(results).isSortedAccordingTo(
                (a, b) -> Double.compare(a.distanceMiles(), b.distanceMiles()));
        assertThat(results).allSatisfy(r -> assertThat(r.distanceMiles()).isLessThanOrEqualTo(50));
    }

    @Test
    void radiusFilterExcludesDistantCourses() {
        List<CourseResult> nearby = courseService.search(criteria(
                null, 5, Set.of(), Set.of(), Set.of(), null,
                CourseSearchCriteria.SortOption.DISTANCE));

        assertThat(nearby).isNotEmpty();
        assertThat(nearby).allSatisfy(r -> assertThat(r.distanceMiles()).isLessThanOrEqualTo(5));
    }

    @Test
    void difficultyFilterReturnsOnlyMatchingCourses() {
        List<CourseResult> experts = courseService.search(criteria(
                null, 50, Set.of(Difficulty.EXPERT), Set.of(), Set.of(), null,
                CourseSearchCriteria.SortOption.DISTANCE));

        assertThat(experts).isNotEmpty();
        assertThat(experts).allSatisfy(
                r -> assertThat(r.course().difficulty()).isEqualTo(Difficulty.EXPERT));
    }

    @Test
    void priceAndTypeFiltersCombine() {
        List<CourseResult> results = courseService.search(criteria(
                null, 50, Set.of(), Set.of(1), Set.of(CourseType.PUBLIC), null,
                CourseSearchCriteria.SortOption.DISTANCE));

        assertThat(results).isNotEmpty();
        assertThat(results).allSatisfy(r -> {
            assertThat(r.course().priceLevel()).isEqualTo(1);
            assertThat(r.course().type()).isEqualTo(CourseType.PUBLIC);
        });
    }

    @Test
    void textSearchFindsCourseByName() {
        List<CourseResult> results = courseService.search(criteria(
                "blue ash", 50, Set.of(), Set.of(), Set.of(), null,
                CourseSearchCriteria.SortOption.DISTANCE));

        assertThat(results).hasSize(1);
        assertThat(results.getFirst().course().name()).isEqualTo("Blue Ash Golf Course");
    }

    @Test
    void minHolesFilterFindsMultiCourseFacilities() {
        List<CourseResult> results = courseService.search(criteria(
                null, 50, Set.of(), Set.of(), Set.of(), 27,
                CourseSearchCriteria.SortOption.DISTANCE));

        assertThat(results).isNotEmpty();
        assertThat(results).allSatisfy(r -> assertThat(r.course().holes()).isGreaterThanOrEqualTo(27));
    }
}
