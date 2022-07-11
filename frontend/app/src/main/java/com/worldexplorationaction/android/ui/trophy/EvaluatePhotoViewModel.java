package com.worldexplorationaction.android.ui.trophy;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.worldexplorationaction.android.data.photo.PhotoService;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.ui.common.CommonViewModel;
import com.worldexplorationaction.android.ui.signin.SignInManager;
import com.worldexplorationaction.android.ui.utility.CustomCallback;

import java.util.Objects;

public class EvaluatePhotoViewModel extends CommonViewModel {

    private static final String TAG = EvaluatePhotoViewModel.class.getSimpleName();
    private final UserService userService;
    private final PhotoService photoService;
    private final MutableLiveData<UserProfile> userProfile;

    public EvaluatePhotoViewModel() {
        this.userProfile = new MutableLiveData<>();
        this.userService = UserService.getService();
        this.photoService = PhotoService.getService();
    }

    public LiveData<UserProfile> getUserProfile() {
        return userProfile;
    }

    public void fetchUserProfile(String userId) {
        userService.getUserProfile(userId).enqueue(new CustomCallback<>(responseBody -> {

        }, null, errorMessage -> {

        }));
    }

    public void likePhoto(String photoId) {
        String userId = Objects.requireNonNull(SignInManager.signedInUserId);
        photoService.userLikePhoto(userId, photoId).enqueue(new CustomCallback<>(responseBody -> {
            Log.i(TAG, "photoService.userLikePhoto success");
        }, null, errorMessage -> {
            Log.e(TAG, "photoService.userLikePhoto has an error" + errorMessage);
            showToastMessage("Could not like this photo: " + errorMessage);
        }));
    }
}
