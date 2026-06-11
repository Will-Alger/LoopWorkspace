package com.cincygolf.finder.model;

/**
 * A golf course together with its computed distance from the search origin
 * (downtown Cincinnati by default).
 */
public record CourseResult(GolfCourse course, double distanceMiles) {
}
