package com.cincygolf.finder.model;

import java.util.List;

public record GolfCourse(
        String id,
        String name,
        String address,
        String city,
        String state,
        String zip,
        double latitude,
        double longitude,
        int holes,
        Integer par,
        Integer yardage,
        Difficulty difficulty,
        Integer slope,
        int priceLevel,
        Integer greenFeeMin,
        Integer greenFeeMax,
        CourseType type,
        String designer,
        Integer yearOpened,
        List<String> amenities,
        String website,
        String bookingUrl,
        String description
) {
}
