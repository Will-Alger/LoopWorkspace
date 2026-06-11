package com.cincygolf.finder.service;

import com.cincygolf.finder.model.CourseType;
import com.cincygolf.finder.model.Difficulty;

import java.util.Set;

public record CourseSearchCriteria(
        String query,
        double maxDistanceMiles,
        Set<Difficulty> difficulties,
        Set<Integer> priceLevels,
        Set<CourseType> types,
        Integer minHoles,
        SortOption sort
) {
    public enum SortOption {
        DISTANCE, NAME, PRICE_ASC, PRICE_DESC, DIFFICULTY
    }
}
