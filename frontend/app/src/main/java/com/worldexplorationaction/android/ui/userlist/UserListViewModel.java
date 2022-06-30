package com.worldexplorationaction.android.ui.userlist;

import androidx.lifecycle.LiveData;

import com.worldexplorationaction.android.user.UserProfile;

import java.util.List;

public interface UserListViewModel {
    LiveData<List<UserProfile>> getUsers();
}
