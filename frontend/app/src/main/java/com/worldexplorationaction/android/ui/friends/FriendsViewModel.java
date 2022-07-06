package com.worldexplorationaction.android.ui.friends;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.worldexplorationaction.android.R;
import com.worldexplorationaction.android.data.user.UserProfile;
import com.worldexplorationaction.android.data.user.UserService;
import com.worldexplorationaction.android.ui.userlist.UserListMode;
import com.worldexplorationaction.android.ui.userlist.UserListViewModel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FriendsViewModel extends ViewModel implements UserListViewModel {
    private static final String TAG = FriendsViewModel.class.getSimpleName();

    private final UserService userService;
    private final MutableLiveData<String> errorMessage;
    private final MutableLiveData<Integer> popupMessageResId;
    private final MutableLiveData<List<UserProfile>> displayingUsers;
    private final List<UserProfile> friendRequests;
    private final boolean isSearching;
    private List<UserProfile> friends;
    private Call<List<UserProfile>> fetchFriendsCall;
    private Call<List<UserProfile>> fetchFriendRequestsCall;

    public FriendsViewModel() {
        this.userService = UserService.getService();
        this.errorMessage = new MutableLiveData<>();
        this.popupMessageResId = new MutableLiveData<>();
        this.displayingUsers = new MutableLiveData<>(Collections.emptyList());
        this.friends = Collections.emptyList();
        this.friendRequests = Collections.emptyList();
        this.isSearching = false;
    }

    @Override
    public LiveData<List<UserProfile>> getUsers() {
        return displayingUsers;
    }

    @Override
    public List<UserListMode> getModes() {
        if (displayingUsers.getValue() == null) {
            return Collections.emptyList();
        }
        if (isSearching) {
            int size = displayingUsers.getValue().size();
            List<UserListMode> modes = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                modes.add(UserListMode.SEARCH);
            }
            return modes;
        } else {
            List<UserListMode> modes = new ArrayList<>(displayingUsers.getValue().size());
            for (int i = 0; i < friendRequests.size(); i++) {
                modes.add(UserListMode.FRIEND_REQUEST);
            }
            for (int i = 0; i < friends.size(); i++) {
                modes.add(UserListMode.FRIEND);
            }
            return modes;
        }
    }

    public void fetchFriends() {
        if (fetchFriendsCall != null) {
            fetchFriendsCall.cancel();
        }
        fetchFriendsCall = userService.getFriendProfiles();
        fetchFriendsCall.enqueue(new Callback<List<UserProfile>>() {
            @Override
            public void onResponse(@NonNull Call<List<UserProfile>> call, @NonNull Response<List<UserProfile>> response) {
                if (response.isSuccessful()) {
                    friends = response.body();
                } else {
                    Log.e(TAG, "userService.getFriendProfiles failed with code " + response.code() + " body: " + response.errorBody());
                    friends = Collections.emptyList();
                    handleFetchFailure("Error code " + response.code());
                }
                updateDisplayingUsers();
            }

            @Override
            public void onFailure(@NonNull Call<List<UserProfile>> call, @NonNull Throwable t) {
                if (call.isCanceled()) {
                    Log.i(TAG, "userService.getFriendProfiles canceled");
                    return;
                }
                Log.e(TAG, "userService.getFriendProfiles failed: " + t);
                friends = Collections.emptyList();
                updateDisplayingUsers();
                handleFetchFailure(t.getLocalizedMessage());
            }
        });
    }

    public void fetchFriendRequests() {

    }

    public void updateSearchFor(String query) {

    }

    private void updateDisplayingUsers() {
        List<UserProfile> users = new ArrayList<>();
        for (UserProfile request : friendRequests) {
            users.add(new UserProfile(
                    request.getId(),
                    request.getImageUrl(),
                    "(Friend Request) " + request.getName(),
                    request.getScore()
            ));
        }
        users.addAll(friendRequests);
        users.addAll(friends);
        displayingUsers.setValue(users);
        if (users.isEmpty()) {
            popupMessageResId.setValue(isSearching ? R.string.friends_search_no_found : R.string.friends_no_friend);
        } else {
            popupMessageResId.setValue(null);
        }
    }

    private void handleFetchFailure(String message) {
        errorMessage.setValue(message);
        errorMessage.setValue(null);
    }
}