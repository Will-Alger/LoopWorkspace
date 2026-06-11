package com.cincygolf.finder.model;

public enum CourseType {
    PUBLIC("Public"),
    SEMI_PRIVATE("Semi-private"),
    PRIVATE("Private");

    private final String label;

    CourseType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
