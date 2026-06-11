package com.cincygolf.finder.model;

public enum Difficulty {
    BEGINNER("Beginner friendly"),
    MODERATE("Moderate"),
    CHALLENGING("Challenging"),
    EXPERT("Expert");

    private final String label;

    Difficulty(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
