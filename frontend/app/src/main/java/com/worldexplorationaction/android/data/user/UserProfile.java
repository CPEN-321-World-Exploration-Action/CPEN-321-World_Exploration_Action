package com.worldexplorationaction.android.data.user;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Objects;

public class UserProfile implements Serializable {
    @SerializedName("user_id")
    private final String id;
    @SerializedName(value="picture", alternate = "imageUrl")
    private final String imageUrl;
    private final String name;
    private final String email;
    private final int score;
    private final Integer rank;

    public UserProfile(String id, String imageUrl, String name, int score) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.score = score;
        this.email = null;
        this.rank = null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserProfile)) return false;
        UserProfile profile = (UserProfile) o;
        return score == profile.score && Objects.equals(id, profile.id) && Objects.equals(imageUrl, profile.imageUrl) && Objects.equals(name, profile.name) && Objects.equals(email, profile.email) && Objects.equals(rank, profile.rank);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, imageUrl, name, email, score, rank);
    }

    @NonNull
    @Override
    public String toString() {
        return "UserProfile{" +
                "id='" + id + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", score=" + score +
                ", rank=" + rank +
                '}';
    }

    public String getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public int getScore() {
        return score;
    }

    public Integer getRank() {
        return rank;
    }
}
