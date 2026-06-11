package com.cincygolf.finder;

import com.cincygolf.finder.util.GeoUtil;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GeoUtilTest {

    @Test
    void zeroDistanceForSamePoint() {
        assertThat(GeoUtil.haversineMiles(39.1031, -84.5120, 39.1031, -84.5120))
                .isEqualTo(0.0);
    }

    @Test
    void cincinnatiToColumbusIsRoughlyHundredMiles() {
        double miles = GeoUtil.haversineMiles(39.1031, -84.5120, 39.9612, -82.9988);
        assertThat(miles).isBetween(95.0, 110.0);
    }

    @Test
    void downtownToBlueAshIsShortDrive() {
        double miles = GeoUtil.haversineMiles(39.1031, -84.5120, 39.2447, -84.3947);
        assertThat(miles).isBetween(10.0, 15.0);
    }
}
