package com.worldexplorationaction.android.ui.profile;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.data.user.UserProfile;

public class ProfileViewModel extends ViewModel {
    private final MutableLiveData<UserProfile> userProfile;

    public ProfileViewModel() {
        userProfile = new MutableLiveData<>();
    }

    public LiveData<UserProfile> getUserProfile() {
        return userProfile;
    }
}