package com.worldexplorationaction.android.ui.userlist;

import androidx.lifecycle.LiveData;

import com.worldexplorationaction.android.data.user.UserProfile;

import java.util.List;

/**
 * View Model of the {@link UserListView}
 */
public interface UserListViewModel {
    /**
     * Get users to display in the user list
     */
    LiveData<List<UserProfile>> getUsers();

    /**
     * Get the displaying mode for each row
     */
    List<UserListMode> getModes();
}
