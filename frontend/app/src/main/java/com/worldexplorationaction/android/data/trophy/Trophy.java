package com.worldexplorationaction.android.data.trophy;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Objects;

public class Trophy implements Serializable {
    @SerializedName("trophy_id")
    public final String id;
    @SerializedName("name")
    public final String title;
    public final double latitude;
    public final double longitude;
    @SerializedName("number_of_collectors")
    private final int numberOfCollectors;
    private final String quality;
    private final int hashCode;
    @SerializedName("collected")
    private final boolean isCollected;

    public Trophy(String id, String title, Quality quality, double latitude, double longitude, boolean isCollected) {
        this.id = id;
        this.title = title;
        this.quality = quality.toString();
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashCode = id.hashCode();
        this.isCollected = isCollected;
        this.numberOfCollectors = 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Trophy)) return false;
        Trophy trophy = (Trophy) o;
        return Double.compare(trophy.latitude, latitude) == 0 && Double.compare(trophy.longitude, longitude) == 0 && numberOfCollectors == trophy.numberOfCollectors && hashCode == trophy.hashCode && isCollected == trophy.isCollected && Objects.equals(id, trophy.id) && Objects.equals(title, trophy.title) && Objects.equals(quality, trophy.quality);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, latitude, longitude, numberOfCollectors, quality, hashCode, isCollected);
    }

    @NonNull
    @Override
    public String toString() {
        return "Trophy{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", numberOfCollectors=" + numberOfCollectors +
                ", quality='" + quality + '\'' +
                ", hashCode=" + hashCode +
                ", isCollected=" + isCollected +
                '}';
    }

    public String getId() {
        return id;
    }

    public String getGooglePlaceId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Quality getQuality() {
        return Quality.parse(quality);
    }

    public int getNumberOfCollectors() {
        return numberOfCollectors;
    }

    public boolean getIsCollected() {
        return isCollected;
    }

    public enum Quality {
        GOLD, SILVER, BRONZE;

        public static Quality parse(String s) {
            switch (s) {
                case "Gold":
                    return Quality.GOLD;
                case "Silver":
                    return Quality.SILVER;
                case "Bronze":
                    return Quality.BRONZE;
                default:
                    throw new IllegalStateException();
            }
        }

        @NonNull
        @Override
        public String toString() {
            switch (this) {
                case GOLD:
                    return "Gold";
                case SILVER:
                    return "Silver";
                case BRONZE:
                    return "Bronze";
                default:
                    throw new IllegalStateException();
            }
        }
    }
}
