package com.worldexplorationaction.android.user;

import androidx.annotation.NonNull;

import java.util.Objects;

public class UserProfile {
    public final String id;
    public final String image;
    public final String name;
    public final int score;

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
}
