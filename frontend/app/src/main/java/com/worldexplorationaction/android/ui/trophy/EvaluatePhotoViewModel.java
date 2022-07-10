package com.worldexplorationaction.android.ui.trophy;

import android.util.Log;

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

public class EvaluatePhotoViewModel extends ViewModel {

    private static final String TAG = EvaluatePhotoViewModel.class.getSimpleName();
    private final UserService userService;
    private final PhotoService photoService;
    private final MutableLiveData<Trophy> trophy;
    private final TrophyService trophyService;
    private final MutableLiveData<List<Photo>> photos;
    private final MutableLiveData<UserProfile> userProfile;
    private final MutableLiveData<String> toastMessage;

    public EvaluatePhotoViewModel() {
        this.userProfile = new MutableLiveData<>();
        this.toastMessage = new MutableLiveData<>();
        this.trophy = new MutableLiveData<>();
        this.photos = new MutableLiveData<>(Collections.emptyList());
        this.userService = UserService.getService();
        this.photoService = PhotoService.getService();
        this.trophyService = TrophyService.getService();
    }

    private void likePhoto(String userId, String photoId) {
        photoService.userLikePhoto(userId, photoId).enqueue(new CustomCallback<>(responseBody -> {
            if (responseBody == null) {
                Log.e(TAG, "photoService.userLikePhoto has null body");
                return;
            }
        }, null, errorMessage -> {
            Log.e(TAG, "photoService.userLikePhoto has an error" + errorMessage);
        }));
    }

    public void displayingPhotoInfo(UserProfile user, Photo photo) {
        userProfile.setValue(user);
        likePhoto(user.getId(), photo.getPhotoId());
    }
}
