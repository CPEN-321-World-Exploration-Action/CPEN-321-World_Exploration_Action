package com.worldexplorationaction.android.ui.trophy;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.photo.PhotoService;
import com.worldexplorationaction.android.data.trophy.Trophy;
import com.worldexplorationaction.android.data.trophy.TrophyService;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.Collections;
import java.util.List;

public class CollectTrophyViewModel extends TrophyDetailsViewModel {

    private static final String TAG = CollectTrophyViewModel.class.getSimpleName();
    private final UserService userService;
    private final PhotoService photoService;
    private final MutableLiveData<Trophy> trophy;
    private final TrophyService trophyService;
    private final MutableLiveData<List<Photo>> photos;
    private final MutableLiveData<UserProfile> userProfile;
    private final MutableLiveData<String> toastMessage;

    public CollectTrophyViewModel() {
        this.userProfile = new MutableLiveData<>();
        this.toastMessage = new MutableLiveData<>();
        this.trophy = new MutableLiveData<>();
        this.photos = new MutableLiveData<>(Collections.emptyList());
        this.userService = UserService.getService();
        this.photoService = PhotoService.getService();
        this.trophyService = TrophyService.getService();
    }

    public LiveData<Trophy> getTrophyDetails() {
        return trophy;
    }

    public LiveData<UserProfile> getUserProfile() {
        return userProfile;
    }

    public MutableLiveData<List<Photo>> getPhotos() {
        return photos;
    }


    public void uploadPhoto(String userId, String trophyId, String photoId) {
        photoService.uploadPhoto(userId, trophyId, photoId).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "photo is uploaded successfully");
            showToastMessage("photo is uploaded successfully");
        }, null, errorMessage -> {
            Log.e(TAG, "uploading photo is failed " + errorMessage);
            showToastMessage("Could not upload photo");
        }));
    }

    public void collectTrophy(String userId, String trophyId) {
        trophyService.collectTrophy(userId, trophyId).enqueue(new CustomCallback<>(unused -> {
            Log.i(TAG, "trophy is collected successfully");
            showToastMessage("You have collected this trophy");
        }, null, errorMessage -> {
            Log.e(TAG, "collecting trophy is failed " + errorMessage);
            showToastMessage("Could not collect trophy");
        }));
    }


    private void showToastMessage(String value) {
        toastMessage.setValue(value);
        toastMessage.setValue(null);
    }
}
