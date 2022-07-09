package com.worldexplorationaction.android.ui.profile;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.data.photo.Photo;
import com.worldexplorationaction.android.data.photo.PhotoService;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.Collections;
import java.util.List;

public class ProfileViewModel extends ViewModel {
    private static final String TAG = ProfileViewModel.class.getSimpleName();
    private final UserService userService;
    private final PhotoService photoService;
    private final MutableLiveData<UserProfile> userProfile;
    private final MutableLiveData<List<Photo>> photos;

    public ProfileViewModel() {
        this.userProfile = new MutableLiveData<>();
        this.photos = new MutableLiveData<>(Collections.emptyList());
        this.userService = UserService.getService();
        this.photoService = PhotoService.getService();
    }

    public LiveData<UserProfile> getUserProfile() {
        return userProfile;
    }

    public MutableLiveData<List<Photo>> getPhotos() {
        return photos;
    }

    public void fetchProfileAndPhotos(String userId) {
        userService.getUserProfile(userId).enqueue(new CustomCallback<>(responseBody -> {
            Log.d(TAG, "userService.getUserProfile succeeded");
            userProfile.setValue(responseBody);
        }, null, errorMessage -> {
            Log.e(TAG, "userService.getUserProfile error: " + errorMessage);
        }));

        photoService.getPhotoIdsByUserId(userId).enqueue(new CustomCallback<>(responseBody -> {
            Log.d(TAG, "photoService.getPhotoIdsByUserId succeeded");
            if (responseBody == null) {
                Log.e(TAG, "photoService.getPhotoIdsByUserId null response");
                return;
            }
            photos.setValue(responseBody);
        }, null, errorMessage -> {
            Log.e(TAG, "photoService.getPhotoIdsByUserId error: " + errorMessage);
        }));
    }

    public void logOut() {
        userService.logout();
    }
}