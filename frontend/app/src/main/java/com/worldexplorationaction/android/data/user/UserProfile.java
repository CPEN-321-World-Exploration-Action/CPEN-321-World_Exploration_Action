package com.worldexplorationaction.android.data.user;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.util.Objects;

public class UserProfile {
    @SerializedName(value = "id", alternate = {"user_id"})
    private final String id;
    private final String image;
    private final String name;
    private String email;
    private final int score;

    public UserProfile(String id, String image, String name, int score) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.score = score;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserProfile)) return false;
        UserProfile that = (UserProfile) o;
        return score == that.score && id.equals(that.id) && Objects.equals(image, that.image) && name.equals(that.name);
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
                ", image='" + image + '\'' +
                ", name='" + name + '\'' +
                ", score=" + score +
                '}';
    }

    public String getId() {
        return id;
    }

    public String getImage() {
        return image;
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
