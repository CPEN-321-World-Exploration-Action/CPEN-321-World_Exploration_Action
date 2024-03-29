package com.worldexplorationaction.android.data.photo;

import androidx.annotation.NonNull;

import com.google.gson.annotations.SerializedName;
import com.worldexplorationaction.android.ui.utility.RetrofitUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

public class Photo implements Serializable {
    @SerializedName("photo_id")
    private final String photoId;
    @SerializedName("user_id")
    private final String userId;
    @SerializedName("trophy_id")
    private final String trophyId;
    @SerializedName("like")
    private final int numberOfLikes;
    @SerializedName("time")
    private final Date time;
    @SerializedName("user_liked")
    private final Boolean userLiked;

    public Photo(String photoId, String userId, String trophyId, int numberOfLikes, Date time, Boolean userLiked) {
        this.photoId = photoId;
        this.userId = userId;
        this.trophyId = trophyId;
        this.numberOfLikes = numberOfLikes;
        this.time = time;
        this.userLiked = userLiked;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Photo)) return false;
        Photo photo = (Photo) o;
        return numberOfLikes == photo.numberOfLikes && Objects.equals(photoId, photo.photoId) && Objects.equals(userId, photo.userId) && Objects.equals(trophyId, photo.trophyId) && Objects.equals(time, photo.time) && Objects.equals(userLiked, photo.userLiked);
    }

    @Override
    public int hashCode() {
        return Objects.hash(photoId, userId, trophyId, numberOfLikes, time, userLiked);
    }

    @NonNull
    @Override
    public String toString() {
        return "Photo{" +
                "photoId='" + photoId + '\'' +
                ", userId='" + userId + '\'' +
                ", trophyId='" + trophyId + '\'' +
                ", numberOfLikes=" + numberOfLikes +
                ", time=" + time +
                ", userLiked=" + userLiked +
                '}';
    }

    public String getPhotoId() {
        return photoId;
    }

    public String getUserId() {
        return userId;
    }

    public String getTrophyId() {
        return trophyId;
    }

    public int getNumberOfLikes() {
        return numberOfLikes;
    }

    public Date getTime() {
        return time;
    }

    public String getPhotoUrl() {
        return RetrofitUtils.BASE_URL + "photos/storing/" + photoId;
    }

    public Boolean getUserLiked() {
        return userLiked;
    }
}
