package com.worldexplorationaction.android.ui.leaderboard;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.ui.userlist.UserListViewModel;
import com.worldexplorationaction.android.user.UserProfile;

import java.util.ArrayList;
import java.util.List;

public class LeaderboardViewModel extends ViewModel implements UserListViewModel {

    private final MutableLiveData<List<UserProfile>> users;

    public LeaderboardViewModel() {
        users = new MutableLiveData<>();

        List<UserProfile> dummy = new ArrayList<>();
        users.setValue(dummy);
    }

    @Override
    public LiveData<List<UserProfile>> getUsers() {
        return users;
    }
}