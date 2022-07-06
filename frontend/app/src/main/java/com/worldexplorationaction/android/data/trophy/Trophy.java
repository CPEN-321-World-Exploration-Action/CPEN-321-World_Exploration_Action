package com.worldexplorationaction.android.data.trophy;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class Trophy {
    public final String id;
    public final String title;
    public final Quality quality;
    public final double latitude;
    public final double longitude;
    private final int hashCode;

    public Trophy(String id, String title, Quality quality, double latitude, double longitude) {
        this.id = id;
        this.title = title;
        this.quality = quality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashCode = id.hashCode();
    }

    @Override
    public int hashCode() {
        return hashCode;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        if (this == obj) {
            return true;
        } else if (!(obj instanceof Trophy)) {
            return false;
        }
        Trophy that = (Trophy) obj;
        if (this.id.equals(that.id) && this.title.equals(that.title) && this.latitude == that.latitude && this.longitude == that.longitude) {
            return true;
        } else {
            return super.equals(obj);
        }
    }

    @NonNull
    @Override
    public String toString() {
        return "Trophy{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }

    public enum Quality {
        GOLD, SILVER, BRONZE
    }
}
