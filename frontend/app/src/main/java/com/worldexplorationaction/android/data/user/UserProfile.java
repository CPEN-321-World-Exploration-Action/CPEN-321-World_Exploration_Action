package com.worldexplorationaction.android.data.user;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.util.Objects;

public class UserProfile {
    @SerializedName(value = "id", alternate = {"user_id"})
    private final String id;
    private final String imageUrl;
    private final String name;
    private final int score;
    private String email;

    public UserProfile(String id, String imageUrl, String name, int score) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.name = name;
        this.score = score;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserProfile)) return false;
        UserProfile that = (UserProfile) o;
        return score == that.score && id.equals(that.id) && Objects.equals(imageUrl, that.imageUrl) && name.equals(that.name);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @NonNull
    @Override
    public String toString() {
        return "UserProfile{" +
                "id='" + id + '\'' +
                ", image='" + imageUrl + '\'' +
                ", name='" + name + '\'' +
                ", score=" + score +
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
}
